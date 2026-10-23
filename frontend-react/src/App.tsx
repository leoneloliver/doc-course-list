import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { track } from './analytics';
import type { ApiErrorBody, CourseProgress, LearnerProgressResponse } from './types';

const LEARNERS = [
  { id: 1, label: 'Learner 1 · 3 courses' },
  { id: 2, label: 'Learner 2 · 1 course' },
  { id: 3, label: 'Learner 3 · none in progress' },
  { id: 999, label: 'Learner 999 · unknown' },
] as const;

const QUICK_WIN_MINUTES = 30;

type ViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; courses: CourseProgress[] };

export function App() {
  const [learnerId, setLearnerId] = useState(1);
  const [quickWinsOnly, setQuickWinsOnly] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ status: 'loading' });

  const loadProgress = useCallback(async (id: number, signal: AbortSignal) => {
    setView({ status: 'loading' });
    setSelectedCourseId(null);

    try {
      const res = await fetch(`/api/learners/${id}/progress`, { signal });
      const body = (await res.json()) as LearnerProgressResponse | ApiErrorBody;

      if (!res.ok) {
        const message =
          'error' in body && body.error ? body.error : `Request failed (${res.status})`;
        setView({ status: 'error', message });
        return;
      }

      const courses = (body as LearnerProgressResponse).courses;
      setView({ status: 'ready', courses });
      track('course_progress_viewed', {
        learnerId: id,
        courseCount: courses.length,
      });
    } catch (error) {
      if (signal.aborted) {
        return;
      }
      const message = error instanceof Error ? error.message : 'Could not load progress';
      setView({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadProgress(learnerId, controller.signal);
    return () => controller.abort();
  }, [learnerId, loadProgress]);

  const visibleCourses = useMemo(() => {
    if (view.status !== 'ready') {
      return [];
    }
    if (!quickWinsOnly) {
      return view.courses;
    }
    return view.courses.filter(
      (course) => course.estimatedMinutesRemaining <= QUICK_WIN_MINUTES,
    );
  }, [quickWinsOnly, view]);

  function selectCourse(course: CourseProgress) {
    setSelectedCourseId(course.courseId);
    track('course_selected', {
      learnerId,
      courseId: course.courseId,
      estimatedMinutesRemaining: course.estimatedMinutesRemaining,
    });
  }

  return (
    <main className="page">
      <p className="eyebrow">Docebo · pilot</p>
      <h1>My progress</h1>
      <p className="lede">Pick up where you left off. Auth is stubbed as a learner switcher.</p>

      <div className="toolbar">
        <label className="field">
          <span>Learner</span>
          <select
            value={learnerId}
            onChange={(event) => setLearnerId(Number(event.target.value))}
          >
            {LEARNERS.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.label}
              </option>
            ))}
          </select>
        </label>
        <label className={quickWinsOnly ? 'chip chip-on' : 'chip'}>
          <input
            type="checkbox"
            checked={quickWinsOnly}
            onChange={(event) => setQuickWinsOnly(event.target.checked)}
          />
          <span className="switch" aria-hidden="true" />
          <span className="chip-copy">
            Quick wins
            <small>≤ {QUICK_WIN_MINUTES} min left</small>
          </span>
        </label>
      </div>

      {view.status === 'loading' ? <p className="status">Loading your courses…</p> : null}

      {view.status === 'error' ? (
        <div className="panel panel-error" role="alert">
          <p>{view.message}</p>
          <button type="button" onClick={() => void loadProgress(learnerId, new AbortController().signal)}>
            Try again
          </button>
        </div>
      ) : null}

      {view.status === 'ready' && view.courses.length === 0 ? (
        <div className="panel">
          <p>No in-progress courses. You are caught up — nothing to resume right now.</p>
        </div>
      ) : null}

      {view.status === 'ready' && view.courses.length > 0 && visibleCourses.length === 0 ? (
        <div className="panel">
          <p>No courses match the quick-win filter. Turn it off to see everything in progress.</p>
        </div>
      ) : null}

      {view.status === 'ready' && visibleCourses.length > 0 ? (
        <ul className="course-list">
          {visibleCourses.map((course, index) => (
            <li key={course.courseId}>
              <button
                type="button"
                className={
                  course.courseId === selectedCourseId ? 'course course-selected' : 'course'
                }
                onClick={() => selectCourse(course)}
              >
                <h2>{course.title}</h2>
                <p className="meta">
                  {course.completionPercentage}% complete · {formatLastActivity(course.lastActivityAt)}
                </p>
                <div
                  className="bar"
                  role="progressbar"
                  aria-valuenow={course.completionPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    style={
                      {
                        '--progress': `${course.completionPercentage}%`,
                        animationDelay: `${index * 90}ms`,
                      } as CSSProperties
                    }
                  />
                </div>
                <p className="meta">
                  {course.remainingLessonCount}{' '}
                  {course.remainingLessonCount === 1 ? 'lesson' : 'lessons'} left · about{' '}
                  {course.estimatedMinutesRemaining} min remaining
                </p>
                {course.isStale ? <span className="badge">Inactive</span> : null}
                {course.estimatedMinutesRemaining <= QUICK_WIN_MINUTES ? (
                  <span className="badge badge-win">Quick win</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}

function formatLastActivity(iso: string): string {
  const date = new Date(iso);
  const diffDays = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    return 'Last activity today';
  }
  if (diffDays === 1) {
    return 'Last activity yesterday';
  }
  return `Last activity ${diffDays} days ago`;
}
