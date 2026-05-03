# Profile Page — Implementation Plan

## Goal
Build a complete authenticated user profile page with three independent forms and an avatar upload, reusing existing UI components, validation, and styles.

---

## 1. Page Layout (`/profile`)

```
┌────────────────────────────────────────────┐
│  ProfileImageSection                       │
│   - Circle avatar (default user icon)      │
│   - "Change photo" button → file picker    │
│   - "Remove" button (if image exists)      │
│   - Shows display name + email under photo │
├────────────────────────────────────────────┤
│  ProfileInfoSection                        │
│   - Read-only by default (idNumber/etc)    │
│   - "Edit" button → toggles editable mode  │
│   - "Save" + "Cancel" while editing        │
│   - Reuses registrationSchema (minus pwd)  │
├────────────────────────────────────────────┤
│  ChangePasswordSection                     │
│   - oldPassword / newPassword / confirm    │
│   - "Update password" button               │
│   - Uses new changePasswordSchema          │
├────────────────────────────────────────────┤
│  DangerZoneSection                         │
│   - Red bordered box, "Delete account"     │
│   - Confirm modal (asks for password)      │
└────────────────────────────────────────────┘
```

---

## 2. Backend Changes

### 2.1 User schema
Add to `src/modules/user.modules.ts`:
- `profileImage: { type: String, default: null }`

### 2.2 New controllers (`src/controllers/user/`)
- `updateProfile.ts` — `PATCH /api/user/profile`. Validates body against profile schema (re-export of register schema minus password/idNumber). Updates user document.
- `uploadProfileImage.ts` — `POST /api/user/profile/image`. Uses multer with `cloudinaryFolder = "users"`. Saves URL to user. Removes previous image from Cloudinary.
- `deleteProfileImage.ts` — `DELETE /api/user/profile/image`. Removes image from Cloudinary, sets field to null.
- `changePassword.ts` — `PATCH /api/user/password`. Verifies oldPassword, hashes newPassword, saves.
- `deleteAccount.ts` — `DELETE /api/user/account`. Verifies password, deletes user + their profile image from Cloudinary.

### 2.3 New validation schemas (`src/validations/schemas/user/`)
- `profileUpdate.schema.ts` — Joi/zod equivalent of register schema **without** password, confirmPassword, terms, idNumber (idNumber is immutable).
- `changePassword.schema.ts` — `{ oldPassword, newPassword, confirmPassword }` with strict password regex on newPassword.

### 2.4 Routes update (`src/routes/user.routes.ts`)
```
GET    /profile                  (already exists, fix to return DB user)
PATCH  /profile                  (new — profileUpdate.schema)
POST   /profile/image            (new — multer + cloudinaryFolder=users)
DELETE /profile/image            (new)
PATCH  /password                 (new — changePassword.schema)
DELETE /account                  (new)
```

All protected with `authenticate` middleware.

### 2.5 Cloudinary
Folder: `khelovani/users`. Set `req.cloudinaryFolder = "users"` before multer middleware.

---

## 3. Frontend Structure

### 3.1 New folders
```
src/apiCalls/profileRequests/
  profile.req.ts                 # all profile endpoints

src/components/profilePage/
  ProfileImageSection/
    ProfileImageSection.tsx
    profileImageSection.scss
  ProfileInfoSection/
    ProfileInfoSection.tsx
    profileInfoSection.scss
  ChangePasswordSection/
    ChangePasswordSection.tsx
    changePasswordSection.scss
  DangerZoneSection/
    DangerZoneSection.tsx
    dangerZoneSection.scss

src/lib/validations/
  changePasswordValidations.ts   # new schema
  profileUpdateValidations.ts    # subset of registrationSchema

src/app/(main)/profile/
  page.tsx
  profile.scss
```

### 3.2 Validation reuse strategy
- `profileUpdateValidations.ts` builds a schema from registration's pieces but **omits** `password`, `confirmPassword`, `terms`, `idNumber` (idNumber unchangeable).
- `changePasswordValidations.ts` uses `strictPasswordSchema` from `zodHelpers.ts` for new password.

### 3.3 API helper
`profile.req.ts` exports:
- `getProfile(token)` — moves from `auth.req.ts`
- `updateProfile(token, data)`
- `uploadProfileImage(token, file)`
- `deleteProfileImage(token)`
- `changePassword(token, data)`
- `deleteAccount(token, password)`

All attach `Authorization: Bearer ${token}` header.

### 3.4 Auth context update
- Add `profileImage` to context (so header avatar shows uploaded photo)
- `refreshProfile()` method to re-fetch after updates

---

## 4. UI / UX Details

### Edit toggle pattern (ProfileInfoSection)
- `isEditing: boolean` state
- Inputs use `disabled={!isEditing}` when not editing
- "Edit" button → sets editing=true
- "Cancel" → resets formData to original snapshot, exits editing
- "Save" → validates, calls API, on success updates AuthContext + exits editing
- Show `<TextInput>` with `disabled` styling — add minor SCSS for that

### Image upload UX
- Hidden `<input type="file" accept="image/*">`
- Click avatar or "Change photo" triggers it
- Optimistic UI: show uploading spinner overlay on avatar
- Toast on success/error

### Password section
- Three `<PasswordInput>` fields stacked
- Submit button "Update password"
- Form clears on success
- Errors inline (oldPassword: "incorrect" handled from API)

### Danger zone
- Red bordered card, separate styling
- "Delete account" button → opens confirm modal
- Modal: requires password input + types "DELETE" to confirm
- On success: logout + redirect to home

---

## 5. Translation Keys to Add

Add to `scripts/translations/translations.json` under appropriate namespaces, then run translation generator.

