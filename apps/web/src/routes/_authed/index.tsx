import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/modules/global-layout/page-layout";

export const Route = createFileRoute("/_authed/")({
  component: App,
});

function App() {
  return (
    <Page breadcrumbs={[{ label: "Home", href: "/" }]}>
      <div>Habits</div>
    </Page>
  );
}
