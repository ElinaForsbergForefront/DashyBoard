# -----------------------------
# Build stage
# -----------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files first (for faster restore)
COPY DashyBoard.Api/DashyBoard.Api.csproj DashyBoard.Api/
COPY DashyBoard.Application/DashyBoard.Application.csproj DashyBoard.Application/
COPY DashyBoard.Domain/DashyBoard.Domain.csproj DashyBoard.Domain/
COPY DashyBoard.Infrastructure/DashyBoard.Infrastructure.csproj DashyBoard.Infrastructure/

RUN dotnet restore DashyBoard.Api/DashyBoard.Api.csproj

# Copy all source files
COPY . .

# Publish the application
WORKDIR /src/DashyBoard.Api
RUN dotnet publish DashyBoard.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# -----------------------------
# Runtime stage
# -----------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Copy published app from build stage
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "DashyBoard.Api.dll"]
