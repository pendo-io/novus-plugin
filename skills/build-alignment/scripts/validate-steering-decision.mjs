#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DECISIONS = new Set(["CONTINUE", "NARROW", "PAUSE", "SWITCH", "ESCALATE"]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const EVIDENCE_KINDS = new Set(["fact", "correlation", "hypothesis"]);
const EVIDENCE_LAYERS = new Set(["planned", "built", "experienced", "shipping", "constraint"]);
const SWITCH_LAYERS = new Set(["planned", "built", "experienced", "shipping"]);
const PLAN_KEYS = ["activate", "continue", "narrow", "defer", "addValidation"];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function requireText(value, path, errors) {
  if (!hasText(value)) errors.push(path + " must be a non-empty string");
}

function validateObjectiveChange(value, path, errors) {
  if (!isObject(value)) {
    errors.push(path + " must be an object");
    return;
  }
  requireText(value.statement, path + ".statement", errors);
  requireText(value.reason, path + ".reason", errors);
  if (value.id !== null && value.id !== undefined && !hasText(value.id)) {
    errors.push(path + ".id must be a non-empty string or null");
  }
  if (
    value.resumeCondition !== null &&
    value.resumeCondition !== undefined &&
    !hasText(value.resumeCondition)
  ) {
    errors.push(path + ".resumeCondition must be a non-empty string or null");
  }
}

function validatePlanDelta(planDelta, errors) {
  if (!isObject(planDelta)) {
    errors.push("planDelta must be an object");
    return null;
  }
  for (const key of PLAN_KEYS) {
    if (!Array.isArray(planDelta[key])) {
      errors.push("planDelta." + key + " must be an array");
      continue;
    }
    planDelta[key].forEach((item, index) =>
      validateObjectiveChange(item, "planDelta." + key + "[" + index + "]", errors),
    );
  }
  return planDelta;
}

function validateEvidence(evidence, errors) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    errors.push("evidence must contain at least one item");
    return [];
  }
  evidence.forEach((item, index) => {
    const path = "evidence[" + index + "]";
    if (!isObject(item)) {
      errors.push(path + " must be an object");
      return;
    }
    requireText(item.claim, path + ".claim", errors);
    requireText(item.sourceId, path + ".sourceId", errors);
    requireText(item.windowOrStatus, path + ".windowOrStatus", errors);
    if (!EVIDENCE_KINDS.has(item.kind)) {
      errors.push(path + ".kind must be fact, correlation, or hypothesis");
    }
    if (!EVIDENCE_LAYERS.has(item.layer)) {
      errors.push(path + ".layer must be planned, built, experienced, shipping, or constraint");
    }
    if (!CONFIDENCE.has(item.confidence)) {
      errors.push(path + ".confidence must be high, medium, or low");
    }
  });
  return evidence.filter(isObject);
}

function validateExpectedOutcome(value, errors) {
  if (!isObject(value)) {
    errors.push("expectedOutcome must be an object");
    return;
  }
  requireText(value.primary, "expectedOutcome.primary", errors);
  requireText(value.direction, "expectedOutcome.direction", errors);
  requireText(value.invalidationCondition, "expectedOutcome.invalidationCondition", errors);
  if (!Array.isArray(value.leadingIndicators)) {
    errors.push("expectedOutcome.leadingIndicators must be an array");
  }
  const hasDate = hasText(value.validationDate);
  const hasReason = hasText(value.validationReason);
  if (hasDate === hasReason) {
    errors.push("expectedOutcome requires exactly one of validationDate and validationReason");
  }
}

function validateEscalation(value, errors) {
  if (!isObject(value)) {
    errors.push("ESCALATE requires escalation details");
    return;
  }
  requireText(value.reason, "escalation.reason", errors);
  requireText(value.decisionNeeded, "escalation.decisionNeeded", errors);
  requireText(value.requiredAuthority, "escalation.requiredAuthority", errors);
}

