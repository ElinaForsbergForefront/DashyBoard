# MongoDB Konfiguration

## Lokal utveckling

### 1. Navigera till API-projektet

`cd DashyBoard.Api`

### 2. Initiera User Secrets

`dotnet user-secrets init`

### 3. Lägg till MongoDB-connectionstring

**Viktigt:** Fråga efter lösenordet! Skriv INTE in lösenordet i Git.

```bash
dotnet user-secrets set "MongoDB:ConnectionString" "mongodb+srv://[ANVÄNDARNAMN]:[LÖSENORD]@cluster0.koedv9k.mongodb.net/"
dotnet user-secrets set "MongoDB:DatabaseName" "DashyBoard"
```

Ersätt `[ANVÄNDARNAMN]` och `[LÖSENORD]` med det faktiska användarnamn och lösenordet du fått.

### 4. Verifiera att det fungerar

```bash
dotnet user-secrets list
```

Du ska se något liknande:

```
MongoDB:ConnectionString = mongodb+srv://...
MongoDB:DatabaseName = DashyBoard
```

### 5. Kör projektet

```bash
dotnet run
```

Om MongoDB-anslutning fungerar startar projektet utan fel.
