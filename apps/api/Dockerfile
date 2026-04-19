# Build stage
FROM gradle:8-jdk21 AS builder
WORKDIR /app
COPY apps/api/build.gradle.kts apps/api/settings.gradle.kts ./
RUN gradle dependencies --no-daemon 2>/dev/null || true
COPY apps/api/src ./src
RUN gradle bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=production", "app.jar"]

