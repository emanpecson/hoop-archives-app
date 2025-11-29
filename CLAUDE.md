# Hoop Archives

Basketball game video management app: upload full games → create clips with metadata → compile highlight reels.

## Architecture

- **Stack**: Next.js 15 (App Router), NextAuth.js + AWS Cognito, DynamoDB, S3, Tailwind CSS
- **Data Flow**: Videos stored in S3, metadata in DynamoDB. All routes under `/league/[leagueId]` are auth-protected by middleware
- **Video Uploads**: Use multipart upload via `/api/s3/start-upload` → `/api/s3/complete-upload`

## Domain Concepts

- **Draft**: Work-in-progress state for clip creation. Saves clip drafts and allows resuming editing sessions
- **Clip**: Timestamped video segment with offensive/defensive categorization, play type, and player tags
- **Highlight Reel**: Curated collection of clips (player-specific or game-specific)

## Key Patterns

- All forms use React Hook Form + Zod validation (schemas in `types/schema/`)
- Video clipper provides frame-accurate timeline editing
- Middleware auto-refreshes Cognito tokens via `/api/auth/cognito/refresh`
- UI built on Radix primitives with Tailwind CSS

## Important Notes

- Game types defined in `types/enum/game-type.ts`
- Player data includes jersey number, position, and profile images
- Clips categorize plays as offensive or defensive with specific play types

## Notion

- DO NOT modify/delete any Notion pages without the user's explicit permission.
- You should only ever reference pages that explicitly have a relation property to the Hoop Archives @project page.
