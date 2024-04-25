"use client"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/server/client";
import Image from "next/image";
import { json } from "stream/consumers";


export default function SpellbookPage({
	params }:
	{ 
		params: { spellbook: number };
	}) {
	const spellbook = trpc.spellbooks.getById.useQuery({
		id: +params.spellbook,
	})
	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-24">
			<Table>
				<TableCaption>Spells from {spellbook.data?.title}.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Image</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{spellbook.data?.spells.map((spell) => (
						<TableRow key={spell.id}>
							<TableCell>{spell.title}</TableCell>
							<TableCell>{spell.description}</TableCell>
							<TableCell>
								{spell.image && (
									<Image src={spell.image} width={50} height={50} alt={spell.title} />
								)}
							</TableCell>
							<TableCell><Button>Delete</Button></TableCell>
						</TableRow>
					))}
					
				</TableBody>
			</Table>
		</div>
	);
}