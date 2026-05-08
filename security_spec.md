# Security Specification: AI Agent Task Environment

## Data Invariants
1. An `agent_task` must belong to an authenticated user (`userId`).
2. A user can only read and write their own tasks (unless an admin role is introduced).
3. Status transitions should be logical (e.g., from `pending` to `in-progress`).
4. Timestamps (`createdAt`, `updatedAt`) must be server-verified.
5. All IDs must be strictly formatted.

## The Dirty Dozen (Attack Scenarios)
1. **Identity Spoofing**: User A attempts to create a task for User B by setting `userId` to B's UID.
2. **Shadow Field Injection**: Adding `isAdmin: true` to a task document.
3. **Ghost Status Update**: Directly setting a task to `completed` without execution.
4. **Denial of Wallet**: Injecting 1MB strings into task payloads.
5. **ID Poisoning**: Using a 1.5KB string as a document ID.
6. **Cross-User Leak**: Listing tasks where `userId` is NOT the current user.
7. **Credit Manipulation**: Attempting to update `user_credits` directly from the client.
8. **Settlement Forgery**: Creating a `settlement` record with a fake amount.
9. **Timestamp Spoofing**: Setting `createdAt` to a date in 2030.
10. **Immutable Field Break**: Changing the `agentId` of an existing task.
11. **Blanket Query Scraping**: Listing all tasks in the collection without a filter.
12. **Malformed Payload**: Sending a list for a field that expects a string.

## Red Team Checklist
- [ ] Every `create` uses strict key matching.
- [ ] Every `update` uses `affectedKeys().hasOnly()`.
- [ ] Every `write` checks `userId == request.auth.uid`.
- [ ] No blanket reads allowed.
- [ ] Server timestamps enforced.
