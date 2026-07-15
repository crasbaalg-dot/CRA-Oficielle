# Firebase Security Specification

This document specifies the security rules and access control model for the Algerian Red Crescent (Sidi Bel Abbès Committee) web application's Firestore database.

## 1. Data Invariants & Access Control Model

| Collection | Path | Read Access | Write Access | Key Validation & Invariants |
|------------|------|-------------|--------------|------------------------------|
| **Statistics** | `/statistics/general` | Public (any guest) | Admins Only | Numeric stats >= 0, exact fields (`volunteersCount`, `bloodUnitsCount`, `firstAidTrainedCount`, `campaignsCount`) |
| **Settings** | `/settings/general` | Public (any guest) | Admins Only | Non-empty strings, valid email and phone format, exact settings fields |
| **News** | `/news/{newsId}` | Public (any guest) | Admins Only | Valid id, title, content (Ar/Fr), category, date, and boolean draft/pinned states |
| **Announcements** | `/announcements/{id}` | Public (any guest) | Admins Only | Priority is one of `low`, `medium`, `high`, `critical`. Pinned is boolean |
| **Members** | `/members/{id}` | Public (any guest) | Admins Only | Valid id, names, roles, bios, and order index |
| **First Aid** | `/first_aid/{id}` | Public (any guest) | Admins Only | Steps are lists of strings. Icon is non-empty string |
| **Blood Campaigns** | `/blood_campaigns/{id}`| Public (any guest) | Admins Only | Status is one of `upcoming`, `ongoing`, `completed`. |
| **Volunteers** | `/volunteers/{id}` | Admins Only | Create: Public<br>Update/Delete: Admins | Submitting is open to anyone. Status defaults to `pending` and can only be updated by admins |
| **Contact Messages** | `/contact_messages/{id}`| Admins Only | Create: Public<br>Update/Delete: Admins | Submitting is open to anyone. Status `isRead` can only be updated by admins |
| **Admins** | `/admins/{uid}` | Admins Only | Admins Only | Admin user record containing email, status, and role |

---

## 2. The "Dirty Dozen" Payloads (Exploit Scenarios)

The following 12 payloads represent attacks or unauthorized actions that must be strictly denied by the Firestore security rules.

### Scenario 1: Unauthenticated Admin Write to News
* **Action:** `create` document `/news/news-malicious`
* **Payload:** `{ "titleAr": "Hacked", "titleFr": "Hacked", "date": "2026-07-14", "isDraft": false }`
* **Expectation:** `PERMISSION_DENIED` (Not an admin)

### Scenario 2: Admin Spoofing via Self-Creation
* **Action:** `create` document `/admins/{maliciousUid}` by the user themselves
* **Payload:** `{ "uid": "{maliciousUid}", "email": "attacker@gmail.com", "role": "super_admin", "status": "active" }`
* **Expectation:** `PERMISSION_DENIED` (Only existing super_admins can create admins)

### Scenario 3: Anonymous User Reading Volunteer Applications
* **Action:** `list` or `get` document `/volunteers/vol-123`
* **Expectation:** `PERMISSION_DENIED` (Volunteer data is private PII, restricted to admins)

### Scenario 4: Anonymous User Reading Contact Messages
* **Action:** `list` or `get` document `/contact_messages/msg-123`
* **Expectation:** `PERMISSION_DENIED` (Contact inquiries contain private PII, restricted to admins)

### Scenario 5: User Modifying Volunteer Application Status
* **Action:** `update` document `/volunteers/vol-123` (changing status from pending to approved)
* **Payload:** `{ "status": "approved" }`
* **Expectation:** `PERMISSION_DENIED` (Only admins can approve/reject volunteer applications)

### Scenario 6: Malicious String Injection (Denial of Wallet)
* **Action:** `create` document `/contact_messages/msg-malicious` with extremely large values
* **Payload:** `{ "name": "A...", "message": "A".repeat(100000) }` (excessive message size)
* **Expectation:** `PERMISSION_DENIED` (Violates string length validation limits)

### Scenario 7: State Bypassing in Blood Campaigns
* **Action:** `create` document `/blood_campaigns/camp-invalid` with an illegal status
* **Payload:** `{ "titleAr": "حملة", "status": "finished" }` (status must be `upcoming`, `ongoing`, or `completed`)
* **Expectation:** `PERMISSION_DENIED` (Violates status enum constraints)

### Scenario 8: Shadow Field Injection to News
* **Action:** `create` document `/news/news-1` containing an unapproved field
* **Payload:** `{ "id": "news-1", "titleAr": "A", "titleFr": "B", "ghostField": "malicious" }`
* **Expectation:** `PERMISSION_DENIED` (Strict schema key matching)

### Scenario 9: Modifying Immutable Fields in Settings
* **Action:** `update` document `/settings/general` modifying the site ID or schema properties
* **Expectation:** `PERMISSION_DENIED` (Immutable layout)

### Scenario 10: Deleting Statistics Collection
* **Action:** `delete` document `/statistics/general`
* **Expectation:** `PERMISSION_DENIED` (Stats cannot be deleted)

### Scenario 11: Spoofing Creation Timestamp in News
* **Action:** `create` document `/news/news-1` with a future client timestamp instead of server timestamp
* **Payload:** `{ "date": "2030-01-01" }`
* **Expectation:** `PERMISSION_DENIED` (Must align with validation rules)

### Scenario 12: Anonymous Update to First Aid Steps
* **Action:** `update` document `/first_aid/fa-1`
* **Expectation:** `PERMISSION_DENIED` (First aid tutorials are write-restricted to admins)

---

## 3. Security Test Runner (Summary)

The security rules are verified using the Jest/Mocha-based Firebase Firestore emulator framework.

```typescript
// firestore.rules.test.ts
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'tribal-circle-35jvd',
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8')
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

test('Unauthenticated user cannot write news articles', async () => {
  const aliceDb = testEnv.unauthenticatedContext().firestore();
  await expect(
    setDoc(doc(aliceDb, 'news/news-malicious'), { titleAr: 'Hacked' })
  ).rejects.toThrow();
});
```
