# Usage Brief output contract

Return a short, plain-language brief a builder reads in one pass and acts on. Reason in the tiers below internally, but **render them as plain sentences — never as labels**. The reader is a builder without deep product-analytics fluency: lead with what the change means for customers and how carefully to test it, and keep engineering names and metric jargon out of the way.

## Shape

Write **4–6 short paragraphs or tight lines, ~120–160 words**, in this order. No section headers, no rating labels, no tables.

1. **The call, in one line** — how carefully to test, as a plain instruction: *"Test this carefully — but only the &lt;part&gt;."* / *"Normal testing is fine."* / *"Light touch — &lt;why&gt;."*
2. **What the change does, for customers** — one plain sentence.
3. **Who it affects** — reach in human terms (*"~118 people / 79 accounts a month, and slipping"*), with internal/test/researcher traffic separated out. A number earns its place only if it changes the call.
4. **Why it needs (or doesn't need) care** — the decisive reason in plain terms: an outbound or irreversible effect, a concentrated high-value audience, a fragile track record. Name what breaks and whose side it breaks on.
5. **The lever, in a sentence** — *"This deepens the product for existing &lt;users&gt;; it won't win new ones."* (adoption vs. stickiness as plain English, never the label), and separate it from the surface's own trajectory.
6. **What to test** — the specific risky path in plain language (*"the flow that opens and tracks the PR on the customer's repo, and that each lookup stays scoped to the right customer"*) and what to skip. Describe the path by **what it does**, not by function, service, or file names.

Then, **only when the change's own impact will not be cleanly measurable**, add one plain line:

> *"Will you know if it worked?"* — say why not, and where the number lives instead (*"Not from analytics — we don't track X; pull it from the database if you need it."*).

Omit that line entirely when impact is measurable — its presence is a signal, not boilerplate.

## Reason in these tiers — internal, do not print the labels

**Verification level** (drives paragraph 1):

| Tier | Renders as | When |
| --- | --- | --- |
| HEAVY | "Test this carefully" | high reach, or a critical/irreversible path, or a small but high-value/at-risk audience |
| STANDARD | "Normal testing is fine" | moderate reach, reversible action, no concentrated stakes |
| LIGHT | "Light touch" | low reach, read-only or trivially reversible, no concentrated stakes |

Reachability (a partial rollout or feature gate) can lower the call; account concentration or a fast-rising trend can raise it past what raw reach implies — say which, plainly (*"capped to Bitbucket customers"*, *"and rising fast"*).

**Growth lever** (drives paragraph 5): the change deepens use for existing users (stickiness), brings new users (adoption), both, or neither — rendered as a plain sentence.

## Rules

- ~120–160 words, never over ~200. No headers, no rating labels, no metric tables.
- Product language first. **Never a bare function, service, file, or endpoint name** — describe what the code does. A path may follow in plain words only if it genuinely sharpens the target.
- Every number is in human terms and separates internal/test/researcher traffic from customers.
- One clear test instruction: the risky path named plainly, and what to skip.
- The measurability line appears **only** when impact isn't cleanly measurable, and says where the number lives instead.
- No usage claim beyond what the measurement supports; no zero rendered as zero use; nothing external changed.

## Final check

- A builder reads it in one pass and knows how hard to test and why.
- No rating labels (`HEAVY`, `ADOPTION-LEANING`), no bare code/service names, no metric table.
- Reach is human and separates internal/test traffic; the lever (deepen vs. acquire) is a plain sentence.
- The decisive reason for the call is named in plain terms — what breaks, and whose side.
- The measurability line is present only when there's a real gap, and points to where the number actually lives.
