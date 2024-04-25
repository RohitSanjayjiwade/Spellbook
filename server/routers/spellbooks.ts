import { z } from "zod";
import { publicProcedure, router } from "../trpc";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



export const spellbooksRouter = router({
	get: publicProcedure.query(async () => {
		return prisma.spellbook.findMany();
	}),
	create: publicProcedure.input(z.object({
		title: z.string(),
		description: z.string(),
	})).mutation(async (opts) => {
		const { input } = opts;
		prisma.spellbook.create({
			data: {
				title: input.title,
				description: input.description,
			},
		});
	}),
	delete: publicProcedure.input(z.object({
		id: z.number(),
	})).mutation(async (opts) => {
		const { input } = opts;
		prisma.spellbook.delete({
			where: {
				id: input.id,
			},
		});
	}),
});