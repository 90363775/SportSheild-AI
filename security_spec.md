# Security Specification - SportShield AI

## 1. Data Invariants
- An `Asset` must have a valid `ownerId` matching the creator, and a `status`.
- A `Violation` must reference a valid `assetId` and be owned by the user who owns that asset (enforced by `ownerId` sync).
- A `LegalNotice` must reference a valid `violationId`.
- `createdAt` and `ownerId` are immutable.

## 2. The "Dirty Dozen" Payloads (Attacks)
1. **Identity Spoofing**: Creating an asset with `ownerId` of another user.
2. **Resource Poisoning**: Document IDs with 1MB junk strings.
3. **Privilege Escalation**: Updating an asset status to "Processed" manually.
4. **Data Injection**: Adding a "isVerified: true" ghost field to a violation.
5. **Orphaned Record**: Creating a violation for an `assetId` that doesn't exist.
6. **State Shortcutting**: Skipping "Under Review" and moving a violation straight to "Resolved".
7. **Cross-Tenant Read**: Listing violations belonging to another user.
8. **PII Leak**: Accessing another user's email if stored.
9. **Denial of Wallet**: Infinite sized arrays in a document.
10. **Timestamp Manipulation**: Sending a fake `createdAt` in the past.
11. **Malicious ID Injection**: Document IDs like `../.../other_collection/doc`.
12. **Shadow Field Persistence**: Updating a document while keeping malicious fields from a previous creation attempt.

## 3. Test Runner (Mock)
`firestore.rules.test.ts` would verify that all above payloads return `PERMISSION_DENIED`.
