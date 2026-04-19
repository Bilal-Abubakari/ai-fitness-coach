package com.aifitness.api.subscription

import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface SubscriptionRepository : JpaRepository<Subscription, UUID> {
    fun findByUserId(userId: UUID): Optional<Subscription>
    fun findByStripeCustomerId(customerId: String): Optional<Subscription>
    fun findByStripeSubscriptionId(subscriptionId: String): Optional<Subscription>
}

