package com.aifitness.api.auth

import com.aifitness.api.user.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
) {

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("Email already in use")
        }
        val user = User(
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password),
            name = request.name,
        )
        val saved = userRepository.save(user)
        return buildAuthResponse(saved)
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("Invalid credentials") }
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw IllegalArgumentException("Invalid credentials")
        }
        return buildAuthResponse(user)
    }

    fun refresh(refreshToken: String): AuthTokensDto {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw IllegalArgumentException("Invalid refresh token")
        }
        val userId = jwtTokenProvider.getUserIdFromToken(refreshToken)
        val user = userRepository.findById(java.util.UUID.fromString(userId))
            .orElseThrow { IllegalArgumentException("User not found") }
        return AuthTokensDto(
            accessToken = jwtTokenProvider.generateAccessToken(
                user.id.toString(), user.email, user.role.name
            ),
            refreshToken = jwtTokenProvider.generateRefreshToken(
                user.id.toString(), user.email, user.role.name
            ),
        )
    }

    private fun buildAuthResponse(user: User): AuthResponse {
        val accessToken = jwtTokenProvider.generateAccessToken(
            user.id.toString(), user.email, user.role.name
        )
        val refreshToken = jwtTokenProvider.generateRefreshToken(
            user.id.toString(), user.email, user.role.name
        )
        return AuthResponse(user = user.toDto(), tokens = AuthTokensDto(accessToken, refreshToken))
    }
}

