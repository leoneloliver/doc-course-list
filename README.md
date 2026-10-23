# Learner Progress MVP

Thin “my progress” list so learners can pick up in-progress courses. **Frontend: React.**

## Run locally (Node 20+)

Keep **3001** and **5173** free, then from two terminals:

```bash
cd backend && npm install && npm test && npm run dev
```

```bash
cd frontend-react && npm install && npm run dev
```

Open http://localhost:5173.

## Demo

| Learner | What you should see |
|---------|---------------------|
| 1 | Three in-progress courses (Compliance is Inactive / quick win) |
| 2 | One course |
| 3 | Empty state |
| 999 | Error + Try again |

Toggle **Quick wins** to keep courses with ≤ 30 minutes estimated remaining. Click a course to select it (`course_selected` in the browser console). List loads emit `course_progress_viewed`.

## Notes

- API: `GET /api/learners/:learnerId/progress` on http://localhost:3001
- Auth is a learner dropdown (stub). Persistence is in-memory seed data.
- Product choices: [`PRODUCT.md`](./PRODUCT.md). AI use: [`AI_USAGE.md`](./AI_USAGE.md).
- Do not start `frontend-angular/` — it is unused for this submission.
