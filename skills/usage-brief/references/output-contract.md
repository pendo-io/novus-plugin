# Usage Brief output contract

Return a short, plain-language brief that **leads with the current usage numbers** for the area a change touches, then reads whether the change can grow that usage. This is also the exact text posted as a comment, so it must stand on its own. The reader is a builder without deep product-analytics fluency: plain product language, no metric jargon, no internal labels.

## Shape

Two short blocks, **~110–160 words total**. Keep the two headers; no other headers, no tables.

```markdown
**📊 Current usage — <area>**

- <Surface> was used by **X people / Y accounts** in the last 30 days (**~Z% of active users**), <trend vs the prior 30 days>.
- <Who: top accounts/visitors, with internal / test / researcher traffic separated out — not folded into customer reach.>
- <The specific control or flow this change touches, and its own usage when measurable on its own.>

**📈 Can this change grow usage?**

- <Headroom, plainly: low or declining usage = room to grow; high and saturated = little room.>
- <Lever: brings new users / deepens use for people already here / neither — one sentence, separated from the surface's own trajectory.>
- <The number that would show it worked: the metric this change could move, its value now, and a realistic ceiling — with an honest caveat and where the number would come from if it isn't cleanly measurable yet.>
- <Optional: a known Novus signal this change addresses, when one exists.>
```

## Rules

- Lead with the usage numbers. The first block a reader sees is real current usage, not a caveat or a rating.
- Every number in human terms, as a **share of active users** with its window, and with internal/test/researcher traffic separated from customers. A number earns its place only if it informs current usage or the growth read.
- Growth is an **estimate, never a prediction** — grounded in headroom, lever, reachable population, and known signals. Say "room to grow" / "little room", not "will increase usage by N%".
- Plain product language. No function, service, file, or endpoint names; no rating labels; no metric field names (`numVisitors`, "period-over-period") in the body.
- No testability, severity, or "how hard to test" content — that is out of scope for this skill.
- No usage claim beyond what the measurement supports; never render zero events as zero use, or an unmeasurable metric as "no potential".

## Posting

The blocks above are the comment body. Prefix it with one line naming what it is and the source, e.g.:

```markdown
_Usage brief for this change — current product usage and its potential to grow it, from Pendo via Novus._
```

Post only after the user confirms the exact text and the target (the PR, or the linked Linear/Jira ticket). If neither resolves or there is no write access, return the comment for manual paste and say it was not posted.

## Final check

- The brief opens with current usage numbers for the area, as a share of active users, with internal/test traffic separated.
- The growth read is an honest estimate (headroom + lever + reachable population), not a predicted number.
- One metric named as "what would show it worked", with a caveat when it isn't cleanly measurable.
- No testability/severity content; no rating labels; no code, service, or metric-field names in the body.
- Nothing was posted without explicit confirmation of the text and the target.
