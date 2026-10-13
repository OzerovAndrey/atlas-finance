import { AppShell } from "./features/shell/AppShell";
import { AccountsPage } from "./features/accounts/AccountsPage";
import { TransactionsPage } from "./features/transactions/TransactionsPage";
import { OverviewPage } from "./features/overview/OverviewPage";
import { ROUTES, useRoute } from "./lib/router";
import { ThemeProvider } from "./lib/theme";

function Page({ route }: { route: (typeof ROUTES)[number]["path"] }) {
  if (route === "/overview") return <OverviewPage />;
  if (route === "/accounts") return <AccountsPage />;
  if (route === "/transactions") return <TransactionsPage />;
  return (
    <p className="muted ts-body-md-regular">
      This screen is built next. Layouts are ready in Figma.
    </p>
  );
}

export function App() {
  const route = useRoute();
  const title = ROUTES.find((r) => r.path === route)?.label ?? "Overview";
  return (
    <ThemeProvider>
      <AppShell route={route} title={title}>
        <Page route={route} />
      </AppShell>
    </ThemeProvider>
  );
}
