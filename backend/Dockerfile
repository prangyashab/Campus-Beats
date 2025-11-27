FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /build

# Copy Maven files and source
COPY pom.xml ./
COPY src ./src

# Build the application (skip tests for CI speed)
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
