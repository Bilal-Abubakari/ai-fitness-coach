package com.aifitness.api.workout

import com.aifitness.api.auth.JwtPrincipal
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/workouts")
class WorkoutController(private val workoutService: WorkoutService) {

    @GetMapping("/sessions")
    fun getSessions(
        @AuthenticationPrincipal principal: JwtPrincipal,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ) = workoutService.getSessions(principal.userId, page, size)

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    fun createSession(
        @AuthenticationPrincipal principal: JwtPrincipal,
        @Valid @RequestBody request: CreateWorkoutSessionRequest,
    ) = workoutService.createSession(principal.userId, request)

    @GetMapping("/progress")
    fun getProgress(@AuthenticationPrincipal principal: JwtPrincipal) =
        workoutService.getProgress(principal.userId)
}

