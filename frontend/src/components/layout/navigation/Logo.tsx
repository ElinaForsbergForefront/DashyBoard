export const Logo = () => {
  return (
    <a
      href="/"
      className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
      aria-label="DashyBoard Home"
    >
      <span className="size-4 rounded-sm bg-primary" aria-hidden="true" />
      <span className="hidden sm:inline text-base font-bold text-foreground">DashyBoard</span>
    </a>
  );
};
