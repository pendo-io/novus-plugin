#!/usr/bin/env node

import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DECISIONS = new Set(["CONTINUE", "NARROW", "PAUSE", "SWITCH", "ESCALATE"]);
const V2_DECISIONS = new Set(["START", ...DECISIONS]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const EVIDENCE_KINDS = new Set(["fact", "correlation", "hypothesis"]);
const EVIDENCE_LAYERS = new Set(["planned", "built", "experienced", "shipping", "constraint"]);
const SWITCH_LAYERS = new Set(["planned", "built", "experienced", "shipping"]);
const PLAN_KEYS = ["activate", "continue", "narrow", "defer", "addValidation"];
const EXECUTION_AUTHORITIES = new Set(["current-scope", "explicit-choice", "recommend-only"]);
const PLAN_CHANGE_STATUSES = new Set(["applied", "proposed", "blocked"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function requireText(value, path, errors) {
  if (!hasText(value)) errors.push(path + " must be a non-empty string");
}

function validateObjectiveChange(value, path, objectiveNames, objectiveMembership, errors) {
  if (!isObject(value)) {
    errors.push(path + " must be an object");
    return;
  }
  requireText(value.objective, path + ".objective", errors);
  if (hasText(value.objective) && !objectiveNames.includes(value.objective)) {
    errors.push(path + ".objective must exactly match " + objectiveMembership + " objective");
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

function validatePlanDelta(planDelta, objectiveNames, objectiveMembership, errors) {
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
      validateObjectiveChange(
        item,
        "planDelta." + key + "[" + index + "]",
        objectiveNames,
        objectiveMembership,
        errors,
      ),
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

function validateAlternatives(alternatives, objectiveNames, objectiveMembership, errors) {
  if (!Array.isArray(alternatives)) {
    errors.push("alternatives must be an array");
    return;
  }
  alternatives.forEach((item, index) => {
    const path = "alternatives[" + index + "]";
    if (!isObject(item)) {
      errors.push(path + " must be an object");
      return;
    }
    requireText(item.objective, path + ".objective", errors);
    if (hasText(item.objective) && !objectiveNames.includes(item.objective)) {
      errors.push(path + ".objective must exactly match " + objectiveMembership + " objective");
    }
    requireText(item.disposition, path + ".disposition", errors);
    requireText(item.reason, path + ".reason", errors);
  });
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
  for (const key of ["validationDate", "validationReason"]) {
    if (!hasOwn(value, key) || (value[key] !== null && !hasText(value[key]))) {
      errors.push("expectedOutcome." + key + " must be present as a string or null");
    }
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

function validateV1DecisionRecord(record) {
  const errors = [];

  if (record.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
  requireText(record.runId, "runId", errors);
  requireText(record.generatedAt, "generatedAt", errors);
  if (record.mode !== "autonomous-steering") {
    errors.push("mode must equal autonomous-steering");
  }
  let authorizedObjectives = [];
  if (!isObject(record.scope)) {
    errors.push("scope must be an object");
  } else {
    requireText(record.scope.application, "scope.application", errors);
    requireText(record.scope.window, "scope.window", errors);
    if (!Array.isArray(record.scope.authorizedObjectiveSet)) {
      errors.push("scope.authorizedObjectiveSet must be an array");
    } else if (record.scope.authorizedObjectiveSet.some((item) => !hasText(item))) {
      errors.push("scope.authorizedObjectiveSet entries must be non-empty objectives");
    } else if (record.scope.authorizedObjectiveSet.length === 0) {
      if (record.decision !== "ESCALATE") {
        errors.push("scope.authorizedObjectiveSet must contain an objective unless decision is ESCALATE");
      }
    } else {
      authorizedObjectives = record.scope.authorizedObjectiveSet;
    }
  }
  if (record.currentObjective === null) {
    if (record.decision !== "ESCALATE") {
      errors.push("currentObjective may be null only when decision is ESCALATE");
    }
  } else if (!isObject(record.currentObjective)) {
    errors.push("currentObjective must be an object");
  } else {
    requireText(record.currentObjective.statement, "currentObjective.statement", errors);
    requireText(record.currentObjective.source, "currentObjective.source", errors);
    if (
      !hasOwn(record.currentObjective, "id") ||
      (record.currentObjective.id !== null && !hasText(record.currentObjective.id))
    ) {
      errors.push("currentObjective.id must be a non-empty string or null");
    }
    if (
      hasText(record.currentObjective.statement) &&
      !authorizedObjectives.includes(record.currentObjective.statement)
    ) {
      errors.push("currentObjective.statement must exactly match an authorized objective");
    }
  }
  if (!DECISIONS.has(record.decision)) {
    errors.push("decision must be CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE");
  }
  requireText(record.thesis, "thesis", errors);
  if (!CONFIDENCE.has(record.confidence)) {
    errors.push("confidence must be high, medium, or low");
  }

  const evidence = validateEvidence(record.evidence, errors);
  validateAlternatives(record.alternatives, authorizedObjectives, "an authorized", errors);
  if (
    record.decision !== "ESCALATE" &&
    authorizedObjectives.length > 1 &&
    (!Array.isArray(record.alternatives) ||
      !record.alternatives.some(
        (item) =>
          isObject(item) &&
          authorizedObjectives.includes(item.objective) &&
          item.objective !== record.currentObjective?.statement,
      ))
  ) {
    errors.push("alternatives must include a different authorized objective");
  }
  const planDelta = validatePlanDelta(
    record.planDelta,
    authorizedObjectives,
    "an authorized",
    errors,
  );
  validateExpectedOutcome(record.expectedOutcome, errors);

  if (!isObject(record.authority)) {
    errors.push("authority must be an object");
  } else {
    if (record.authority.externalMutationsAllowed !== false) {
      errors.push("authority.externalMutationsAllowed must be false");
    }
    if (
      !hasOwn(record.authority, "requiredApproval") ||
      (record.authority.requiredApproval !== null && !hasText(record.authority.requiredApproval))
    ) {
      errors.push("authority.requiredApproval must be a non-empty string or null");
    }
  }

  const currentStatement = isObject(record.currentObjective)
    ? record.currentObjective.statement
    : null;
  const changesCurrent = (items) =>
    Array.isArray(items) && items.some((item) => item?.objective === currentStatement);

  if (record.decision === "CONTINUE" && !changesCurrent(planDelta?.continue)) {
    errors.push("CONTINUE must preserve the current objective in planDelta.continue");
  }
  if (record.decision === "NARROW" && !changesCurrent(planDelta?.narrow)) {
    errors.push("NARROW must narrow the current objective");
  }
  if (record.decision === "PAUSE") {
    if (planDelta?.defer?.length === 0) {
      errors.push("PAUSE must defer at least one objective");
    } else if (planDelta.defer.some((item) => !hasText(item?.resumeCondition))) {
      errors.push("PAUSE deferred objectives require resumeCondition");
    }
    if (!changesCurrent(planDelta?.defer)) {
      errors.push("PAUSE must defer the current objective");
    }
  }
  if (record.decision === "SWITCH") {
    if (planDelta?.activate?.length !== 1) {
      errors.push("SWITCH must activate exactly one objective");
    }
    if (planDelta?.defer?.length === 0) {
      errors.push("SWITCH must defer at least one objective");
    }
    if (!changesCurrent(planDelta?.defer)) {
      errors.push("SWITCH must defer the current objective");
    }
    if (planDelta?.activate?.some((item) => item?.objective === currentStatement)) {
      errors.push("SWITCH must activate a replacement, not the current objective");
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
    if (!hasText(record.authority?.requiredApproval)) {
      errors.push("ESCALATE requires authority.requiredApproval");
    }
    if ((planDelta?.activate?.length ?? 0) > 0) {
      errors.push("ESCALATE cannot activate a replacement objective");
    }
  } else if (record.escalation !== null) {
    errors.push("escalation must be null unless decision is ESCALATE");
  }
  if (
    record.decision !== "ESCALATE" &&
    isObject(record.authority) &&
    hasOwn(record.authority, "requiredApproval") &&
    record.authority.requiredApproval !== null
  ) {
    errors.push("authority.requiredApproval must be null unless decision is ESCALATE");
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

function validateCandidateObjectives(value, decision, errors) {
  if (!Array.isArray(value)) {
    errors.push("scope.candidateObjectives must be an array");
    return [];
  }
  if (value.length === 0 && decision !== "ESCALATE") {
    errors.push("scope.candidateObjectives must contain an objective unless decision is ESCALATE");
  }
  const statements = [];
  value.forEach((item, index) => {
    const path = "scope.candidateObjectives[" + index + "]";
    if (!isObject(item)) {
      errors.push(path + " must be an object");
      return;
    }
    requireText(item.statement, path + ".statement", errors);
    if (hasText(item.statement)) statements.push(item.statement);
    if (!EXECUTION_AUTHORITIES.has(item.executionAuthority)) {
      errors.push(
        path +
          ".executionAuthority must be current-scope, explicit-choice, or recommend-only",
      );
    }
    if (
      !Array.isArray(item.sourceIds) ||
      item.sourceIds.length === 0 ||
      item.sourceIds.some((sourceId) => !hasText(sourceId))
    ) {
      errors.push(path + ".sourceIds must contain at least one stable source ID");
    }
  });
  if (new Set(statements).size !== statements.length) {
    errors.push("scope.candidateObjectives must not contain duplicate statements");
  }
  return value.filter(isObject);
}

function validateV2CurrentObjective(value, decision, candidates, errors) {
  if (value === null) {
    if (decision !== "START" && decision !== "ESCALATE") {
      errors.push("currentObjective may be null only when decision is START or ESCALATE");
    }
    return null;
  }
  if (!isObject(value)) {
    errors.push("currentObjective must be an object or null");
    return null;
  }
  requireText(value.statement, "currentObjective.statement", errors);
  if (!hasOwn(value, "id") || (value.id !== null && !hasText(value.id))) {
    errors.push("currentObjective.id must be a non-empty string or null");
  }
  if (typeof value.inferred !== "boolean") {
    errors.push("currentObjective.inferred must be true or false");
  }
  if (!CONFIDENCE.has(value.confidence)) {
    errors.push("currentObjective.confidence must be high, medium, or low");
  }
  if (!Array.isArray(value.sources) || value.sources.length === 0) {
    errors.push("currentObjective.sources must contain at least one inference source");
  } else {
    value.sources.forEach((source, index) => {
      const path = "currentObjective.sources[" + index + "]";
      if (!isObject(source)) {
        errors.push(path + " must be an object");
        return;
      }
      requireText(source.kind, path + ".kind", errors);
      requireText(source.sourceId, path + ".sourceId", errors);
      requireText(source.summary, path + ".summary", errors);
    });
  }
  const matchingCandidate = candidates.find((item) => item.statement === value.statement);
  if (hasText(value.statement) && !matchingCandidate) {
    errors.push("currentObjective.statement must exactly match a candidate objective");
  } else if (matchingCandidate?.executionAuthority === "recommend-only") {
    errors.push("currentObjective cannot have recommend-only execution authority");
  }
  return value;
}

function validateV2Authority(value, decision, errors) {
  if (!isObject(value)) {
    errors.push("authority must be an object");
    return null;
  }
  if (value.externalMutationsAllowed !== false) {
    errors.push("authority.externalMutationsAllowed must be false");
  }
  if (!PLAN_CHANGE_STATUSES.has(value.internalPlanChangeStatus)) {
    errors.push("authority.internalPlanChangeStatus must be applied, proposed, or blocked");
  }
  requireText(value.reason, "authority.reason", errors);
  if (
    !hasOwn(value, "requiredApproval") ||
    (value.requiredApproval !== null && !hasText(value.requiredApproval))
  ) {
    errors.push("authority.requiredApproval must be a non-empty string or null");
  }
  if (value.internalPlanChangeStatus === "applied" && value.requiredApproval !== null) {
    errors.push("applied internal plan changes cannot require approval");
  }
  if (decision === "ESCALATE") {
    if (value.internalPlanChangeStatus !== "blocked") {
      errors.push("ESCALATE requires authority.internalPlanChangeStatus blocked");
    }
    if (!hasText(value.requiredApproval)) {
      errors.push("ESCALATE requires authority.requiredApproval");
    }
  } else if (value.internalPlanChangeStatus === "blocked") {
    errors.push("blocked internal plan change status requires decision ESCALATE");
  }
  return value;
}

function validatePriorDecision(value, decision, errors, validDecisions = DECISIONS) {
  if (value === null || value === undefined) return;
  if (!isObject(value)) {
    errors.push("priorDecision must be an object or null");
    return;
  }
  requireText(value.runId, "priorDecision.runId", errors);
  if (!validDecisions.has(value.decision)) {
    errors.push("priorDecision.decision is invalid");
  }
  if (
    value.decision !== decision &&
    (!Array.isArray(value.materialNewEvidence) || value.materialNewEvidence.length === 0)
  ) {
    errors.push("reversing priorDecision requires materialNewEvidence");
  }
}

function validateV2DecisionRecord(record) {
  const errors = [];
  requireText(record.runId, "runId", errors);
  requireText(record.generatedAt, "generatedAt", errors);
  if (record.mode !== "autonomous-steering") {
    errors.push("mode must equal autonomous-steering");
  }
  if (!V2_DECISIONS.has(record.decision)) {
    errors.push("decision must be START, CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE");
  }

  let candidates = [];
  if (!isObject(record.scope)) {
    errors.push("scope must be an object");
  } else {
    requireText(record.scope.application, "scope.application", errors);
    requireText(record.scope.window, "scope.window", errors);
    candidates = validateCandidateObjectives(
      record.scope.candidateObjectives,
      record.decision,
      errors,
    );
  }
  const candidateNames = candidates.map((item) => item.statement).filter(hasText);
  const currentObjective = validateV2CurrentObjective(
    record.currentObjective,
    record.decision,
    candidates,
    errors,
  );

  requireText(record.thesis, "thesis", errors);
  if (!CONFIDENCE.has(record.confidence)) {
    errors.push("confidence must be high, medium, or low");
  }
  const evidence = validateEvidence(record.evidence, errors);
  validateAlternatives(record.alternatives, candidateNames, "a candidate", errors);
  if (
    record.decision !== "ESCALATE" &&
    candidateNames.length > 1 &&
    (!Array.isArray(record.alternatives) ||
      !record.alternatives.some(
        (item) =>
          isObject(item) &&
          candidateNames.includes(item.objective) &&
          item.objective !== currentObjective?.statement,
      ))
  ) {
    errors.push("alternatives must include a different candidate objective");
  }
  const planDelta = validatePlanDelta(record.planDelta, candidateNames, "a candidate", errors);
  validateExpectedOutcome(record.expectedOutcome, errors);
  const authority = validateV2Authority(record.authority, record.decision, errors);

  const currentStatement = currentObjective?.statement ?? null;
  const changesCurrent = (items) =>
    Array.isArray(items) && items.some((item) => item?.objective === currentStatement);

  if (record.decision === "CONTINUE" && !changesCurrent(planDelta?.continue)) {
    errors.push("CONTINUE must preserve the current objective in planDelta.continue");
  }
  if (record.decision === "NARROW" && !changesCurrent(planDelta?.narrow)) {
    errors.push("NARROW must narrow the current objective");
  }
  if (record.decision === "PAUSE") {
    if (planDelta?.defer?.length === 0) {
      errors.push("PAUSE must defer at least one objective");
    } else if (planDelta.defer.some((item) => !hasText(item?.resumeCondition))) {
      errors.push("PAUSE deferred objectives require resumeCondition");
    }
    if (!changesCurrent(planDelta?.defer)) {
      errors.push("PAUSE must defer the current objective");
    }
  }
  if (record.decision === "START") {
    if (record.currentObjective !== null) {
      errors.push("START requires currentObjective to be null");
    }
    if (planDelta?.activate?.length !== 1) {
      errors.push("START must activate exactly one objective");
    }
    if (
      (planDelta?.continue?.length ?? 0) > 0 ||
      (planDelta?.narrow?.length ?? 0) > 0 ||
      (planDelta?.defer?.length ?? 0) > 0
    ) {
      errors.push("START may only populate planDelta.activate and planDelta.addValidation");
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
      errors.push("START requires at least two independent evidence layers and sources");
    }
    const activatedStatement = planDelta?.activate?.[0]?.objective;
    if (
      candidateNames.length > 1 &&
      (!Array.isArray(record.alternatives) ||
        !record.alternatives.some(
          (item) =>
            isObject(item) &&
            candidateNames.includes(item.objective) &&
            item.objective !== activatedStatement,
        ))
    ) {
      errors.push(
        "START alternatives must include a candidate different from the activated objective",
      );
    }
    const activatedCandidate = candidates.find((item) => item.statement === activatedStatement);
    if (
      authority?.internalPlanChangeStatus === "applied" &&
      activatedCandidate?.executionAuthority !== "explicit-choice"
    ) {
      errors.push(
        "applied START requires explicit-choice authority for the activated objective",
      );
    }
  }
  if (record.decision === "SWITCH") {
    if (planDelta?.activate?.length !== 1) {
      errors.push("SWITCH must activate exactly one objective");
    }
    if (!changesCurrent(planDelta?.defer)) {
      errors.push("SWITCH must defer the current objective");
    }
    const activatedStatement = planDelta?.activate?.[0]?.objective;
    if (activatedStatement === currentStatement) {
      errors.push("SWITCH must activate a replacement, not the current objective");
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
    const activatedCandidate = candidates.find((item) => item.statement === activatedStatement);
    if (
      activatedCandidate?.executionAuthority === "recommend-only" &&
      authority?.internalPlanChangeStatus !== "proposed"
    ) {
      errors.push("recommend-only SWITCH must remain proposed");
    }
    if (
      activatedCandidate?.executionAuthority === "recommend-only" &&
      !hasText(authority?.requiredApproval)
    ) {
      errors.push("recommend-only SWITCH requires authority.requiredApproval");
    }
    if (
      authority?.internalPlanChangeStatus === "applied" &&
      activatedCandidate?.executionAuthority !== "explicit-choice"
    ) {
      errors.push(
        "applied SWITCH requires explicit-choice authority for the activated objective",
      );
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

  validatePriorDecision(record.priorDecision, record.decision, errors, V2_DECISIONS);
  return errors;
}

export function validateDecisionRecord(record) {
  if (!isObject(record)) return ["decision record must be an object"];
  if (record.schemaVersion === 1) return validateV1DecisionRecord(record);
  if (record.schemaVersion === 2) return validateV2DecisionRecord(record);
  return ["schemaVersion must equal 1 or 2"];
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

const isCli =
  process.argv[1] &&
  realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
if (isCli) process.exitCode = runCli(process.argv[2]);
