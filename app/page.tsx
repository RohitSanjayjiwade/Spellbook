"use client"

import { trpc } from "@/server/client";

export default function Home() {

  const spells = trpc.spells.get.useQuery();

  return (
    <main className="flex flex-col items-center justify-between p-24">
      {JSON.stringify(spells.data)}
    </main>
  );
}
