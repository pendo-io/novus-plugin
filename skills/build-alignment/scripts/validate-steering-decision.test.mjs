import assert from "node:assert/strict";
import test from "node:test";

import { validateDecisionRecord } from "./validate-steering-decision.mjs";

function objective(objectiveName, overrides = {}) {
  return {
    id: null,
    objective: objectiveName,
    statement: "Work on " + objectiveName,
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

test("requires approval only when the decision is ESCALATE", () => {
  const escalateRecord = validRecord({
    decision: "ESCALATE",
    planDelta: {
      activate: [],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    escalation: {
      reason: "Product judgment is required.",
      decisionNeeded: "Choose the active objective.",
      requiredAuthority: "Caller objective selection.",
    },
  });
  assert.match(
    validateDecisionRecord(escalateRecord).join("\n"),
    /ESCALATE requires authority.requiredApproval/,
  );

  const continueRecord = validRecord({
    authority: {
      externalMutationsAllowed: false,
      requiredApproval: "Approve a new objective.",
    },
  });
  assert.match(
    validateDecisionRecord(continueRecord).join("\n"),
    /authority.requiredApproval must be null unless decision is ESCALATE/,
  );
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

test("requires both validation fields to be present even when one is null", () => {
  const record = validRecord({
    expectedOutcome: {
      primary: "Setup completion",
      direction: "increase",
      leadingIndicators: [],
      validationReason: "Reassess after exposure is confirmed.",
      invalidationCondition: "New evidence changes the decision.",
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /expectedOutcome.validationDate must be present as a string or null/,
  );
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

test("requires the current objective to be explicitly authorized", () => {
  const record = validRecord({
    currentObjective: {
      id: "objective-portfolio-choice",
      statement: "Choose whichever objective has the highest value",
      source: "agent inference",
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /currentObjective.statement must exactly match an authorized objective/,
  );
});

test("requires a complete current objective and authority envelope", () => {
  const record = validRecord({
    currentObjective: {
      statement: "Improve onboarding recovery",
      source: "task",
    },
    authority: { externalMutationsAllowed: false },
  });

  const errors = validateDecisionRecord(record).join("\n");
  assert.match(errors, /currentObjective.id must be a non-empty string or null/);
  assert.match(errors, /authority.requiredApproval must be a non-empty string or null/);
});

test("requires alternatives to use the declared objective, disposition, and reason shape", () => {
  const record = validRecord({
    alternatives: [
      {
        objective: "Improve guide reliability",
        whyItLoses: "The current objective has broader reachable impact.",
      },
    ],
  });

  const errors = validateDecisionRecord(record).join("\n");
  assert.match(errors, /alternatives\[0\]\.disposition must be a non-empty string/);
  assert.match(errors, /alternatives\[0\]\.reason must be a non-empty string/);
});

test("requires alternatives to stay inside the authorized objective set", () => {
  const record = validRecord({
    alternatives: [
      {
        objective: "Rewrite the billing platform",
        disposition: "not selected",
        reason: "It is outside the mandate.",
      },
    ],
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /alternatives\[0\]\.objective must exactly match an authorized objective/,
  );
});

test("requires the strongest different alternative when more than one objective is authorized", () => {
  const missing = validRecord({ alternatives: [] });
  assert.match(
    validateDecisionRecord(missing).join("\n"),
    /alternatives must include a different authorized objective/,
  );

  const repeatsCurrent = validRecord({
    alternatives: [
      {
        objective: "Improve onboarding recovery",
        disposition: "not selected",
        reason: "This repeats the current objective.",
      },
    ],
  });
  assert.match(
    validateDecisionRecord(repeatsCurrent).join("\n"),
    /alternatives must include a different authorized objective/,
  );
});

test("requires every plan change to name an authorized objective", () => {
  const record = validRecord({
    planDelta: {
      activate: [],
      continue: [
        {
          id: null,
          statement: "Continue onboarding recovery",
          reason: "It remains the best-supported objective.",
          resumeCondition: null,
        },
      ],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /planDelta.continue\[0\]\.objective must be a non-empty string/,
  );
});

test("binds CONTINUE, NARROW, PAUSE, and SWITCH to the current objective", () => {
  const continueErrors = validateDecisionRecord(
    validRecord({
      planDelta: {
        activate: [],
        continue: [objective("Improve guide reliability")],
        narrow: [],
        defer: [],
        addValidation: [],
      },
    }),
  ).join("\n");
  assert.match(continueErrors, /CONTINUE must preserve the current objective/);

  const narrowErrors = validateDecisionRecord(
    validRecord({
      decision: "NARROW",
      planDelta: {
        activate: [],
        continue: [],
        narrow: [objective("Improve guide reliability")],
        defer: [],
        addValidation: [],
      },
    }),
  ).join("\n");
  assert.match(narrowErrors, /NARROW must narrow the current objective/);

  const pauseErrors = validateDecisionRecord(
    validRecord({
      decision: "PAUSE",
      planDelta: {
        activate: [],
        continue: [],
        narrow: [],
        defer: [
          objective("Improve guide reliability", {
            resumeCondition: "Resume after the dependency ships.",
          }),
        ],
        addValidation: [],
      },
    }),
  ).join("\n");
  assert.match(pauseErrors, /PAUSE must defer the current objective/);

  const switchErrors = validateDecisionRecord(
    validRecord({
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
          objective("Improve guide reliability", {
            resumeCondition: "Resume after the dependency ships.",
          }),
        ],
        addValidation: [],
      },
    }),
  ).join("\n");
  assert.match(switchErrors, /SWITCH must defer the current objective/);
});

test("requires SWITCH activation to stay inside the authorized objective set", () => {
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
        claim: "A delivery constraint blocks the current objective.",
        kind: "fact",
        layer: "shipping",
        sourceId: "pr-1262",
        windowOrStatus: "open",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objective("Rewrite the billing platform")],
      continue: [],
      narrow: [],
      defer: [
        objective("Improve onboarding recovery", {
          resumeCondition: "Resume after the dependency ships.",
        }),
      ],
      addValidation: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /planDelta.activate\[0\]\.objective must exactly match an authorized objective/,
  );
});

test("requires every plan delta array even when it is empty", () => {
  const record = validRecord({
    planDelta: {
      activate: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });

  assert.match(validateDecisionRecord(record).join("\n"), /planDelta.continue must be an array/);
});

test("accepts ESCALATE with a null current objective when the mandate is incomplete", () => {
  const record = validRecord({
    scope: {
      application: "Novus Production",
      window: "30 days",
      authorizedObjectiveSet: [],
    },
    currentObjective: null,
    decision: "ESCALATE",
    thesis: "The active objective is missing, so autonomous steering cannot safely continue.",
    evidence: [
      {
        claim: "The mandate does not identify an active objective.",
        kind: "fact",
        layer: "constraint",
        sourceId: "task-mandate",
        windowOrStatus: "current task",
        confidence: "high",
      },
    ],
    alternatives: [],
    planDelta: {
      activate: [],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    expectedOutcome: {
      primary: "Objective alignment",
      direction: "establish",
      leadingIndicators: [],
      validationDate: null,
      validationReason: "Reassess after the caller names one active objective.",
      invalidationCondition: "A single active objective and authorization envelope are supplied.",
    },
    authority: {
      externalMutationsAllowed: false,
      requiredApproval: "Caller must identify the active objective.",
    },
    escalation: {
      reason: "The current objective is absent.",
      decisionNeeded: "Name one active objective.",
      requiredAuthority: "Caller objective selection.",
    },
  });

  assert.deepEqual(validateDecisionRecord(record), []);
});

test("rejects a null current objective outside ESCALATE", () => {
  const record = validRecord({ currentObjective: null });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /currentObjective may be null only when decision is ESCALATE/,
  );
});