### `pages.profile.*`
```json
"profile.title": { ge: "ჩემი პროფილი", en: "My Profile" }
"profile.subtitle": { ge: "მართე შენი ანგარიში", en: "Manage your account" }
"profile.section.info": { ge: "პირადი მონაცემები", en: "Personal Information" }
"profile.section.password": { ge: "პაროლის შეცვლა", en: "Change Password" }
"profile.section.danger": { ge: "სახიფათო ზონა", en: "Danger Zone" }
"profile.danger.warning": { ge: "ანგარიშის წაშლა შეუქცევადია", en: "Account deletion is permanent" }
"profile.delete.confirm_title": { ge: "დაადასტურე წაშლა", en: "Confirm Deletion" }
"profile.delete.confirm_text": { ge: "შეიყვანე პაროლი", en: "Enter your password to confirm" }
"profile.image.change": { ge: "ფოტოს შეცვლა", en: "Change photo" }
"profile.image.remove": { ge: "ფოტოს წაშლა", en: "Remove photo" }
"profile.image.uploading": { ge: "იტვირთება...", en: "Uploading..." }
```

### `inputs.label.*` (add)
```json
"label.old_password": { ge: "ძველი პაროლი", en: "Old Password" }
"label.new_password": { ge: "ახალი პაროლი", en: "New Password" }
```

### `inputs.placeholder.*` (add)
```json
"placeholder.old_password": { ge: "შეიყვანე ძველი პაროლი", en: "Enter old password" }
"placeholder.new_password": { ge: "შეიყვანე ახალი პაროლი", en: "Enter new password" }
```

### `common.*`
```json
"edit": { ge: "რედაქტირება", en: "Edit" }
"cancel": { ge: "გაუქმება", en: "Cancel" }
"save": { ge: "შენახვა", en: "Save" }
"delete": { ge: "წაშლა", en: "Delete" }
"update": { ge: "განახლება", en: "Update" }
```

### `alerts.*` (add)
```json
"profile_updated": { ge: "პროფილი განახლდა", en: "Profile updated" }
"password_updated": { ge: "პაროლი შეიცვალა", en: "Password changed" }
"image_uploaded": { ge: "ფოტო აიტვირთა", en: "Photo uploaded" }
"image_removed": { ge: "ფოტო წაიშალა", en: "Photo removed" }
"account_deleted": { ge: "ანგარიში წაიშალა", en: "Account deleted" }
"old_password_incorrect": { ge: "ძველი პაროლი არასწორია", en: "Old password is incorrect" }
```

### `validation.*` (add)
```json
"old_password_required": { ge: "შეიყვანე ძველი პაროლი", en: "Old password is required" }
"new_password_same_as_old": { ge: "ახალი პაროლი უნდა განსხვავდებოდეს ძველისგან", en: "New password must differ from old" }
```

---

## 6. Implementation Order

1. **Backend** — schema field, controllers, validation, routes (test with Postman)
2. **Frontend API helpers** — `profileRequests/profile.req.ts`
3. **Frontend validations** — `changePasswordValidations.ts`, `profileUpdateValidations.ts`
4. **AuthContext** — add `profileImage`, `refreshProfile`
5. **Components** — image, info, password, danger sections
6. **Page** — `/profile/page.tsx` composes them
7. **Header** — swap default user icon with profileImage when available
8. **Translations** — add keys above

---

## 7. Best Practices Checklist

- ✅ Reuse existing UI components (`TextInput`, `PasswordInput`, etc.)
- ✅ Reuse zod helpers — no duplicate validation logic
- ✅ Backend uses same registration schema (without password/idNumber) for profile update
- ✅ One source of truth for color/typography (existing SCSS variables)
- ✅ Each section is its own component (single-responsibility)
- ✅ Loading and error states on each form
- ✅ Token attached per-request (no leaking auth into all axios calls yet — can refactor later with interceptor)
- ✅ Optimistic UX on image upload
- ✅ Old image removed from Cloudinary on replace/delete (no orphaned uploads)
- ✅ All destructive actions confirm via password re-entry

---

## 8. Files to Create / Modify Summary

### Backend
- ✏️ `src/modules/user.modules.ts` (add profileImage field)
- ➕ `src/controllers/user/updateProfile.ts`
- ➕ `src/controllers/user/uploadProfileImage.ts`
- ➕ `src/controllers/user/deleteProfileImage.ts`
- ➕ `src/controllers/user/changePassword.ts`
- ➕ `src/controllers/user/deleteAccount.ts`
- ✏️ `src/controllers/user/index.ts` (export new controllers)
- ➕ `src/validations/schemas/user/profileUpdate.schema.ts`
- ➕ `src/validations/schemas/user/changePassword.schema.ts`
- ✏️ `src/routes/user.routes.ts` (new endpoints)
- ✏️ `src/controllers/user/getProfile.ts` (already fixed — returns DB user)

### Frontend
- ➕ `src/apiCalls/profileRequests/profile.req.ts`
- ➕ `src/lib/validations/profileUpdateValidations.ts`
- ➕ `src/lib/validations/changePasswordValidations.ts`
- ➕ `src/components/profilePage/ProfileImageSection/...`
- ➕ `src/components/profilePage/ProfileInfoSection/...`
- ➕ `src/components/profilePage/ChangePasswordSection/...`
- ➕ `src/components/profilePage/DangerZoneSection/...`
- ➕ `src/app/(main)/profile/page.tsx`
- ➕ `src/app/(main)/profile/profile.scss`
- ✏️ `src/contexts/AuthContext.tsx` (add profileImage, refreshProfile)
- ✏️ `src/components/header/auth-component/AuthActions.tsx` (show profile image if exists)

---

End of plan.
