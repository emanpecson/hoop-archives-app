import { ulid } from "ulid";

export function generateId(
	entity: "game" | "clip" | "draft" | "player"
): string {
	return `${entity}_${ulid()}`;
}
