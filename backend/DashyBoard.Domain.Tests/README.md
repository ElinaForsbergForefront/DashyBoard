# DashyBoard.Domain.Tests

Detta projekt innehåller **Domain-tester** (entities, value objects, affärsregler/invariants).
Testerna skrivs **test-first** och fokuserar på att skydda systemets kärna – det som ska vara sant oavsett UI, databas eller externa API:er.

Målet är att testerna ska vara lätta att läsa, lätta att förstå och fungera som dokumentation för vilka regler som gäller i DashyBoard-domänen.

---

## Syfte
- Vi jobbar test-first för att få tydliga regler och förväntningar innan implementation.
- Domain-tester gör att vi kan förändra systemet tryggt utan att råka bryta affärslogik.
- En gemensam namn- och strukturstandard gör det enkelt att:
  - förstå vilken regel som bröts när ett test failar
  - se exakt vilken invariant som inte längre håller
  - våga refaktorera domänmodellen

---

## Namngivning och struktur
Vi namnger tester utifrån **regler/invariants i domänen**, inte tekniska detaljer.

Namnen ska göra det enkelt att:
- förstå vilken regel som testas
- direkt se varför testet misslyckas
- använda testerna som dokumentation av domänens “sanningar”

---

## Fil och mappstruktur
Strukturen speglar domänens områden (t.ex. Dashboards, Users, Social, Widgets).

**Exempelvis:**
Dashboards/
- DashboardTests.cs
- Dashboards – domänområde
- DashboardTests – tester för entityn Dashboard och dess regler

**Används när vi vill testa regler som:**
- en dashboard måste ha en ägare
- widgets får inte vara duplicerade
- widget-konfiguration måste vara giltig

**Annat exempel:**
Users/
EmailTests.cs
- Users – domänområde
- EmailTests – tester för value objectet Email

**Används när vi vill testa regler som:**
- en email måste vara i korrekt format
- en email kan inte vara null eller tom

---

## Testmetoder
Varje testmetod beskriver vilken regel som gäller och vilket utfall vi förväntar oss.

**Format:** Method_StateUnderTest_ExpectedBehavior

**Exempel:**
- AddWidget_WhenWidgetAlreadyExists_Throws
- Create_WithInvalidEmail_Throws

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

- Testerna beskriver regler/invariants, inte implementation
- Inga externa beroenden (ingen DB, HTTP, API:er)
- Ingen mocking i Domain-tester
- En test = en tydlig regel
- Namngivningen är viktigare än korthet
- När ett test failar ska man förstå vilken affärsregel som bröts utan att läsa koden

