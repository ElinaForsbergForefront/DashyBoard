import { GlassCard } from '../ui/glass-card';


////detta är ett exempel på hur man skriver en formulär-widget och du ser den i glass-test sidan, alltså http://localhost:5173/glass-test
//TODO: Ta bort denna widget när vi är klara med att testa och implementera glass-komponenten i riktiga widgets och formulär.
export function GlassFormTest() {
  return (
    <GlassCard className="glass-form w-full max-w-md">
      <form className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-foreground">Sign in</h3>
          <p className="text-small text-foreground-secondary">
            Test av glass-komponenten för formulär
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-small text-foreground-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-placeholder outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-small text-foreground-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-placeholder outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-primary px-4 py-3 text-on-primary"
        >
          Continue
        </button>
      </form>
    </GlassCard>
  );
}