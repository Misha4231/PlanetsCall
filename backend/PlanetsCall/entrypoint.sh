#!/bin/bash
set -e  # Exit on any error

echo "Waiting for PostgreSQL to be ready"
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  sleep 2
done

SQL_FILE="/data/world.sql"
SQL_URL="https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/psql/world.sql"

if [ -f "$SQL_FILE" ];
then
echo "$SQL_FILE exist"
else
echo "$SQL_FILE not exist"
echo "Downloading SQL file from $SQL_URL ..."
curl -o "$SQL_FILE" "$SQL_URL"
fi

# Check if the 'cities' table already contains data
TABLE_EXISTS=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cities');")

if [ !$TABLE_EXISTS ]; then
  echo "'cities' table exists."
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
exec dotnet PlanetsCall.dll