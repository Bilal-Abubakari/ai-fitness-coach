package com.aifitness.api.subscription

import com.aifitness.api.user.UserRepository
import com.stripe.Stripe
import com.stripe.model.checkout.Session
import com.stripe.model.billingportal.Session as PortalSession
import com.stripe.param.checkout.SessionCreateParams
import com.stripe.param.billingportal.SessionCreateParams as PortalSessionCreateParams
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.UUID

@Service
class SubscriptionService(
    private val subscriptionRepository: SubscriptionRepository,
    private val userRepository: UserRepository,
    @Value("\${app.stripe.secret-key}") private val stripeSecretKey: String,
    @Value("\${app.stripe.monthly-price-id}") private val monthlyPriceId: String,
    @Value("\${app.stripe.yearly-price-id}") private val yearlyPriceId: String,
) {
    @PostConstruct
    fun init() {
        Stripe.apiKey = stripeSecretKey
    }

    fun createCheckoutSession(userId: String, plan: String, successUrl: String, cancelUrl: String): String {
        val user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow { NoSuchElementException("User not found") }

        val priceId = when (plan) {
            "MONTHLY" -> monthlyPriceId
            "YEARLY" -> yearlyPriceId
            else -> throw IllegalArgumentException("Invalid plan: $plan")
        }

        val params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setCustomerEmail(user.email)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice(priceId)
                    .setQuantity(1)
                    .build()
            )
            .setSuccessUrl("$successUrl?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl(cancelUrl)
            .putMetadata("userId", userId)
            .putMetadata("plan", plan)
            .build()

        val session = Session.create(params)
        return session.url
    }

    fun createPortalSession(userId: String, returnUrl: String): String {
        val subscription = subscriptionRepository.findByUserId(UUID.fromString(userId))
            .orElseThrow { NoSuchElementException("No subscription found") }

        val params = PortalSessionCreateParams.builder()
            .setCustomer(subscription.stripeCustomerId)
            .setReturnUrl(returnUrl)
            .build()

        return PortalSession.create(params).url
    }

    fun handleWebhook(stripeSubscriptionId: String, status: String, plan: String?, periodEnd: Long?) {
        val subscription = subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId)
            .orElse(null) ?: return

        subscription.status = SubscriptionStatus.valueOf(status.replace(".", "_"))
        plan?.let { subscription.plan = SubscriptionPlan.valueOf(it) }
        periodEnd?.let {
            subscription.currentPeriodEnd = OffsetDateTime.ofInstant(Instant.ofEpochSecond(it), ZoneOffset.UTC)
        }

        subscriptionRepository.save(subscription)
    }

    fun getStatus(userId: String): SubscriptionDto {
        val sub = subscriptionRepository.findByUserId(UUID.fromString(userId))
            .orElse(null) ?: return SubscriptionDto(plan = "FREE", status = "active", currentPeriodEnd = null)
        return sub.toDto()
    }
}

data class SubscriptionDto(
    val plan: String,
    val status: String,
    val currentPeriodEnd: OffsetDateTime?,
    val stripeCustomerId: String? = null,
)

fun Subscription.toDto() = SubscriptionDto(
    plan = plan.name,
    status = status.name,
    currentPeriodEnd = currentPeriodEnd,
    stripeCustomerId = stripeCustomerId,
)

