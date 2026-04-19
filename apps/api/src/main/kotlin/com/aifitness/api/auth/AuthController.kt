package com.aifitness.api.auth

import com.aifitness.api.user.LoginRequest
import com.aifitness.api.user.RegisterRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegisterRequest) = authService.register(request)

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest) = authService.login(request)

    @PostMapping("/refresh")
    fun refresh(@RequestBody request: RefreshRequest) = authService.refresh(request.refreshToken)
}

