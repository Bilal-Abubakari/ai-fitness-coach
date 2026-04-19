package com.aifitness.api.auth

import com.aifitness.api.user.LoginRequest
import com.aifitness.api.user.RegisterRequest
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper

    @Test
    fun `should register and login successfully`() {
        val register = RegisterRequest(
            email = "test@example.com",
            password = "password123",
            name = "Test User",
        )

        // Register
        val registerResult = mockMvc.post("/api/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(register)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.tokens.accessToken") { exists() }
            jsonPath("$.user.email") { value("test@example.com") }
        }.andReturn()

        // Login
        val login = LoginRequest(email = "test@example.com", password = "password123")
        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(login)
        }.andExpect {
            status { isOk() }
            jsonPath("$.tokens.accessToken") { exists() }
        }
    }

    @Test
    fun `should reject invalid credentials`() {
        val login = LoginRequest(email = "nonexistent@example.com", password = "wrongpass")
        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(login)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `should reject duplicate email registration`() {
        val register = RegisterRequest(email = "dup@example.com", password = "password123")
        val json = objectMapper.writeValueAsString(register)

        mockMvc.post("/api/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect { status { isCreated() } }

        mockMvc.post("/api/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = json
        }.andExpect { status { isBadRequest() } }
    }
}

