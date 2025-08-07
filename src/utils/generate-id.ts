import { ulid } from "ulid";

export function generateId(
	entity: "game" | "clip" | "draft" | "player" | "stats" | "reel"
): string {
	return `${entity}_${ulid()}`;
}
