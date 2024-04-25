

export default function SpellbookPage({
	params }:
	{ 
		params: { spellbook: number };
	}) {
	return (
		<div>{params.spellbook}</div>
	);
}