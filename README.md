# Planets Call

## Linki dla Pana Kleina
- **Opis projektu**: [google dysk](https://drive.google.com/drive/folders/1WGLecc5QaRtHFz-dAEhdEfy6voCcCo1-?usp=sharing)
- **Design strony**: [Figma](https://www.figma.com/design/IfSCTVFqL1G8eWHvPDkjxc/Planet's-call?node-id=0-1&t=3FIRcBGiThk3vFtZ-1)

> Ania pracuje głównie na branchu `frontend_develop`, Ja (Mykhailo) robię dla różnych controllerów osobny branch

## Kroki do uruchomienia backendu projektu

### Krok 1: Zainstaluj PostgreSQL
- **Dla Windows**: pobierz [PgAdmin4](https://www.pgadmin.org/download/pgadmin-4-windows/)
- **Dla Linux**: pobierz PostgreSQL z [oficjalnej strony](https://www.postgresql.org/download/linux/)

### Krok 2: Utwórz bazę danych
Utwórz nową bazę danych o nazwie `planets_call`.

### Krok 3: Skonfiguruj ConnectionString
1. Otwórz plik `backend/PlanetsCall/PlanetsCall/appsettings.Development.json`
2. Znajdź linię:
   ```json
   "PostgresConnection": "connection string tutaj"
   ```
3. Wpisz swój ciąg połączenia, aby wyglądał następująco:
   ```
   host=localhost;port=5432;database=planets_call;username=<nazwa użytkownika, który utworzył bazę danych>;password=<hasło użytkownika, który utworzył bazę danych>
   ```

> **UWAGA:** Nie commituj prawdziwego hasła do repozytorium!

### Krok 4: Zaktualizuj bazę danych
Przejdź do katalogu `backend/PlanetsCall` i uruchom następującą komendę:
```bash
dotnet ef database update -p Data -s PlanetsCall
```
Ta komenda utworzy wszystkie tabele w bazie danych.

### Krok 5: Zaimportuj dane z pliku [world.sql](https://github.com/dr5hn/countries-states-cities-database/blob/master/psql/world.sql)
1. Po dodaniu folderu bin PostgreSQL do zmiennych środowiskowych, przejdź do katalogu, w którym znajduje się plik `world.sql`.
2. Wykonaj poniższą komendę:
   ```bash
   psql -U postgres -d planets_call -f world.sql
   ```

### Krok 6: Otwórz backend/PlanetsCall/PlanetsCall.sln za pomocą Visual Studio lub innego IDE
### Krok 7: Uruchom projekt:
- **Dla Visual Studio**: Po prostu kliknij na `Run`
- **Za pomocą terminalu**: wpisz komende `dotnet run --project PlanetsCall`