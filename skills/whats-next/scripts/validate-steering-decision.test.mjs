import assert from "node:assert/strict";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

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

function candidate(statement, executionAuthority, sourceIds) {
  return { statement, executionAuthority, sourceIds };
}

function objectiveV2(objectiveName, overrides = {}) {
  return {
    id: null,
    objective: objectiveName,
    statement: "Work on " + objectiveName,
    reason: "Decision-relevant reason",
    resumeCondition: null,
    ...overrides,
  };
}

function validV2Record(overrides = {}) {
  return {
    schemaVersion: 2,
    runId: "run-v2-1",
    generatedAt: "2026-08-17T12:00:00Z",
    mode: "autonomous-steering",
    scope: {
      application: "Novus Production",
      window: "30 days",
      candidateObjectives: [
        candidate("Improve guide authoring reliability", "current-scope", ["git:branch:guide-fix"]),
        candidate("Improve setup recovery", "recommend-only", ["novus:signal:setup-friction"]),
      ],
    },
    currentObjective: {
      id: null,
      statement: "Improve guide authoring reliability",
      inferred: true,
      confidence: "high",
      sources: [
        {
          kind: "branch",
          sourceId: "git:branch:guide-fix",
          summary: "The active branch and diff address Guide reliability.",
        },
      ],
    },
    priorDecision: null,
    decision: "CONTINUE",
    thesis: "Continue the active Guide reliability work and measure the merged correction.",
    confidence: "high",
    evidence: [
      {
        claim: "The current branch addresses Guide reliability.",
        kind: "fact",
        layer: "built",
        sourceId: "git:branch:guide-fix",
        windowOrStatus: "current branch",
        confidence: "high",
      },
    ],
    alternatives: [
      {
        objective: "Improve setup recovery",
        disposition: "not selected",
        reason: "The current bounded work is ready for validation.",
      },
    ],
    planDelta: {
      activate: [],
      continue: [objectiveV2("Improve guide authoring reliability")],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    expectedOutcome: {
      primary: "Guide edit reliability",
      direction: "increase",
      leadingIndicators: ["Omitted steps remain intact"],
      validationDate: "2026-08-31",
      validationReason: null,
      invalidationCondition: "Reliability does not improve after exposure.",
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "applied",
      reason: "The host plan was updated within the active assignment.",
      requiredApproval: null,
    },
    escalation: null,
    ...overrides,
  };
}

test("accepts a v2 decision whose current objective was inferred from engineering context", () => {
  assert.deepEqual(validateDecisionRecord(validV2Record()), []);
});

test("requires inferred objectives to preserve their evidence sources", () => {
  const record = validV2Record({
    currentObjective: {
      id: null,
      statement: "Improve guide authoring reliability",
      inferred: true,
      confidence: "high",
      sources: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /currentObjective.sources must contain at least one inference source/,
  );
});

test("requires the inferred current objective to be one of the discovered candidates", () => {
  const record = validV2Record({
    currentObjective: {
      id: null,
      statement: "Rewrite the billing platform",
      inferred: true,
      confidence: "high",
      sources: [
        {
          kind: "branch",
          sourceId: "git:branch:guide-fix",
          summary: "The active branch and diff address Guide reliability.",
        },
      ],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /currentObjective.statement must exactly match a candidate objective/,
  );
});

test("accepts a recommended SWITCH that is proposed instead of applied", () => {
  const record = validV2Record({
    decision: "SWITCH",
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "The current Guide correction is blocked.",
        kind: "fact",
        layer: "shipping",
        sourceId: "github:pr:guide-blocked",
        windowOrStatus: "blocked",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [
        objectiveV2("Improve guide authoring reliability", {
          resumeCondition: "Resume when the Guide dependency is unblocked.",
        }),
      ],
      addValidation: [],
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "proposed",
      reason: "The alternative was discovered outside the active assignment.",
      requiredApproval: "Confirm switching from Guide reliability to Setup recovery.",
    },
  });

  assert.deepEqual(validateDecisionRecord(record), []);
});

test("rejects applying a SWITCH to a recommend-only objective", () => {
  const record = validV2Record({
    decision: "SWITCH",
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "The current Guide correction is blocked.",
        kind: "fact",
        layer: "shipping",
        sourceId: "github:pr:guide-blocked",
        windowOrStatus: "blocked",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [
        objectiveV2("Improve guide authoring reliability", {
          resumeCondition: "Resume when the Guide dependency is unblocked.",
        }),
      ],
      addValidation: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /applied SWITCH requires explicit-choice authority for the activated objective/,
  );
});

test("rejects an applied decision that still requires approval", () => {
  const record = validV2Record({
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "applied",
      reason: "The host plan was updated within the active assignment.",
      requiredApproval: "Approve the plan change.",
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /applied internal plan changes cannot require approval/,
  );
});

test("accepts a blocked v2 ESCALATE when engineering context cannot resolve current work", () => {
  const record = validV2Record({
    scope: {
      application: "Novus Production",
      window: "current task",
      candidateObjectives: [],
    },
    currentObjective: null,
    decision: "ESCALATE",
    evidence: [
      {
        claim: "No task, plan, branch, issue, PR, diff, or conversation identifies the current work.",
        kind: "fact",
        layer: "constraint",
        sourceId: "engineering-context-scan",
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
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "blocked",
      reason: "Current work cannot be inferred safely.",
      requiredApproval: "Identify the work or decision this task should advance.",
    },
    escalation: {
      reason: "Current work cannot be inferred safely.",
      decisionNeeded: "Identify the work or decision this task should advance.",
      requiredAuthority: "Caller task clarification.",
    },
  });

  assert.deepEqual(validateDecisionRecord(record), []);
});

test("requires v2 authority to explain the plan change status", () => {
  const record = validV2Record({
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "applied",
      requiredApproval: null,
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /authority.reason must be a non-empty string/,
  );
});

test("requires approval when a recommend-only SWITCH is proposed", () => {
  const record = validV2Record({
    decision: "SWITCH",
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "The current Guide correction is blocked.",
        kind: "fact",
        layer: "shipping",
        sourceId: "github:pr:guide-blocked",
        windowOrStatus: "blocked",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [
        objectiveV2("Improve guide authoring reliability", {
          resumeCondition: "Resume when the Guide dependency is unblocked.",
        }),
      ],
      addValidation: [],
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "proposed",
      reason: "The alternative was discovered outside the active assignment.",
      requiredApproval: null,
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /recommend-only SWITCH requires authority.requiredApproval/,
  );
});

test("accepts a proposed START when no work is active and one candidate is recommended", () => {
  const record = validV2Record({
    scope: {
      application: "Novus Production",
      window: "30 days",
      candidateObjectives: [
        candidate("Improve setup recovery", "recommend-only", ["novus:signal:setup-friction"]),
        candidate("Improve guide authoring reliability", "recommend-only", ["novus:signal:guide-friction"]),
      ],
    },
    currentObjective: null,
    decision: "START",
    thesis: "Start with Setup recovery because it has the strongest reachable customer burden.",
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "Setup recovery is the highest-priority ready roadmap item.",
        kind: "fact",
        layer: "planned",
        sourceId: "linear:initiative:setup-recovery",
        windowOrStatus: "current cycle",
        confidence: "high",
      },
    ],
    alternatives: [
      {
        objective: "Improve guide authoring reliability",
        disposition: "not selected",
        reason: "Setup has the stronger direct friction signal.",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "proposed",
      reason: "The caller asked for guidance, not implementation.",
      requiredApproval: null,
    },
  });

  assert.deepEqual(validateDecisionRecord(record), []);
});

test("requires START to activate exactly one candidate and have no current objective", () => {
  const withCurrent = validV2Record({ decision: "START" });
  const currentErrors = validateDecisionRecord(withCurrent).join("\n");
  assert.match(currentErrors, /START requires currentObjective to be null/);
  assert.match(currentErrors, /START must activate exactly one objective/);

  const withoutActivation = validV2Record({
    currentObjective: null,
    decision: "START",
    planDelta: {
      activate: [],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });
  assert.match(
    validateDecisionRecord(withoutActivation).join("\n"),
    /START must activate exactly one objective/,
  );
});

test("requires explicit-choice authority before an agent applies START", () => {
  const record = validV2Record({
    scope: {
      application: "Novus Production",
      window: "30 days",
      candidateObjectives: [
        candidate("Improve setup recovery", "recommend-only", ["novus:signal:setup-friction"]),
      ],
    },
    currentObjective: null,
    decision: "START",
    alternatives: [],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /applied START requires explicit-choice authority for the activated objective/,
  );
});

test("requires START to use independent product evidence", () => {
  const record = validV2Record({
    scope: {
      application: "Novus Production",
      window: "30 days",
      candidateObjectives: [
        candidate("Improve setup recovery", "recommend-only", ["novus:signal:setup-friction"]),
      ],
    },
    currentObjective: null,
    decision: "START",
    alternatives: [],
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "proposed",
      reason: "The caller asked for guidance, not implementation.",
      requiredApproval: null,
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /START requires at least two independent evidence layers and sources/,
  );
});

test("requires START to leave non-activation plan arrays empty", () => {
  const record = validV2Record({
    currentObjective: null,
    decision: "START",
    planDelta: {
      activate: [objectiveV2("Improve guide authoring reliability")],
      continue: [objectiveV2("Improve guide authoring reliability")],
      narrow: [],
      defer: [],
      addValidation: [],
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /START may only populate planDelta.activate and planDelta.addValidation/,
  );
});

test("requires START to compare its selection with a different candidate", () => {
  const record = validV2Record({
    scope: {
      application: "Novus Production",
      window: "30 days",
      candidateObjectives: [
        candidate("Improve setup recovery", "recommend-only", ["novus:signal:setup-friction"]),
        candidate("Improve guide authoring reliability", "recommend-only", ["novus:signal:guide-friction"]),
      ],
    },
    currentObjective: null,
    decision: "START",
    evidence: [
      {
        claim: "Setup friction is severe.",
        kind: "fact",
        layer: "experienced",
        sourceId: "novus:signal:setup-friction",
        windowOrStatus: "30 days",
        confidence: "high",
      },
      {
        claim: "Setup recovery is roadmap-ready.",
        kind: "fact",
        layer: "planned",
        sourceId: "linear:initiative:setup-recovery",
        windowOrStatus: "current cycle",
        confidence: "high",
      },
    ],
    alternatives: [
      {
        objective: "Improve setup recovery",
        disposition: "selected",
        reason: "This incorrectly repeats the selected candidate.",
      },
    ],
    planDelta: {
      activate: [objectiveV2("Improve setup recovery")],
      continue: [],
      narrow: [],
      defer: [],
      addValidation: [],
    },
    authority: {
      externalMutationsAllowed: false,
      internalPlanChangeStatus: "proposed",
      reason: "The caller asked for guidance, not implementation.",
      requiredApproval: null,
    },
  });

  assert.match(
    validateDecisionRecord(record).join("\n"),
    /START alternatives must include a candidate different from the activated objective/,
  );
});

test("runs CLI validation when the installed script is reached through a symlink", () => {
  const testDirectory = mkdtempSync(join(tmpdir(), "whats-next-validator-"));
  try {
    const realScript = fileURLToPath(
      new URL("./validate-steering-decision.mjs", import.meta.url),
    );
    const linkedScript = join(testDirectory, "validate-steering-decision.mjs");
    const decisionFile = join(testDirectory, "decision.json");
    symlinkSync(realScript, linkedScript);
    writeFileSync(decisionFile, JSON.stringify(validV2Record()), "utf8");

    const result = spawnSync(process.execPath, [linkedScript, decisionFile], {
      encoding: "utf8",
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "Decision record is valid.");
  } finally {
    rmSync(testDirectory, { recursive: true, force: true });
  }
});
