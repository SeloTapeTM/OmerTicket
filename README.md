# 🎫 כרטיסיות משפחה

> A dead-simple Hebrew support-ticket web app for your family.  
> No server. No accounts. Hosted free on GitHub Pages (public repo — secrets stay safe).

**Stack:** GitHub Pages · Firebase Firestore · Firebase Storage · [ntfy.sh](https://ntfy.sh)

---

## How it works

```
Family opens a ticket
    → saved in Firestore (real-time)
    → push notification sent to your phone via ntfy.sh

You reply / change status (owner PIN required)
    → family sees the update instantly
```

Secrets (Firebase keys, ntfy topic, admin PIN) are stored as **GitHub Actions secrets** and
injected into the app at deploy time — nothing sensitive ever appears in the repo source.

---

## Setup guide

Total time: ~15 minutes.

---

### 1 · Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Enter a project name (e.g. `family-tickets`) → click through the steps → **Create project**

---

### 2 · Enable Firestore

1. Left sidebar → **Build** → **Firestore Database** → **Create database**
2. Choose **Production mode** → pick a nearby region → **Enable**
3. Go to the **Rules** tab → replace with the following → **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      allow read, write: if true;
      match /replies/{replyId} {
        allow read, write: if true;
      }
    }
  }
}
```

---

### 3 · Enable Firebase Storage

1. Left sidebar → **Build** → **Storage** → **Get started** → Production mode → **Done**
2. **Rules** tab → replace with the following → **Publish**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

### 4 · Get your Firebase config values

1. **Project Settings** (⚙️ gear) → **General** tab → scroll to **Your apps**
2. Click **</>** (Web) → register app (any nickname) → you'll see a `firebaseConfig` block:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};
```

Keep this open — you'll copy these values into GitHub secrets next.

---

### 5 · Set up push notifications (ntfy)

1. Install the **ntfy** app on your phone:
   - [Android — Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
   - [iPhone — App Store](https://apps.apple.com/app/ntfy/id1625396347)
   - Or use [ntfy.sh/app](https://ntfy.sh/app) in any browser
2. Choose a **secret topic name** — treat it like a password. Make it random, e.g. `cohen-family-tickets-x7k2m9`
3. In the ntfy app: tap **＋** → enter your topic → **Subscribe**

---

### 6 · Enable GitHub Pages (via Actions)

1. Repo → **Settings** → **Pages** (left sidebar)
2. Under **Source** → select **GitHub Actions**
3. That's it — no branch to select. The workflow handles the deployment.

---

### 7 · Add GitHub Actions secrets

This is how secrets stay out of the public repo. Each secret is encrypted and only injected during the deploy workflow.

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Add each of the following:

| Secret name | Value |
|---|---|
| `FIREBASE_API_KEY` | `apiKey` value from step 4 |
| `FIREBASE_AUTH_DOMAIN` | `authDomain` value |
| `FIREBASE_PROJECT_ID` | `projectId` value |
| `FIREBASE_STORAGE_BUCKET` | `storageBucket` value |
| `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` value |
| `FIREBASE_APP_ID` | `appId` value |
| `NTFY_TOPIC` | Your secret topic name from step 5 |
| `ADMIN_PIN` | A PIN only you know (e.g. `5678`) |
| `OWNER_NAME` | Your first name in Hebrew (e.g. `אומר`) |

---

### 8 · Trigger the first deployment

Push any commit to `main` (or go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**).

The workflow will:
1. Generate `config.js` from your secrets (never stored in the repo)
2. Deploy all files to GitHub Pages

Wait ~1 minute → your site is live at:  
`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

### 9 · Authorize your domain in Firebase

Firebase blocks requests from unknown domains by default.

1. Firebase console → **Authentication** → **Settings** tab → **Authorized domains**
2. **Add domain** → enter `YOUR-USERNAME.github.io` → **Add**

---

### 10 · Share the link with your family 🎉

---

## Using the app

### For family members

| Action | How |
|---|---|
| Open a ticket | Tap **"כרטיסייה חדשה"** → fill in name, subject, description, optional screenshot → Send |
| Check for replies | Open the ticket from the list |
| Add a reply | Open the ticket → type in the reply box at the bottom |

### For you (owner)

| Action | How |
|---|---|
| Enter owner mode | Tap 👤 in the top-right corner → enter your PIN → 👑 appears |
| Change ticket status | Open a ticket → owner controls appear below the description |
| Reply as yourself | Your replies are highlighted in blue |
| Exit owner mode | Tap 👑 again |

### Status flow

```
📬 פתוח (Open)  →  🔧 בטיפול (In Progress)  →  ✅ נסגר (Resolved)
                                                       ↓
                                               📬 פתח מחדש (Reopen)
```

---

## File overview

```
.github/
  workflows/
    deploy.yml    CI/CD pipeline: injects secrets → deploys to GitHub Pages
index.html        Ticket list page (filter tabs, new-ticket modal)
ticket.html       Ticket detail page (replies, screenshot, owner controls)
style.css         Hebrew RTL design, mobile-first
config.js         Template only — real values come from GitHub secrets at build time
manifest.json     PWA manifest (installable on phones)
sw.js             Service worker (offline cache)
```

---

## Installing as a phone app (optional)

The site is a PWA — you can install it like a native app:

- **iPhone:** Open in Safari → Share button → "Add to Home Screen"
- **Android:** Open in Chrome → three-dot menu → "Add to Home Screen" or "Install app"

---

## Troubleshooting

| Problem | Fix |
|---|---|
| GitHub Actions workflow fails with "Missing secrets" | Go to Settings → Secrets → Actions and add the missing secrets from Step 7 |
| Blank page / no tickets loading | Check browser console for Firebase errors. Make sure the GitHub Pages domain is in Firebase authorized domains (Step 9). |
| Screenshots not uploading | Verify Firebase Storage rules are published correctly (Step 3). |
| No push notifications | Check that `NTFY_TOPIC` secret matches exactly what you subscribed to in the app. Topics are case-sensitive. |
| "Permission denied" from Firestore | Re-check and re-publish the Firestore rules (Step 2). |

---

## Security notes

- **Secrets never touch the repo** — they live in GitHub's encrypted secret store and are injected only during the GitHub Actions deploy job.
- **Firestore rules are open** (`allow read, write: if true`) — fine for a private family URL. See [Firebase security rules docs](https://firebase.google.com/docs/firestore/security/get-started) for tighter control.
- **Admin PIN is client-side** — prevents accidental status changes but is not cryptographic. Don't reuse a sensitive password.
- **ntfy topic = notification password** — anyone who knows it can send you push notifications. Keep it random.
