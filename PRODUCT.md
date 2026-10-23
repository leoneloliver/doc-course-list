# Product Notes

## User problem

Learners on Docebo often juggle several courses at once and lose track of which one to resume. Completion percent in a catalog is not enough: they need a dedicated “where I left off” list with recency, staleness, and a sense of how much effort is left. Without that, in-progress courses go quiet and re-engagement drops.

## MVP scope

This submission delivers:

- `GET /api/learners/:learnerId/progress` — in-progress only, completion %, last activity, 30-day stale flag, sorted by recency
- One extra rule: estimated remaining time from incomplete lesson count
- A React list with loading, error, and empty states
- A learner switcher so an interviewer can demo learner 1 / 2 / 3 / 999 without auth
- A “Quick wins” filter on remaining time
- Two console analytics events: `course_progress_viewed`, `course_selected`

## Extra business rule

**Estimated remaining time** = incomplete lessons × 20 minutes.

Learners use this to pick a course they can actually finish in the time they have. Admins get a cheap “effort left” signal without lesson-level durations in the data. Courses with ≤ 30 minutes remaining are labeled **Quick win** and can be filtered in the UI.

This is not the 30-day stale flag, not sort-by-activity, and not a Continue / next-lesson action.

## What I intentionally cut

| Cut | Why |
|-----|-----|
| Angular starter | Same scoring; React was the faster ship for this window |
| Course player / Continue / next lesson | Spec marks a second major flow out of scope; the list is the bet |
| Real auth / SSO | Header already exists as a stand-in; a dropdown is enough to demo |
| Persistence beyond in-memory seed | No writes in the MVP; seed is enough to prove the list |
| CI pipeline | Nice-to-have; tests already run locally in the README |

## Success metric

- Metric name: **7-day resume rate after progress view**
- How you'd measure it: of learners who fire `course_progress_viewed`, the share who later have `lastActivityAt` advance on at least one listed in-progress course within 7 days
- What "good" looks like in the first 30 days: a lift vs. the same population using only the catalog (target: **+10 percentage points** on resume rate among learners with ≥2 in-progress courses)

## Assumptions

| Topic | Choice | Why |
|-------|--------|-----|
| Persistence | In-memory seed | Matches the starter; no write path in this slice |
| Auth | Hardcoded learner dropdown | Interviewer can hit happy / empty / error without cookies |
| Completion % | Round(completed lessons / total × 100) | Already in the starter helpers and required by tests |
| Remaining time | 20 minutes per remaining lesson | Seed has no durations; 20 min is a conservative default |
| Time zones | Store UTC ISO; display relative local days | API stays unambiguous; UI is scannable |
| Analytics | `console.info` JSON stub | No vendor in the 2-hour window; events are still inspectable |
| Trust boundary | Route does **not** compare `x-authenticated-learner-id` to `:learnerId` | Starter is explicit; in production a mismatch should 403 |
| Extra seed | Learner 3 completed-only | Makes the empty state demoable |

## What I'd build next

- Per-lesson durations (or historical median) instead of a flat 20 minutes
- Enforce the auth check (403 on learner mismatch) and drop the demo dropdown
- Persist enrollments and activity so last-activity updates from a real player
- A/B the progress list vs. catalog-only on the resume-rate metric
- Optional: a single “resume” deep link once the player contract exists
