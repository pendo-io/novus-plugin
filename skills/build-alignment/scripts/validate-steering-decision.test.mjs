import assert from "node:assert/strict";
import test from "node:test";

import { validateDecisionRecord } from "./validate-steering-decision.mjs";

function objective(statement, overrides = {}) {
  return {
    id: null,
    statement,
    reason: "Decision-relevant reason",
    resumeCondition: null,
    ...overrides,
  };
}

function validRecord(overrides = {}) {
  return {
    schemaVersion: 1,
    runId: "run-1",
    generatedAt: "2026-08-17T12:00:00Z",
    mode: "autonomous-steering",
    scope: {
      application: "Novus Production",
      window: "30 days",
      authorizedObjectiveSet: ["Improve onboarding recovery", "Improve guide reliability"],
    },
    currentObjective: {
      id: "objective-1",
      statement: "Improve onboarding recovery",
      source: "task",
    },
    priorDecision: null,
    decision: "CONTINUE",
    thesis: "Onboarding recovery remains the best-supported objective.",
    confidence: "high",
    evidence: [
      {
        claim: "Setup satisfaction remains low.",
        kind: "fact",
        layer: "experienced",
        sourceId: "signal-1",
        windowOrStatus: "30 days",
        confidence: "high",
      },
    ],
    alternatives: [
      {
        objective: "Improve guide reliability",
        disposition: "not selected",
        reason: "The current objective has broader reachable impact.",
      },
    ],
    planDelta: {
      activate: [],
      continue: [objective("Improve onboarding recovery")],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    expectedOutcome: {
      primary: "Setup completion",
      direction: "increase",
      leadingIndicators: ["Fewer stuck install runs"],
      validationDate: "2026-08-31",
      validationReason: null,
      invalidationCondition: "Recovery indicators do not improve after exposure.",
    },
    authority: {
      externalMutationsAllowed: false,
      requiredApproval: null,
    },
    escalation: null,
    ...overrides,
  };
}

test("accepts a valid CONTINUE record", () => {
  assert.deepEqual(validateDecisionRecord(validRecord()), []);
});

test("rejects external mutation authority", () => {
  const record = validRecord({
    authority: { externalMutationsAllowed: true, requiredApproval: null },
  });

  assert.match(validateDecisionRecord(record).join("\n"), /externalMutationsAllowed must be false/);
});

test("requires SWITCH to activate one objective, defer work, and cite two independent layers", () => {
  const record = validRecord({
    decision: "SWITCH",
    planDelta: {
      activate: [],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });

  const errors = validateDecisionRecord(record).join("\n");
  assert.match(errors, /SWITCH must activate exactly one objective/);
  assert.match(errors, /SWITCH must defer at least one objective/);
  assert.match(errors, /SWITCH requires at least two independent evidence layers/);
});

test("accepts a SWITCH with one replacement and independent evidence", () => {
  const record = validRecord({
    decision: "SWITCH",
    evidence: [
      {
        claim: "Customer burden is material.",
        kind: "fact",
        layer: "experienced",
        sourceId: "signal-1",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "The current recovery PR is not exposed.",
        kind: "fact",
        layer: "shipping",
        sourceId: "pr-1262",
        windowOrStatus: "open",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objective("Improve guide reliability")],
      continue: [],
      narrow: [],
      defer: [
        objective("Improve onboarding recovery", {
          resumeCondition: "Resume when the dependency ships.",
        }),
      ],
      addValidation: [],
    },
  });

  assert.deepEqual(validateDecisionRecord(record), []);
});

test("requires PAUSE to defer work with a resume condition", () => {
  const record = validRecord({
    decision: "PAUSE",
    planDelta: {
      activate: [],
      continue: [],
      narrow: [],
      defer: [objective("Improve onboarding recovery")],
      addValidation: [],
    },
  });

  assert.match(validateDecisionRecord(record).join("\n"), /PAUSE deferred objectives require resumeCondition/);
});

test("requires ESCALATE details and prohibits an activated replacement", () => {
  const record = validRecord({
    decision: "ESCALATE",
    planDelta: {
      activate: [objective("Improve guide reliability")],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    escalation: null,
  });

  const errors = validateDecisionRecord(record).join("\n");
  assert.match(errors, /ESCALATE requires escalation details/);
  assert.match(errors, /ESCALATE cannot activate a replacement objective/);
});

test("requires exactly one validation date or reason", () => {
  const record = validRecord({
    expectedOutcome: {
      primary: "Setup completion",
      direction: "increase",
      leadingIndicators: [],
      validationDate: null,
      validationReason: null,
      invalidationCondition: "New evidence changes the decision.",
    },
  });

  assert.match(validateDecisionRecord(record).join("\n"), /exactly one of validationDate and validationReason/);
});

test("requires material new evidence before reversing a prior decision", () => {
  const record = validRecord({
    priorDecision: {
      runId: "run-0",
      decision: "PAUSE",
      validationDate: "2026-08-31",
      invalidationCondition: "New exposure evidence appears.",
      materialNewEvidence: [],
    },
  });

  assert.match(validateDecisionRecord(record).join("\n"), /reversing priorDecision requires materialNewEvidence/);
});
