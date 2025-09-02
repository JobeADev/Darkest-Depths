import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bossBattle")({
  component: BossBattle,
});

function BossBattle() {
  return <div>Hello "/bossBattle"!</div>;
}
