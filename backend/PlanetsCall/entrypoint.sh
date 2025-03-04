#!/bin/bash
set -e  # Exit on any error

echo "Waiting for PostgreSQL to be ready"
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  sleep 2
done

export RUNNING_MIGRATIONS=true # flag for DatabasePrepare.cs

echo "installing ef core"
dotnet tool install --global dotnet-ef
export PATH="$PATH:/root/.dotnet/tools"

echo "Applying migrations"
dotnet-ef database update --project Data --startup-project PlanetsCall --connection "host=$POSTGRES_HOST;port=$POSTGRES_PORT;database=$POSTGRES_DB;username=$POSTGRES_USER;password=$POSTGRES_PASSWORD"
echo "Migrations applied"

export RUNNING_MIGRATIONS=false

SQL_FILE="/data/world.sql" # database with cities, countries, etc.
SQL_URL="https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/psql/world.sql"

#download world database
if [ -f "$SQL_FILE" ];
then
echo "$SQL_FILE exist"
else
echo "$SQL_FILE not exist"
echo "Downloading SQL file from $SQL_URL ..."
curl -o "$SQL_FILE" "$SQL_URL"
fi

# Check if the 'cities' table already exist
TABLE_EXISTS=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cities');" | tr -d '[:space:]')
if [ "$TABLE_EXISTS" = "f" ]; then
  echo "'cities' table not exists."
  # Import the SQL file into the database
  PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f "$SQL_FILE"
  echo "Database imported successfully!"
else
  echo "Checking if 'cities' table has data..."
  TABLE_DATA=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT COUNT(*) FROM cities;")

  if [ "$TABLE_DATA" -gt 0 ]; then
    echo "The 'cities' table already contains data. Skipping import."
  else
    echo "The 'cities' table is empty. Importing data..."
    # Import the SQL file into the database
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f "$SQL_FILE"
    echo "Database imported successfully!"
  fi
fi

# Start API
echo "Starting API..."
exec dotnet PlanetsCall/out/PlanetsCall.dll