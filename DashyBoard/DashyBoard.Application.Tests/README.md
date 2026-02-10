# DashyBoard.Application.Tests

Detta projekt innehåller **Application-tester** (use cases, CQRS).
Testerna skrivs **test-first** och följer ett **BDD / scenario-baserat** namngivningssätt.

Målet är att testerna ska vara lätta att läsa, lätta att förstå och fungera som dokumentation för hur systemet är tänkt att bete sig.

---

## Syfte
- Vi jobbar test-first för att tydliggöra krav och förväntat beteende innan implementation.
- En gemensam namn- och strukturstandard gör det enkelt att:
  - förstå vad som är trasigt när ett test failar
  - se var i flödet felet uppstår
  - våga ändra kod utan rädsla

---

## Namngivning och struktur
Vi namnger tester utifrån **vad som händer i systemet**, inte hur det är implementerat.

Namnen ska göra det enkelt att:
- förstå syftet med testet
- direkt se orsaken när ett test misslyckas

---

## Fil och mappstruktur
Varje **use case** får sin egen mapp och testklass.

Exempelvis:
Locations/
  GetSelectedLocation/
    WhenGetSelectedLocationQueryIsHandled.cs

- **GetSelectedLocation** – vilket use case
- **WhenGetSelectedLocationQueryIsHandled** – när detta sker

**Används när användaren:**
- öppnar dashboarden
- behöver veta om en plats redan är vald

Locations/
  ClearSelectedLocation/
    WhenClearSelectedLocationCommandIsExecuted.cs

- **ClearSelectedLocation** – vilket use case
- **WhenClearSelectedLocationCommandIsExecuted** – när detta sker

**Används när användaren:**
- tar bort sin plats
- återställer dashboarden


## Klassnamn 
Varje testmetod beskriver vad vi förväntar oss ska hända.
**Format:** Then_<ExpectedOutcome>

**Exempel:**
- Then_Returns_Null_When_User_Has_No_Selected_Location
- Then_Returns_Location_When_User_Has_Selected_Location

---

## Arrange / Act / Assert (AAA)
Vi följer mönstret Arrange – Act – Assert:

- **Arrange** 
  Sätt upp testdata och beroenden (ofta i SetUp)

- **Act**
  Kör command/query som testas

- **Assert**
  Verifiera resultatet

---

## Riktlinje
- En testklass = ett scenario
- Testerna beskriver beteende, inte implementation
- Namngivningen är viktigare än korthet
- När ett test failar ska man förstå varför utan att läsa koden