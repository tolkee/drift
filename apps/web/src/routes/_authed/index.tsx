import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/modules/global-layout/page-layout";

export const Route = createFileRoute("/_authed/")({
  component: App,
});

function App() {
  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }]}>
      <div>Habits</div>
    </PageLayout>
  );
}
