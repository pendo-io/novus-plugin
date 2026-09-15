# Usage Brief output contract

Title the output **Usage Brief · <proposed change>**. Directly below it, add **Who uses this today, and what this change could improve.** Keep both inside the reusable report, not only in the surrounding chat. Default to 110–160 words with three short headings: **Current usage**, **What this could improve**, and **How we'll know**. Use bold labels in a comment or short Slack version. Honor a caller's requested format while preserving the purpose and these questions.

Lead with trustworthy current usage when available, then explain the proposed benefit. Include a material evidence gap rather than filling the template with unsupported numbers.

## Current usage · <area>

Describe the area and specific control's usage with counts, matching denominator, and window. Distinguish overall reach from adoption among people who could encounter the feature. Note account concentration or audience differences when they change the interpretation. Exclude internal/test/bot/researcher traffic when reliable filters exist; otherwise state the limitation.

If measurement cannot support a headline, lead with the gap. For example: `A visitor-ID change splits the comparison window, so we cannot tell whether the apparent increase reflects new people.` Do not lead with an invalid growth number and rely on a later caveat to undo it.

## What this change could improve

Explain the customer need, how the proposed change addresses it, and who could benefit. Keep an inferred benefit provisional and cite a relevant signal or intent source when available.

Growth, completion, efficiency, reliability, reduced errors, and repeat value are all valid outcomes. Low usage is not automatically high opportunity. A narrow feature can matter greatly to the customers who need it, and a heavily used task can still be unnecessarily slow.

## How we'll know

Name one success measure with a trustworthy baseline when available. A supported target is optional. If the baseline is unavailable, state the smallest missing measurement in one sentence. This is a proposed success check, not a claim that the change worked.

## Tiffany writing style and evidence

When `tiffany-style` is available, read and apply it before drafting. The rules here remain usable when that personal skill is not installed. Write as a colleague explaining a proposed change to its builder: who needs it, what gets easier, and how to check the result. Prefer “customers wait 45 seconds for an export” to “the surface presents an efficiency opportunity.”

Use natural sentences and concrete customer behavior. Avoid em dashes, decorative emoji, canned praise, fragments, abstract labels, and manufactured contrasts. Keep function, service, file, and metric-field names out of the prose unless the reader needs them to understand the finding. Describe the behavior before citing its source.

Before returning the brief, make one read-aloud pass. Remove repeated conclusions and details that do not change the builder's understanding. Keep each material limitation to one direct sentence beside the claim; put supporting detail in sources. Leave unusable numbers out of the main brief instead of listing and retracting them.

Potential is an evidence-based hypothesis, not a predicted lift. A larger active-user base does not imply every user needs the feature. Do not present repeated use of an occasionally needed task as a universal requirement. Keep windows and limitations beside the measures they qualify. State the smallest missing measurement when a proposed success measure cannot be trusted.

## Posting

For a comment, prefix the brief with `Usage brief for this change, using Pendo data through Novus.` Include stable source links so it stands alone. Show the exact text and target before asking to post. Post only after confirmation; otherwise return the brief without sending anything.

## Final check

- The opening contains supported usage or the evidence gap that prevents it.
- Counts, populations, and windows match, and customer traffic is distinguished from internal activity.
- The proposed benefit follows from a real need or explicitly provisional rationale.
- The success measure reflects that benefit, including efficiency or reliability when appropriate.
- No arbitrary growth forecast, target, or benchmark is introduced.
- No comment is posted without confirmation of its exact text and target.
