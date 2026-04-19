package com.aifitness.api.workout

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.time.OffsetDateTime
import java.util.UUID

data class WorkoutSessionDto(
    val id: UUID,
    val exerciseType: String,
    val repCount: Int,
    val durationSeconds: Int,
    val feedbackJson: String?,
    val createdAt: OffsetDateTime,
)

data class CreateWorkoutSessionRequest(
    @field:NotNull val exerciseType: String,
    @field:Min(0) val repCount: Int,
    @field:Min(0) val durationSeconds: Int,
    val feedbackJson: String? = null,
)

data class WorkoutProgressDto(
    val totalSessions: Long,
    val totalReps: Long,
    val totalDurationSeconds: Long,
    val lastSessionAt: OffsetDateTime?,
    val weeklyReps: List<Long>,
)

fun WorkoutSession.toDto() = WorkoutSessionDto(
    id = id,
    exerciseType = exerciseType.name,
    repCount = repCount,
    durationSeconds = durationSeconds,
    feedbackJson = feedbackJson,
    createdAt = createdAt,
)

