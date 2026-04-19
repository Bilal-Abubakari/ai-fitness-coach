package com.aifitness.api.workout

import com.aifitness.api.user.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.UUID

@Service
class WorkoutService(
    private val workoutSessionRepository: WorkoutSessionRepository,
    private val userRepository: UserRepository,
) {
    fun getSessions(userId: String, page: Int, size: Int): Page<WorkoutSessionDto> {
        val uuid = UUID.fromString(userId)
        return workoutSessionRepository
            .findByUserIdOrderByCreatedAtDesc(uuid, PageRequest.of(page, size))
            .map { it.toDto() }
    }

    fun createSession(userId: String, request: CreateWorkoutSessionRequest): WorkoutSessionDto {
        val user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow { NoSuchElementException("User not found") }

        val session = WorkoutSession(
            user = user,
            exerciseType = ExerciseType.valueOf(request.exerciseType),
            repCount = request.repCount,
            durationSeconds = request.durationSeconds,
            feedbackJson = request.feedbackJson,
        )
        return workoutSessionRepository.save(session).toDto()
    }

    fun getProgress(userId: String): WorkoutProgressDto {
        val uuid = UUID.fromString(userId)
        val now = OffsetDateTime.now()
        val weekAgo = now.minusWeeks(1)

        // Build 7-day rep breakdown
        val weeklyReps = (6 downTo 0).map { daysAgo ->
            val dayStart = now.minusDays(daysAgo.toLong()).toLocalDate().atStartOfDay()
                .atOffset(now.offset)
            val dayEnd = dayStart.plusDays(1)
            workoutSessionRepository.findByUserIdOrderByCreatedAtDesc(uuid, PageRequest.of(0, 1000))
                .content
                .filter { it.createdAt >= dayStart && it.createdAt < dayEnd }
                .sumOf { it.repCount.toLong() }
        }

        val lastSession = workoutSessionRepository
            .findByUserIdOrderByCreatedAtDesc(uuid, PageRequest.of(0, 1))
            .content
            .firstOrNull()

        return WorkoutProgressDto(
            totalSessions = workoutSessionRepository.countByUserId(uuid),
            totalReps = workoutSessionRepository.sumRepsByUserId(uuid),
            totalDurationSeconds = workoutSessionRepository.sumDurationByUserId(uuid),
            lastSessionAt = lastSession?.createdAt,
            weeklyReps = weeklyReps,
        )
    }
}

