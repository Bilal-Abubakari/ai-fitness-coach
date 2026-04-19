package com.aifitness.api.subscription

import com.aifitness.api.auth.JwtPrincipal
import com.stripe.model.Event
import com.stripe.net.Webhook
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
class SubscriptionController(
    private val subscriptionService: SubscriptionService,
    @Value("\${app.stripe.webhook-secret}") private val webhookSecret: String,
    @Value("\${app.cors.allowed-origins}") private val frontendUrl: String,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping("/api/subscriptions/checkout")
    fun createCheckout(
        @AuthenticationPrincipal principal: JwtPrincipal,
        @RequestBody body: CheckoutRequest,
    ): Map<String, String> {
        val url = subscriptionService.createCheckoutSession(
            userId = principal.userId,
            plan = body.plan,
            successUrl = "$frontendUrl/dashboard?checkout=success",
            cancelUrl = "$frontendUrl/subscribe",
        )
        return mapOf("url" to url)
    }

    @PostMapping("/api/subscriptions/portal")
    fun createPortal(@AuthenticationPrincipal principal: JwtPrincipal): Map<String, String> {
        val url = subscriptionService.createPortalSession(
            userId = principal.userId,
            returnUrl = "$frontendUrl/dashboard",
        )
        return mapOf("url" to url)
    }

    @GetMapping("/api/subscriptions/status")
    fun getStatus(@AuthenticationPrincipal principal: JwtPrincipal) =
        subscriptionService.getStatus(principal.userId)

    @PostMapping("/api/webhooks/stripe")
    fun handleStripeWebhook(
        @RequestBody payload: String,
        @RequestHeader("Stripe-Signature") sigHeader: String,
    ): ResponseEntity<String> {
        return try {
            val event = Webhook.constructEvent(payload, sigHeader, webhookSecret)
            processEvent(event)
            ResponseEntity.ok("OK")
        } catch (e: Exception) {
            log.error("Stripe webhook error: ${e.message}", e)
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: ${e.message}")
        }
    }

    private fun processEvent(event: Event) {
        when (event.type) {
            "customer.subscription.updated", "customer.subscription.deleted" -> {
                val stripeObj = event.dataObjectDeserializer.`object`.orElse(null) ?: return
                val sub = stripeObj as? com.stripe.model.Subscription ?: return
                subscriptionService.handleWebhook(
                    stripeSubscriptionId = sub.id,
                    status = sub.status,
                    plan = null,
                    periodEnd = sub.currentPeriodEnd,
                )
                log.info("Handled Stripe event: ${event.type} for subscription ${sub.id}")
            }
            else -> log.debug("Unhandled Stripe event: ${event.type}")
        }
    }
}

data class CheckoutRequest(val plan: String)

