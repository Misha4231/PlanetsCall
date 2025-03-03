FROM mcr.microsoft.com/dotnet/sdk:8.0 AS runtime
WORKDIR /app

# copy the solution file
COPY *.sln .

# copy all project files
COPY Core/*.csproj ./Core/
COPY Data/*.csproj ./Data/
COPY PlanetsCall/*.csproj ./PlanetsCall/

# restore dependencies
RUN dotnet restore

# copy an entire source code
COPY Core/. ./Core/
COPY Data/. ./Data/
COPY PlanetsCall/. ./PlanetsCall/

# install neccessary packages for entrypoint.sh
RUN apt-get update && apt-get install -y postgresql-client && apt-get install -y curl

# Run migrations
RUN dotnet publish -c Debug -o PlanetsCall/out

# Copy entrypoint script
COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
