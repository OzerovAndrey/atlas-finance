import { AppShell } from "./features/shell/AppShell";
import { AccountsPage } from "./features/accounts/AccountsPage";
import { TransactionsPage } from "./features/transactions/TransactionsPage";
import { OverviewPage } from "./features/overview/OverviewPage";
import { ROUTES, useRoute } from "./lib/router";
import { DemoProvider } from "./data/store";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { CardsPage } from "./features/cards/CardsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { TransferPage } from "./features/transfers/TransferPage";
import { ThemeProvider } from "./lib/theme";

function Page({ route }: { route: (typeof ROUTES)[number]["path"] }) {
  if (route === "/overview") return <OverviewPage />;
  if (route === "/accounts") return <AccountsPage />;
  if (route === "/transactions") return <TransactionsPage />;
  if (route === "/transfers") return <TransferPage />;
  if (route === "/cards") return <CardsPage />;
  if (route === "/analytics") return <AnalyticsPage />;
  if (route === "/settings") return <SettingsPage />;
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
      <DemoProvider>
        <AppShell route={route} title={title}>
          <Page route={route} />
        </AppShell>
      </DemoProvider>
    </ThemeProvider>
  );
}
