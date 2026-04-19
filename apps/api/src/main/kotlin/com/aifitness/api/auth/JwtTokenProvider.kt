package com.aifitness.api.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.access-token-expiry-ms}") private val accessTokenExpiry: Long,
    @Value("\${app.jwt.refresh-token-expiry-ms}") private val refreshTokenExpiry: Long,
) {
    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateAccessToken(userId: String, email: String, role: String): String =
        buildToken(userId, email, role, accessTokenExpiry)

    fun generateRefreshToken(userId: String, email: String, role: String): String =
        buildToken(userId, email, role, refreshTokenExpiry)

    private fun buildToken(userId: String, email: String, role: String, expiry: Long): String =
        Jwts.builder()
            .subject(userId)
            .claim("email", email)
            .claim("role", role)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiry))
            .signWith(signingKey)
            .compact()

    fun validateToken(token: String): Boolean = runCatching { getClaims(token); true }.getOrDefault(false)

    fun getUserIdFromToken(token: String): String = getClaims(token).subject

    fun getEmailFromToken(token: String): String = getClaims(token)["email"] as String

    fun getRoleFromToken(token: String): String = getClaims(token)["role"] as String

    private fun getClaims(token: String): Claims =
        Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).payload
}

