package com.aifitness.api.user

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.OffsetDateTime
import java.util.UUID

data class UserDto(
    val id: UUID,
    val email: String,
    val name: String?,
    val role: String,
    val createdAt: OffsetDateTime,
)

data class LoginRequest(
    @field:NotBlank @field:Email val email: String,
    @field:NotBlank @field:Size(min = 8) val password: String,
)

data class RegisterRequest(
    @field:NotBlank @field:Email val email: String,
    @field:NotBlank @field:Size(min = 8) val password: String,
    val name: String? = null,
)

data class AuthTokensDto(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long = 900,
)

data class AuthResponse(
    val user: UserDto,
    val tokens: AuthTokensDto,
)

data class RefreshRequest(val refreshToken: String)

fun User.toDto() = UserDto(
    id = id,
    email = email,
    name = name,
    role = role.name,
    createdAt = createdAt,
)

