"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { trpc } from "@/server/client";


export default function Spellbook() {

  const spellbooks = trpc.spellbooks.get.useQuery();
  
  return (
    <div className="grid grid-cols-4 gap-5">
      {spellbooks.data?.map((spellbook) => (
        <Card key={spellbook.id}>
          <CardHeader>
            <CardTitle>{spellbook.title}</CardTitle>
            <CardDescription>{spellbook.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>spells</p>
          </CardContent>
        </Card>
      ))}
      

    </div>
  );
}