import { Draft } from "../model/draft";

export type DraftPrimaryKey = { leagueId: string; draftId: string };

export type PaginatedDraftsResponse = {
	drafts: Draft[];
	lastEvaluatedKey: DraftPrimaryKey;
};
