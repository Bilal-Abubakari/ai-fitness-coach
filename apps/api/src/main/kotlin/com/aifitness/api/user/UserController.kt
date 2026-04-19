package com.aifitness.api.user

import com.aifitness.api.auth.JwtPrincipal
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/users")
class UserController(private val userRepository: UserRepository) {

    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal principal: JwtPrincipal): UserDto {
        val user = userRepository.findById(UUID.fromString(principal.userId))
            .orElseThrow { NoSuchElementException("User not found") }
        return user.toDto()
    }

    @PatchMapping("/me")
    fun updateMe(
        @AuthenticationPrincipal principal: JwtPrincipal,
        @RequestBody body: UpdateUserRequest,
    ): UserDto {
        val user = userRepository.findById(UUID.fromString(principal.userId))
            .orElseThrow { NoSuchElementException("User not found") }
        body.name?.let { user.name = it }
        return userRepository.save(user).toDto()
    }
}

data class UpdateUserRequest(val name: String? = null)

