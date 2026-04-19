package com.aifitness.api.workout

import com.aifitness.api.user.User
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.OffsetDateTime
import java.util.UUID

enum class ExerciseType { squat, pushup, lunge, deadlift }

@Entity
@Table(name = "workout_sessions")
class WorkoutSession(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_type", nullable = false)
    @org.hibernate.annotations.JdbcType(org.hibernate.type.descriptor.jdbc.VarcharJdbcType::class)
    val exerciseType: ExerciseType = ExerciseType.squat,

    @Column(name = "rep_count", nullable = false)
    val repCount: Int = 0,

    @Column(name = "duration_seconds", nullable = false)
    val durationSeconds: Int = 0,

    @Column(name = "feedback_json", columnDefinition = "jsonb")
    val feedbackJson: String? = null,

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)

