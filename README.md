# 🎫 כרטיסיות משפחה

> A dead-simple Hebrew support-ticket web app for your family.  
> No server. No accounts. Hosted free on GitHub Pages.

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

---

## Setup guide

Total time: ~15 minutes.

---

### 1 · Make the repo private

Your `config.js` will contain API keys.  
In GitHub → **Settings** → **Danger Zone** → **Change visibility** → Private.

> GitHub Pages sites stay publicly accessible by URL even on private repos — only the source code is hidden.

---

### 2 · Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Enter a project name (e.g. `family-tickets`) → click through the steps → **Create project**

---

### 3 · Enable Firestore

1. In the Firebase console left sidebar → **Build** → **Firestore Database**
2. Click **Create database** → choose **Production mode** → pick a region (e.g. `europe-west1`) → **Enable**
3. Go to the **Rules** tab and replace the contents with:

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

4. Click **Publish**

---

### 4 · Enable Firebase Storage

1. Left sidebar → **Build** → **Storage** → **Get started** → Production mode → **Done**
2. Go to the **Rules** tab, replace with:

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

3. Click **Publish**

---

### 5 · Get your Firebase config

1. Left sidebar → **Project Settings** (⚙️ gear icon) → **General** tab
2. Scroll down to **Your apps** → click **</>** (Web)
3. Register the app (any nickname, e.g. `family-tickets-web`) — no need to set up Firebase Hosting
4. Copy the `firebaseConfig` block — you'll need these values in the next step

---

### 6 · Set up push notifications (ntfy)

1. Install the **ntfy** app on your phone:
   - [Android — Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
   - [iPhone — App Store](https://apps.apple.com/app/ntfy/id1625396347)
   - Or use [ntfy.sh/app](https://ntfy.sh/app) in any browser
2. Choose a **secret topic name** — treat it like a password. Make it random and hard to guess, e.g. `cohen-family-tickets-x7k2m9`
3. In the ntfy app tap **＋** → enter your topic name → **Subscribe**

That's it. Any app that POSTs to `https://ntfy.sh/your-topic` will now ring your phone.

---

### 7 · Fill in config.js

Open `config.js` and replace all placeholder values:

```javascript
const CONFIG = {
  firebase: {
    apiKey: "AIza...",                           // from Firebase console
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc"
  },
  ntfy: {
    topic: "cohen-family-tickets-x7k2m9",        // your secret topic
    server: "https://ntfy.sh"
  },
  adminPin: "1234",   // PIN to enter owner mode — pick something only you know
  ownerName: "אומר"   // Your name as it appears in your replies
};
```

Commit and push:

```bash
git add config.js
git commit -m "Configure Firebase and ntfy"
git push
```

---

### 8 · Enable GitHub Pages

1. Repo → **Settings** → **Pages** (left sidebar)
2. Under **Source** → **Deploy from a branch**
3. Branch: `main` · Folder: `/ (root)` → **Save**
4. Wait ~1 minute → your site is live at:  
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

### 9 · Authorize your domain in Firebase

Firebase blocks requests from unknown domains by default.

1. Firebase console → **Authentication** → **Settings** tab → **Authorized domains**
2. Click **Add domain** → enter `YOUR-USERNAME.github.io` → **Add**

---

### 10 · Share the link

Send your family the URL. Bookmark it. Done.

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
index.html      Ticket list page (filter tabs, new-ticket modal)
ticket.html     Ticket detail page (replies, screenshot, owner controls)
style.css       Hebrew RTL design, mobile-first
config.js       ← YOUR SETTINGS GO HERE
manifest.json   PWA manifest (installable on phones)
sw.js           Service worker (offline cache)
.gitignore      Keeps OS/editor clutter out of git
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
| Blank page / no tickets loading | Check browser console for Firebase errors. Make sure `config.js` is filled in and the GitHub Pages domain is in Firebase authorized domains. |
| Screenshots not uploading | Check Firebase Storage rules are published correctly. |
| No push notifications | Make sure your ntfy topic in `config.js` matches the one you subscribed to in the app. Topics are case-sensitive. |
| "Permission denied" from Firestore | Re-check and re-publish the Firestore security rules from Step 3. |

---

## Security notes

- **Firestore rules are open** (`allow read, write: if true`) — appropriate for a private family URL. If you want tighter control, see [Firebase security rules docs](https://firebase.google.com/docs/firestore/security/get-started).
- **Admin PIN is client-side** — it prevents accidental status changes but is not cryptographically secure. This is fine for a family app; don't reuse a sensitive password.
- **ntfy topic = password** — anyone who knows your topic name can send you push notifications. Keep it random and don't share it.
