# AI Usage

## Tools used

Cursor (agent) for implementation against the take-home spec, tests, and starters.

## What AI helped with

| Area | How AI was used | Your involvement |
|------|-----------------|------------------|
| Backend list logic | Drafted `getInProgressCourses` from the failing tests | Confirmed filter / stale / sort against `progress.api.test.ts` before keeping it |
| Extra rule | Suggested remaining-time from lesson counts | Chose 20 min/lesson, the 30-min quick-win cutoff, and learner 3 for empty-state demo; wrote tests for those fields |
| React UI | Extended the starter with loading/error/empty, filter, switcher | Kept one page, no extra app; fixed copy (“lessons left”) after checking the running UI |
| Docs | Filled PRODUCT / AI_USAGE / run README from the templates | Cut scope language and the success metric to one resume-rate number |

## What you rejected or rewrote

Rejected a **Continue / next-lesson** action (and a course-detail page). The spec excludes that as a second major flow and as an extra-rule stand-in. Remaining time plus a filter is the rule; clicking a row only selects it and fires analytics.

Also did not ship both frontends or scaffold a third app.

## What you'd do differently without AI

The React loading/error/empty wiring and PRODUCT.md first draft would have taken longer; the service logic would still have started from the tests.

## Ownership statement

I can explain and change live, without AI: `progressService.ts` (filter, completion, stale, remaining-time), the progress route and error classes, seed cases (learners 1–3 and 999), the React `App` states and analytics stub, and the product cuts in `PRODUCT.md`. I would not claim the unused Angular starter as part of this submission.
