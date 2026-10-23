export type CourseProgress = {
  courseId: string;
  title: string;
  completionPercentage: number;
  lastActivityAt: string;
  status: string;
  isStale?: boolean;
  remainingLessonCount: number;
  estimatedMinutesRemaining: number;
};

export type LearnerProgressResponse = {
  learnerId: number;
  courses: CourseProgress[];
};

export type ApiErrorBody = {
  error?: string;
};
