import { ulid } from "ulid";

export function generateId(
	entity: "game" | "clip" | "draft" | "player" | "stats"
): string {
	return `${entity}_${ulid()}`;
}