export function validateDecisionRecord(record) {
  const errors = [];
  if (!isObject(record)) return ["decision record must be an object"];

  if (record.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
  requireText(record.runId, "runId", errors);
  requireText(record.generatedAt, "generatedAt", errors);
  if (record.mode !== "autonomous-steering") {
    errors.push("mode must equal autonomous-steering");
  }
  if (!isObject(record.scope)) {
    errors.push("scope must be an object");
  } else {
    requireText(record.scope.application, "scope.application", errors);
    requireText(record.scope.window, "scope.window", errors);
    if (
      !Array.isArray(record.scope.authorizedObjectiveSet) ||
      record.scope.authorizedObjectiveSet.length === 0 ||
      record.scope.authorizedObjectiveSet.some((item) => !hasText(item))
    ) {
      errors.push("scope.authorizedObjectiveSet must contain non-empty objectives");
    }
  }
  if (!isObject(record.currentObjective)) {
    errors.push("currentObjective must be an object");
  } else {
    requireText(record.currentObjective.statement, "currentObjective.statement", errors);
    requireText(record.currentObjective.source, "currentObjective.source", errors);
  }
  if (!DECISIONS.has(record.decision)) {
    errors.push("decision must be CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE");
  }
  requireText(record.thesis, "thesis", errors);
  if (!CONFIDENCE.has(record.confidence)) {
    errors.push("confidence must be high, medium, or low");
  }

  const evidence = validateEvidence(record.evidence, errors);
  if (!Array.isArray(record.alternatives)) {
    errors.push("alternatives must be an array");
  }
  const planDelta = validatePlanDelta(record.planDelta, errors);
  validateExpectedOutcome(record.expectedOutcome, errors);

  if (!isObject(record.authority)) {
    errors.push("authority must be an object");
  } else if (record.authority.externalMutationsAllowed !== false) {
    errors.push("authority.externalMutationsAllowed must be false");
  }

  if (record.decision === "NARROW" && planDelta?.narrow?.length === 0) {
    errors.push("NARROW must narrow at least one objective");
  }
  if (record.decision === "PAUSE") {
    if (planDelta?.defer?.length === 0) {
      errors.push("PAUSE must defer at least one objective");
    } else if (planDelta.defer.some((item) => !hasText(item?.resumeCondition))) {
      errors.push("PAUSE deferred objectives require resumeCondition");
    }
  }
  if (record.decision === "SWITCH") {
    if (planDelta?.activate?.length !== 1) {
      errors.push("SWITCH must activate exactly one objective");
    }
    if (planDelta?.defer?.length === 0) {
      errors.push("SWITCH must defer at least one objective");
    }
    const layers = new Set(
      evidence.filter((item) => SWITCH_LAYERS.has(item.layer)).map((item) => item.layer),
    );
    const sources = new Set(
      evidence
        .filter((item) => SWITCH_LAYERS.has(item.layer) && hasText(item.sourceId))
        .map((item) => item.sourceId),
    );
    if (layers.size < 2 || sources.size < 2) {
      errors.push("SWITCH requires at least two independent evidence layers and sources");
    }
  }
  if (record.decision === "ESCALATE") {
    validateEscalation(record.escalation, errors);
    if ((planDelta?.activate?.length ?? 0) > 0) {
      errors.push("ESCALATE cannot activate a replacement objective");
    }
  } else if (record.escalation !== null) {
    errors.push("escalation must be null unless decision is ESCALATE");
  }

  if (record.priorDecision !== null && record.priorDecision !== undefined) {
    if (!isObject(record.priorDecision)) {
      errors.push("priorDecision must be an object or null");
    } else {
      requireText(record.priorDecision.runId, "priorDecision.runId", errors);
      if (!DECISIONS.has(record.priorDecision.decision)) {
        errors.push("priorDecision.decision is invalid");
      }
      if (
        record.priorDecision.decision !== record.decision &&
        (!Array.isArray(record.priorDecision.materialNewEvidence) ||
          record.priorDecision.materialNewEvidence.length === 0)
      ) {
        errors.push("reversing priorDecision requires materialNewEvidence");
      }
    }
  }

  return errors;
}

function runCli(filePath) {
  if (!filePath) {
    console.error("Usage: node validate-steering-decision.mjs <decision.json>");
    return 2;
  }
  let record;
  try {
    record = JSON.parse(readFileSync(resolve(filePath), "utf8"));
  } catch (error) {
    console.error("Could not read decision record: " + error.message);
    return 2;
  }
  const errors = validateDecisionRecord(record);
  if (errors.length > 0) {
    console.error("Decision record is invalid:\n- " + errors.join("\n- "));
    return 1;
  }
  console.log("Decision record is valid.");
  return 0;
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) process.exitCode = runCli(process.argv[2]);
