# Etapa 1: compila o backend com Maven e JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Baixa as dependências antes de copiar o código, para aproveitar o cache de camadas
COPY pom.xml .
COPY config ./config
RUN mvn -B -q dependency:go-offline
COPY src ./src
# Os testes rodam no CI; aqui só empacota
RUN mvn -B -q package -DskipTests

# Etapa 2: imagem final só com o JRE 21 e o .jar
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 campusgigs
COPY --from=build /app/target/backend-*.jar app.jar
USER campusgigs
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
