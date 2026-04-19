package com.aifitness.api.subscription

import com.aifitness.api.user.User
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.OffsetDateTime
import java.util.UUID

enum class SubscriptionPlan { FREE, MONTHLY, YEARLY }
enum class SubscriptionStatus { active, canceled, past_due, trialing }

@Entity
@Table(name = "subscriptions")
class Subscription(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,

    @Column(name = "stripe_customer_id")
    var stripeCustomerId: String? = null,

    @Column(name = "stripe_subscription_id")
    var stripeSubscriptionId: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @org.hibernate.annotations.JdbcType(org.hibernate.type.descriptor.jdbc.VarcharJdbcType::class)
    var plan: SubscriptionPlan = SubscriptionPlan.FREE,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @org.hibernate.annotations.JdbcType(org.hibernate.type.descriptor.jdbc.VarcharJdbcType::class)
    var status: SubscriptionStatus = SubscriptionStatus.active,

    @Column(name = "current_period_end")
    var currentPeriodEnd: OffsetDateTime? = null,

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
)

