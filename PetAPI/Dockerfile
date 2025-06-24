# Multi-stage build: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["PetAPI.csproj", "./"]
RUN dotnet restore "PetAPI.csproj"

# Copy all source code
COPY . .

# Build and publish the application
RUN dotnet build "PetAPI.csproj" -c Release -o /app/build
RUN dotnet publish "PetAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Multi-stage build: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published application from build stage
COPY --from=build /app/publish .

# Expose port 8080
EXPOSE 8080

# Set environment variable for port
ENV ASPNETCORE_URLS=http://+:8080

# Set entry point
ENTRYPOINT ["dotnet", "PetAPI.dll"] 