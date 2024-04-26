"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/server/client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { json } from "stream/consumers";


export default function SpellbookPage({
	params }:
	{ 
		params: { spellbook: number };
	}) {

	const spellbook = trpc.spellbooks.getById.useQuery({
		id: +params.spellbook,
	})

	const addSpell = trpc.spells.create.useMutation({
		onSettled: () => {
			spellbook.refetch();
		}
	});

	const deleteSpell = trpc.spells.delete.useMutation();

	const updateSpell = trpc.spells.update.useMutation({
		onSettled: () => {
			spellbook.refetch();
		}
	});

	const handleEditClick = (spell: any) => {
		setSelectedSpell(spell);
		setTitle2(spell.title);
		setDescription2(spell.description);
	};


	const updateExistingSpell = () => {
		if (!selectedSpell || !title || !description) {
			return;
		}

		updateSpell.mutate({
			id: selectedSpell.id,
			title,
			description
		});

		setTitle2("");
		setDescription2("");
		setSelectedSpell(null); // Clear selected spell after update
	};
	const addNewSpell = () => {
		if (!spellbook.data?.id) {
			return;
		}
		if (fileRef.current?.files) {
			const formData = new FormData();
			const file = fileRef.current?.files[0];
			formData.append("files", file);
			const request = { method: "POST", body: formData };
			fetch("/api/file", request);

			addSpell.mutate({
				title,
				description,
				spellbookId: spellbook.data?.id,
				image: `/${file.name}`,
			});

			setTitle("");
			setDescription("");
		}
		
		
	};

	const delSpell = (id: number) => {
		deleteSpell.mutate({
			id,
		},
			{
				onSettled: () => {
					spellbook.refetch();
				}
			})
	}

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const fileRef = useRef<HTMLInputElement>(null);
	const [selectedSpell, setSelectedSpell] = useState<any>(null); // State to store the selected spell for update
	const [title2, setTitle2] = useState<string>("");
	const [description2, setDescription2] = useState<string>("");

	return (
		<div className="p-24">
		<div className="flex gap-2"><Button className="bg-gray-700 hover:bg-gray-800 text-white rounded "><Link href="/" className="flex gap-2">Return<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 font-bold text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
</Link>
					</Button>


					<Dialog>
				<DialogTrigger asChild>
					<Button className="bg-cyan-700 hover:bg-cyan-800 text-white rounded flex gap-2">Add Spell<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 bg-slate-50 rounded-md text-blue-900">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create your spell</DialogTitle>
						<DialogDescription>
							Add some powerful spell to your {spellbook.data?.title}
						</DialogDescription>
						<div className="flex flex-col gap-3">
							<p>Title:</p>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
							<p>Description:</p>
							<Input value={description} onChange={(e) => setDescription(e.target.value)} />
							<p>Image:</p>
							<Input type="file" ref={fileRef} />
							<Button className="text-white" onClick={addNewSpell}>Save</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
					</div>
			

			<Table className="mt-3">
				<TableCaption>Spells from {spellbook.data?.title}.</TableCaption>
				<TableHeader className="bg-sky-950">
					<TableRow>
						<TableHead className="text-white font-bold">Title</TableHead>
						<TableHead className="text-white font-bold">Description</TableHead>
						<TableHead className="text-white font-bold">Image</TableHead>
						<TableHead className="text-white font-bold">Delete</TableHead>
						<TableHead className="text-white font-bold">Update</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{spellbook.data?.spells.map((spell) => (
						<TableRow key={spell.id}>
							<TableCell>{spell.title}</TableCell>
							<TableCell>{spell.description}</TableCell>
							<TableCell>
								{spell.image && (
									<Image src={spell.image} className="object-cover border-2 border-white w-11 h-11 rounded-lg" width={50} height={50} alt={spell.title} />
								)}
							</TableCell>
							<TableCell>
								<Button className="text-white flex gap-1 rounded bg-red-600 hover:bg-red-800" onClick={() => delSpell(spell.id)}>Delete<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
									<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
								</svg>
								</Button>
							</TableCell>
							<TableCell><Dialog>
								<DialogTrigger asChild>
									<Button className="text-white rounded flex gap-1 bg-blue-600 hover:bg-blue-800" onClick={() => handleEditClick(spell)}>Update<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
									</svg>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Update your spell</DialogTitle>
										<DialogDescription>
											Update powerful spell to your {spellbook.data?.title}
										</DialogDescription>
										<div className="flex flex-col gap-3">
											<p>Title:</p>
											<Input value={title2} onChange={(e) => setTitle2(e.target.value)} />
											<p>Description:</p>
											<Input value={description2} onChange={(e) => setDescription2(e.target.value)} />
											<Button className="text-white" onClick={updateExistingSpell}>Save</Button>
										</div>
									</DialogHeader>
								</DialogContent>
							</Dialog></TableCell>

						</TableRow>
					))}
					
				</TableBody>
			</Table>
		</div>
	);

}