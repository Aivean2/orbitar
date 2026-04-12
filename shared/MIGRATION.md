# Shared Types Migration Guide

## Overview

This document describes how to complete the migration from duplicated types to
the `@orbitar/shared` package. The infrastructure (npm workspaces, TS project
references, Docker builds) is already in place. What remains is rewriting
imports in backend and frontend.

## Backend Migration

### Pattern

Replace local type imports:
```typescript
// BEFORE
import { VoteListItemEntity } from './types/entities/VoteEntity'
import { VoteSetRequest, VoteSetResponse } from './types/requests/VoteSet'

// AFTER
import { VoteListItemEntity, VoteSetRequest, VoteSetResponse } from '@orbitar/shared'
```

See `VoteController.ts`, `StatusController.ts`, and `AuthController.ts` for
completed examples.

### Files Requiring Import Updates

**API Controllers** (import from `./types/entities/` or `./types/requests/`):
- `src/api/FeedController.ts`
- `src/api/PostController.ts`
- `src/api/UserController.ts`
- `src/api/InviteController.ts`
- `src/api/NotificationsController.ts`
- `src/api/OAuth2Controller.ts`
- `src/api/PollController.ts`
- `src/api/SiteController.ts`
- `src/api/utils/Enricher.ts`

**Managers** (import entity types through longer relative paths):
- `src/managers/FeedManager.ts`
- `src/managers/InviteManager.ts`
- `src/managers/OAuth2Manager.ts`
- `src/managers/PollManager.ts`
- `src/managers/UserManager.ts`
- `src/managers/types/PollInfo.ts`

**DB layer** (import entity types):
- `src/db/repositories/PollRepository.ts`
- `src/db/repositories/PostRepository.ts`
- `src/db/repositories/UserRepository.ts`
- `src/db/types/PollRaw.ts`

### Special Cases

1. **`NotificationsSubscribe.ts`** — The original imported `PushSubscription`
   from `web-push`. The shared version defines `PushSubscriptionJSON` inline
   to avoid the dependency. Backend code that uses this type may need
   adjustment.

2. **`Poll.ts`** — The original imported `UserBaseInfo` from
   `managers/types/UserInfo`. The shared version uses `UserBaseEntity` instead
   (same shape: `{id, username, gender}`). Backend poll code needs to
   map between the internal `UserBaseInfo` and the API-facing `UserBaseEntity`.

3. **`Translate.ts`** — `TranslationMode` and `TranslationLanguage` are now
   defined in the shared package instead of `TranslationManager.ts`. The
   backend manager should re-export or import from `@orbitar/shared`.

## Frontend Migration

The frontend has **inline type definitions** in `src/API/PostAPI.ts` that
duplicate the backend entities (`PostEntity`, `CommentEntity`, `ContentFormat`,
`EditFlag`, plus request/response types for every API call).

### Approach

1. Replace inline types in `PostAPI.ts` with imports from `@orbitar/shared`
2. Update any files that import from `PostAPI.ts` for type-only usage
3. Check `src/API/UserAPI.ts` and `src/API/PostAPIHelper.ts` as well

### CRA Limitation

Create React App restricts imports to files inside `src/`. Since
`@orbitar/shared` is resolved as a proper npm package via workspaces
(symlinked in `node_modules/`), imports via package name work:

```typescript
import { PostEntity, CommentEntity } from '@orbitar/shared'
```

This works with `react-app-rewired` without additional configuration because
the import resolves through `node_modules`, not a relative path outside `src/`.

## Verification

After completing all import rewrites:

```bash
# Build shared types
npm run -w shared build

# Verify backend compiles
npm run -w backend build

# Verify frontend compiles
npm run -w frontend build
```

## Cleanup

Once all imports are migrated:
- Delete `backend/src/api/types/entities/` (now in `shared/src/entities/`)
- Delete `backend/src/api/types/requests/` (now in `shared/src/requests/`)
- Remove duplicate type definitions from `frontend/src/API/PostAPI.ts`
