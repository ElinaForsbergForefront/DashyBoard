# DashyBoard Frontend

Modern dashboard-applikation byggd med React, TypeScript och Vite.

## Teknikstack

- **React 19** – UI-bibliotek  
- **TypeScript** – Typsäkerhet  
- **Vite** – Byggverktyg och utvecklingsserver  
- **React Router v7** – Routing på klientsidan  
- **Auth0** – Autentisering och auktorisering  
- **ESLint + Prettier** – Kodkvalitet och formatering  

## Kom igång

### Förkunskaper

- Node.js 18+ och npm  

### Installation

1. Klona repot och navigera till frontend-katalogen:

```bash
cd frontend
```

2. Installera beroenden:

```bash
npm install
```

3. Starta utvecklingsservern:

```bash
npm run dev
```

Applikationen kommer att vara tillgänglig på `http://localhost:5173`

## Projektstruktur

```
frontend/
├── src/
│   ├── app/          # Root-nivåns kopplingslager (t.ex. globala providers, error boundaries, app-nivåns context)
│   ├── api/          # API-tjänstelager
│   ├── components/   # Återanvändbara UI-komponenter
│   ├── hooks/        # Anpassade React-hooks
│   ├── pages/        # Sidor på routenivå
│   ├── utils/        # Hjälpfunktioner och verktyg
│   ├── App.tsx       # Rotkomponent
│   └── main.tsx      # Applikationens startpunkt
├── public/           # Statiska resurser
└── index.html        # HTML-mall
```

## Mappbeskrivningar

### `components/`

Återanvändbara UI-komponenter som kan användas på flera sidor. Organisera efter funktion eller enligt principer för atomär design.

**Namngivningskonvention:** PascalCase (t.ex. `Button.tsx`, `UserCard.tsx`)

**Exempelstruktur:**

```
components/
├── common/
│   ├── Button.tsx
│   └── Input.tsx
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
└── dashboard/
    ├── Widget.tsx
    └── Chart.tsx
```

### `pages/`

Komponenter på routenivå som representerar hela sidor. Varje sidkomponent motsvarar en route definierad i `router/router.tsx`.

**Namngivningskonvention:** PascalCase (t.ex. `Dashboard.tsx`, `Profile.tsx`)

**Exempelstruktur:**

```
pages/
├── Dashboard.tsx
├── Login.tsx
├── Profile.tsx
└── Settings.tsx
```

### `hooks/`

Anpassade React-hooks för återanvändbar statefull logik.

**Namngivningskonvention:** camelCase med prefixet `use` (t.ex. `useAuth.ts`, `useApi.ts`)

**Exempelstruktur:**

```
hooks/
├── useAuth.ts       # Auth0-wrapper hooks
├── useApi.ts        # Datahämtnings-hooks
└── useLocalStorage.ts
```

## Miljövariabler

Gör en kopia av `.env.example` och döp om kopian till `.env.development` och fyll i variablerna.

> [!WARNING]
> **LÄGG INTE IN NÅGRA RIKTIGA UPPGIFTER I `.env.example`-FILEN!**
>
> `.env.example`-filen är versionshanterad och ska endast innehålla platshållarvärden eller variabelnamn som exempel.

| Variabel               | Beskrivning                         | Exempel                      |
| ---------------------- | ----------------------------------- | ---------------------------- |
| `VITE_AUTH0_DOMAIN`    | Auth0 tenant-domän                  | `your-app.auth0.com`         |
| `VITE_AUTH0_CLIENT_ID` | Auth0-applikationens klient-ID      | `abc123...`                  |
| `VITE_AUTH0_AUDIENCE`  | Auth0 API audience-identifierare    | `https://api.dashyboard.com` |
| `VITE_API_URL`         | Backend-API:ns bas-URL              | `http://localhost:5000`      |

**Obs:** Vite kräver att miljövariabler prefixas med `VITE_` för att exponeras till klienten.

## Ytterligare resurser

- [React-dokumentation](https://react.dev/)
- [Vite-dokumentation](https://vitejs.dev/)
- [React Router v7-dokumentation](https://reactrouter.com/)
- [Auth0 React SDK-dokumentation](https://auth0.com/docs/libraries/auth0-react)
- [TypeScript-dokumentation](https://www.typescriptlang.org/)
