import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/")({
  component: App,
  pendingComponent: () => <div>Loading...</div>,
});

function App() {
  return <div></div>;
}
