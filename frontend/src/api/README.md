# API-lager – Guide för endpoints

Detta lager hanterar all kommunikation med backend via **RTK Query**.  
Auth0-token inkluderas automatiskt i varje anrop – du behöver aldrig hantera tokens manuellt.

---

# Mappstruktur

```
src/api/
├── types/                # TypeScript-interface som speglar backend-DTOs
├── endpoints/            # RTK Query-endpoints grupperade per domän
├── apiSlice.ts           # Rot-konfiguration för RTK Query (rör sällan)
├── BaseQuery.ts          # Bas-konfiguration med automatisk auth-token
└── AuthTokenInjector.tsx # Brygga mellan Auth0 och RTK Query
```

---

# Lägga till en ny domän – steg för steg

## 1. Skapa typer i `types/`

Skapa en fil `types/minDomän.ts` som matchar backend-svaret:

```typescript
export interface MinDtoTyp {
  id: string;
  namn: string | null;
}
```

---

## 2. Skapa endpoints i `endpoints/`

Skapa en fil `endpoints/minDomän.ts`:

```typescript
import { api } from '../apiSlice';
import type { MinDtoTyp } from '../types/minDomän';

const minDomänApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET-anrop (query)
    getMinResurs: builder.query<MinDtoTyp, string>({
      query: (id) => `/MinDomän/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MinDomän', id }],
    }),

    // POST/PUT/DELETE-anrop (mutation)
    uppdateraMinResurs: builder.mutation<MinDtoTyp, { id: string; namn: string }>({
      query: ({ id, ...body }) => ({
        url: `/MinDomän/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'MinDomän', id }],
    }),
  }),
});

export const { useGetMinResursQuery, useUppdateraMinResursMutation } = minDomänApi;
```

---

## 3. Registrera tag-typen i `apiSlice.ts`

Lägg till domänen i `tagTypes`:

```typescript
tagTypes: ['User', 'Gold', 'WorldTime', 'MinDomän'];
```

---

# Använda hooks i komponenter

```typescript
import { useGetMinResursQuery, useUppdateraMinResursMutation } from '../api/endpoints/minDomän';

const MinKomponent = () => {
  // Query – hämtar data automatiskt
  const { data, isLoading, error } = useGetMinResursQuery('mitt-id');

  // Mutation – anropas manuellt
  const [uppdatera] = useUppdateraMinResursMutation();

  const hanteraSpara = async () => {
    await uppdatera({ id: 'mitt-id', namn: 'Nytt namn' }).unwrap();
  };
};
```

---

# Viktiga koncept

| Koncept         |                                           Förklaring                                           |
| --------------- | :--------------------------------------------------------------------------------------------: |
| providesTags    |                            Märker cachad data – används på queries                             |
| invalidatesTags |                    Rensar cache efter mutation → triggar automatisk refetch                    |
| skip            |   Förhindrar anrop tills ett villkor uppfylls: useGetXQuery(arg, { skip: !isAuthenticated })   |
| .unwrap()       |              Kastar fel vid misslyckad mutation, istället för att svälja dem tyst              |
| -------------   | :--------------------------------------------------------------------------------------------: |
