import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  answerQuizQuestion,
  fetchEnrollment,
  fetchEnrollments,
  fetchQuiz,
  fetchQuizAccess,
  fetchQuizAttempt,
  fetchQuizResult,
  resetLearningProgress,
  saveWatchedProgress,
  startQuizAttempt,
  submitQuizAttempt,
} from './requests'

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  detail: (courseId: string) => ['enrollments', courseId] as const,
  quiz: (courseId: string, quizId: string) => ['quiz', courseId, quizId] as const,
  quizAccess: (courseId: string, quizId: string) => ['quiz-access', courseId, quizId] as const,
  attempt: (courseId: string, quizId: string) => ['quiz-attempt', courseId, quizId] as const,
  result: (courseId: string, quizId: string) => ['quiz-result', courseId, quizId] as const,
}

export function useEnrollmentQuery(courseId: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(courseId),
    queryFn: () => fetchEnrollment(courseId),
  })
}

export function useEnrollmentsQuery() {
  return useQuery({ queryKey: enrollmentKeys.all, queryFn: fetchEnrollments })
}

export function useSaveWatchedMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveWatchedProgress,
    onSuccess: (enrollment) => {
      queryClient.setQueryData(enrollmentKeys.detail(enrollment.courseId), enrollment)
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
    },
  })
}

export function useQuizQuery(courseId: string, quizId: string) {
  return useQuery({
    queryKey: enrollmentKeys.quiz(courseId, quizId),
    queryFn: () => fetchQuiz(courseId, quizId),
    // Questions must not be refetched mid-attempt: the learner would see the
    // list reorder under them.
    staleTime: Infinity,
  })
}

export function useQuizAccessQuery(courseId: string, quizId: string) {
  return useQuery({
    queryKey: enrollmentKeys.quizAccess(courseId, quizId),
    queryFn: () => fetchQuizAccess(courseId, quizId),
  })
}

export function useQuizAttemptQuery(courseId: string, quizId: string, enabled = true) {
  return useQuery({
    queryKey: enrollmentKeys.attempt(courseId, quizId),
    queryFn: () => fetchQuizAttempt(courseId, quizId),
    enabled,
  })
}

export function useQuizResultQuery(courseId: string, quizId: string) {
  return useQuery({
    queryKey: enrollmentKeys.result(courseId, quizId),
    queryFn: () => fetchQuizResult(courseId, quizId),
  })
}

export function useStartAttemptMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startQuizAttempt,
    onSuccess: (attempt) => {
      queryClient.setQueryData(enrollmentKeys.attempt(attempt.courseId, attempt.quizId), attempt)
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(attempt.courseId) })
    },
  })
}

export function useAnswerQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: answerQuizQuestion,
    onSuccess: (attempt) => {
      if (!attempt) return
      queryClient.setQueryData(enrollmentKeys.attempt(attempt.courseId, attempt.quizId), attempt)
    },
  })
}

export function useSubmitAttemptMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitQuizAttempt,
    onSuccess: (result, variables) => {
      queryClient.setQueryData(enrollmentKeys.result(variables.courseId, result.quizId), result)
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-access'] })
    },
  })
}

export function useResetProgressMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resetLearningProgress,
    onSuccess: () => queryClient.clear(),
  })
}
