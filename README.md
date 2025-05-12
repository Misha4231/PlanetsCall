# Planets Call

## Linki dla Pana Kleina
- **Opis projektu + Grafiki**: [google dysk](https://drive.google.com/drive/folders/1WGLecc5QaRtHFz-dAEhdEfy6voCcCo1-?usp=sharing)
- **Design strony**: [Figma](https://www.figma.com/design/IfSCTVFqL1G8eWHvPDkjxc/Planet's-call?node-id=0-1&t=3FIRcBGiThk3vFtZ-1)

> Ania pracuje głównie na branchu `frontend_develop`, Ja (Mykhailo) robię dla różnych controllerów osobny branch

## Kroki do uruchomienia backendu projektu

### Krok 1: Pobierz Docker
- **Dla Windows**: pobierz [Docker](https://docs.docker.com/desktop/setup/install/windows-install/)
- **Dla Linux**: pobierz [Docker](https://docs.docker.com/desktop/setup/install/linux/)

### Krok 2: Uruchom
Znajdując się w katalogu głównym (tam gdzie leży `docker-compose.yml`) wpisz komendę
```bash
docker compose up --build -d
```
!!!UWAGA!!! - pierwsze uruchomienie zajmie trochę czasu ze względu na to, że pobierają się  postgreSQL, Redis, itp. oraz 
baza danych `world.sql` jest importowana.
`Kolejne uruchomienia będą znacznie szybsze`

### Jak korzystać?
- API używa port 8080 (http://localhost:8080)
- Aplikacja zawsze posiada administratora (is_admin=true) dane do logowania się znaudują w `.env.db`
### Jak wyłączyć?
```bash
docker compose down
```
lub
```bash
docker compose down -v
```
druga komenda usuwa volumes (czyli wszystkie dane wewnątrz)

!!!UWAGA!!! jeśli projekt jest hostowany w systemie Windows i wyskakuje błąd 
`no file or directory entrypoint.sh`
problem wynika z tego powodu, że git dodaje Windowsowskie zakończenie linii(`CR` `LF`) w plikach 
nawet gzie jest to niedopuszczalne (np. jak w bash script). Da się to naprawić za pomocą `dos2unix`
