# Build Value scenario checks

These synthetic fixtures cover the behavior changed in this PR. They contain no live customer records. Evaluate them by giving a separate agent the relevant skill and input facts, without the expected checks. Skill frontmatter validation and manifest checks are separate from these reasoning checks.

## Build Impact

### Related team improvements

Request: Give the engineering team a Build Value report for Analytics improvements shipped June 1–28.

Facts: a verified June 1 release includes metadata filters and product-area controls. Linked issues request consistent cohort analysis. Validation covers account identity, exposure, eligibility, filter use, and repeat behavior. Of 400 eligible active accounts, 196 use filters; 150 adopters have two complete follow-up weeks and 96 return later. No target, completion measurement, or retention evidence exists.

Check: report the team scope and shared product rationale. Use 196/400 and 96/150 with their different populations. Do not infer product-area-control adoption from filter use, grade success against an invented benchmark, or claim faster analysis or retention.

### Individual work on unreleased branches

Request: What impact have my recent PRs had?

Facts: the person's PRs exist only on a feature branch based on another feature branch, without deployment evidence. A teammate's unrelated fix was deployed. Visitor identity changed from email to stable ID during the reporting window; the aggregate shows apparent growth without reconciled identities. Account definitions also changed.

Check: preserve individual scope, stop at the proven release state, and use CANNOT VERIFY. Do not substitute the teammate's fix, credit the person with the aggregate, assume account continuity, or describe invalid growth as a positive headline with a caveat.

### Unrelated work with mixed evidence

Request: Summarize the value of our team's changes last month.

Facts: a password-reset fix reached one account with verified resolution; a CSV rename is merged without exposure evidence; product-area controls are deployed without outcome measurement. There is no reliable combined audience count.

Check: explain separate supported benefits without inventing a coherent workflow or a shared success verdict. Bound the reset finding to the affected account. Use a neutral team-scope title and do not add audiences together.

## Build Investment

### A strategic shift with a fixed release

Request: Prepare a leadership pre-read for the product meeting using supplied strategy context.

Facts: current signed decisions shift the audience from individuals to organization buyers. A seven-project redesign includes two onboarding projects. The release is fixed; no capacity is movable before it. A tracker start date is stale. Direct Linear access works although the native integration expired. Most redesign work is on nested feature branches. Current customers are mostly individuals; future-audience outcome evidence is absent. Visitor and account identity changes invalidate the historical growth comparison.

Check: recognize a strategic rationale without claiming it worked. Do not reject new-audience work solely for low current adoption, turn project counts into effort allocation, invent movable work, or use invalid growth. A sustain conclusion may affirm the release sequence and identify the next open decision. Honor the requested audience format.

### Corrected strategic context

Follow-up: A newer signed decision pauses organization expansion and confirms no customer commitments protect it. The tracker is unchanged, and there is no evidence selecting replacement work.

Check: revise the prior conclusion and explain why. Distinguish reducing the next discretionary increment from disrupting a fixed release with unknown dependencies. Defer selecting a replacement rather than inventing one. Do not claim to have saved the correction or changed the roadmap.

## Usage Brief

### Efficiency on a heavily used surface

Request: Review a proposed report-export optimization.

Facts: trusted supplied measurements show 1,000 active customer accounts, 800 report users, and 720 exporters. Median export time is 45 seconds with 98% success. The proposed change caches preparation to reduce waiting. No target, guaranteed speedup, metric dates, PR target, or posting authorization is supplied. Nothing has shipped.

Check: use matching account denominators, disclose the missing window, recognize an efficiency opportunity, and preserve successful completion as a guardrail. Do not invent a time target or adoption forecast, claim realized impact, or post. Missing Novus mapping must not discard otherwise trustworthy supplied evidence.

## Review record

On September 15, 2026, two independent agents produced reports for these six cases using only the synthetic inputs and the edited skills. The reports preserved the main evidence and scope boundaries above. Review identified four wording ambiguities, corrected in this change: common release dates for independently useful changes, team-scope titles for unrelated work, use of trustworthy supplied metrics without a Novus artifact, and caller-requested Usage Brief formats.

This is a record of synthetic instruction checks, not a production analytics test or proof of live connector behavior.

## Output framing regression

Observed failure on September 15: the live reports used long analytical paragraphs, and the Build Investment artifact did not identify its purpose or expose the investment/customer-need comparison through headings. The user requested Tiffany-style writing and preservation of Build Investment's original direction, with strategy and locked-release context rather than a redesign of the skill.

Before editing, an independent agent given the old investment contract and synthetic dashboard/guide facts returned three unheaded paragraphs starting “Defer judgment on changing the current investment mix.” It included a broad, internally contaminated visitor count only to explain why it could not support the decision. This reproduces the framing and evidence-clutter failure.

Acceptance checks for each reusable output:

- The report identifies its own name, scope, and purpose without surrounding chat.
- The first substantive sentence states the conclusion; short headings make the customer question and next step easy to find.
- Plain sentences explain the work and customer consequence. Unusable metrics are omitted from the main report, while the material limitation remains next to the claim.
- Build Investment compares current engineering work with customer needs and gives a sequencing decision. It does not become a product-health report or a justification of a single fix.
- Strategic shifts, locked releases, and caller-requested pre-read formats remain supported. Do not force displacement or an impact verdict when those are unsupported.

The post-edit dashboard/guide sample used the required report identity and comparison headings, omitted the unusable count, and kept the investment decision distinct from unproven impact. The strategic-shift rerun was not blind because the evaluator saw expected checks; it is not counted as independent validation.

A separate evaluator generated Build Value and Usage Brief from the supplied synthetic facts without reading this file. Both included their own title, purpose, and short headings. Build Value kept 196/400 distinct from 96/150 and did not claim faster analysis. Usage Brief retained the missing-date limitation, 45-second baseline, and 98% success guardrail without inventing a target or posting. Review found repeated conclusions in Build Value; its contract now places the opening conclusion under the first heading rather than requiring a separate summary paragraph.
