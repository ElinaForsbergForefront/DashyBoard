# DashyBoard Frontend

Modern dashboard application built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Auth0** - Authentication and authorization
- **ESLint + Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── app/          # Root-level wiring layer (e.g, Global poviders, Error boundaries, App-level context)
│   ├── api/          # API service layer
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route-level page components
│   ├── utils/        # Helper functions and utilities
│   ├── App.tsx       # Root component
│   └── main.tsx      # Application entry point
├── public/           # Static assets
└── index.html        # HTML template
```

### Folder Descriptions

#### `components/`

Reusable UI components that can be used across multiple pages. Organize by feature or atomic design principles.

**Naming Convention:** PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)

**Example structure:**

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

#### `pages/`

Route-level components that represent full pages. Each page component corresponds to a route defined in `router/router.tsx`.

**Naming Convention:** PascalCase (e.g., `Dashboard.tsx`, `Profile.tsx`)

**Example structure:**

```
pages/
├── Dashboard.tsx
├── Login.tsx
├── Profile.tsx
└── Settings.tsx
```

#### `hooks/`

Custom React hooks for reusable stateful logic.

**Naming Convention:** camelCase with `use` prefix (e.g., `useAuth.ts`, `useApi.ts`)

**Example structure:**

```
hooks/
├── useAuth.ts       # Auth0 wrapper hooks
├── useApi.ts        # Data fetching hooks
└── useLocalStorage.ts
```

## Environment Variables

Make a copy of `.env.example` and rename the copy to `.env.development` and fill in the variables

> [!WARNING]
> **DO NOT PUT ANY REAL DATA IN THE `.env.example` FILE!**
>
> The `.env.example` file is committed to version control and should only contain placeholder values or variable names as examples.

| Variable               | Description                   | Example                      |
| ---------------------- | ----------------------------- | ---------------------------- |
| `VITE_AUTH0_DOMAIN`    | Auth0 tenant domain           | `your-app.auth0.com`         |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID   | `abc123...`                  |
| `VITE_AUTH0_AUDIENCE`  | Auth0 API audience identifier | `https://api.dashyboard.com` |
| `VITE_API_URL`         | Backend API base URL          | `http://localhost:5000`      |

**Note:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router v7 Documentation](https://reactrouter.com/)
- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [TypeScript Documentation](https://www.typescriptlang.org/)
