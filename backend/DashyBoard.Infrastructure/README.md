# Infrastructure – Lathund för Entity Framework Core

---
## 📋 Migrations

Stå i **backend-mappen** och kör följande kommandon i terminalen.

### Skapa en ny migration

dotnet ef migrations add NamnetPåDinMigration --project DashyBoard.Infrastructure --startup-project DashyBoard.Api

### Applicera migrationen mot databasen

Detta sker via github efter godkänd pr

### Ta bort den senaste migrationen (som EJ applicerats mot databasen)

dotnet ef migrations remove --project DashyBoard.Infrastructure --startup-project DashyBoard.Api --force

> `--force` gör att vi skiter i om du är kopplad mot databasen eller ej.
> 
> ⚠️ I dagsläget funkar bara `remove` om vi **inte** uppdaterat databasen, men i de flesta fall är det lugnt eftersom uppdateringen sker efter kodgranskning av andra medlemmar.

---

## 🏗️ Skapa en ny modell

Modeller läggs i **DashyBoard.Domain/Models/**.

Följ det här mönstret (se `User.cs` som exempel):

- `Id` ska alltid vara en `Guid` och sättas med `Guid.NewGuid()` i konstruktorn
- Alla properties ska ha `private set` för att skydda mot oönskade ändringar utifrån
- En privat tom konstruktor `private Model() { }` krävs av EF Core
- Nullable properties (`string?`) används för valfria fält
- Använd alltid `DateTime.UtcNow` för tidsstämplar

### Exempel
public class MinModell
{
	public Guid Id { get; private set; }
	public string Namn { get; private set; }
	public DateTime Skapad { get; private set; }
	private MinModell() { } // För EF Core
	public MinModell(string namn)
	{
		Id = Guid.NewGuid();
		Namn = namn;
		Skapad = DateTime.UtcNow;
	}
}

---

## ⚙️ Registrera modellen i DbContext

Öppna **DashyBoard.Infrastructure/DashyBoardDbContext.cs** och gör följande:

### 1. Lägg till ett DbSet

public DbSet<MinModell> MinaModeller { get; set; }

### 2. Konfigurera tabellen i OnModelCreating

