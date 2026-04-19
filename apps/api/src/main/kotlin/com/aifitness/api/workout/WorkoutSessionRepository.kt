package com.aifitness.api.workout

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface WorkoutSessionRepository : JpaRepository<WorkoutSession, UUID> {
    fun findByUserIdOrderByCreatedAtDesc(userId: UUID, pageable: Pageable): Page<WorkoutSession>

    @Query("""
        SELECT COUNT(w) FROM WorkoutSession w WHERE w.user.id = :userId
    """)
    fun countByUserId(userId: UUID): Long

    @Query("""
        SELECT COALESCE(SUM(w.repCount), 0) FROM WorkoutSession w WHERE w.user.id = :userId
    """)
    fun sumRepsByUserId(userId: UUID): Long

    @Query("""
        SELECT COALESCE(SUM(w.durationSeconds), 0) FROM WorkoutSession w WHERE w.user.id = :userId
    """)
    fun sumDurationByUserId(userId: UUID): Long

    @Query("""
        SELECT COALESCE(SUM(w.repCount), 0) FROM WorkoutSession w 
        WHERE w.user.id = :userId AND w.createdAt >= :since
    """)
    fun sumRepsInWeek(userId: UUID, since: java.time.OffsetDateTime): Long
}

