# 🎫 כרטיסיות משפחה — Family Ticketing System

A simple Hebrew ticketing system for your family to open support tickets, with push notifications via [ntfy.sh](https://ntfy.sh).

**Hosted on GitHub Pages · Powered by Firebase · No server required**

---

## Setup (one-time, ~15 minutes)

### Step 1 — Make the repo private

In GitHub → Settings → scroll down → change visibility to **Private**.
This keeps your `config.js` credentials out of public view while the GitHub Pages site remains accessible via URL.

### Step 2 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**
2. Give it a name (e.g. `family-tickets`) → continue through the steps
3. In the project, click **Firestore Database** → **Create database** → choose **Production mode** → pick a region close to you → Enable

### Step 3 — Set Firestore security rules

In Firestore → **Rules** tab, paste:

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

Click **Publish**.

### Step 4 — Enable Firebase Storage

1. In Firebase console → **Storage** → **Get started** → Production mode → Enable
2. In Storage → **Rules** tab, paste:

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

Click **Publish**.

### Step 5 — Get your Firebase config

1. In Firebase console → **Project Settings** (gear icon) → **General** tab
2. Scroll to **Your apps** → click **</>** (Web) → register the app
3. Copy the `firebaseConfig` object values

### Step 6 — Set up ntfy push notifications

1. Download the **ntfy** app: [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) / [iOS](https://apps.apple.com/app/ntfy/id1625396347) / [Web](https://ntfy.sh/app)
2. Choose a **secret random topic name** — treat it like a password (e.g. `daniel-family-tickets-x7k2m`)
3. In the ntfy app, subscribe to that topic name
4. You'll now receive push notifications whenever a ticket is opened or replied to

### Step 7 — Edit config.js

Fill in your values in `config.js`:

```javascript
const CONFIG = {
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  },
  ntfy: {
    topic: "your-secret-topic-name",
    server: "https://ntfy.sh"
  },
  adminPin: "your-secret-pin",  // PIN to enter "owner mode"
  ownerName: "אומר"             // Your name as it appears in replies
};
```

### Step 8 — Enable GitHub Pages

1. Push your changes to the `main` branch
2. Go to repo **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch** → `main` → `/ (root)` → Save
4. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Step 9 — Add GitHub Pages domain to Firebase

1. In Firebase console → **Authentication** → **Settings** → **Authorized domains**
2. Add your GitHub Pages domain: `YOUR-USERNAME.github.io`

---

## How to use

### For family members
1. Open the site URL
2. Click **"כרטיסייה חדשה"** (New Ticket)
3. Enter your name, describe the problem, optionally attach a screenshot
4. Submit — you'll get a reply in the ticket

### For you (owner)
1. Click the 👤 icon in the top corner
2. Enter your admin PIN → you enter "owner mode" (shown by 👑 icon)
3. In owner mode you can:
   - Change ticket status: In Progress / Resolved / Reopen
   - Reply as yourself (replies show with a blue highlight)
4. You receive push notifications on your phone via the ntfy app for every new ticket and family reply

---

## Features

- 🇮🇱 Full Hebrew RTL interface
- 📱 Mobile-first, installable as PWA
- 🔔 Push notifications via ntfy.sh (no account needed)
- 📎 Screenshot attachments
- 💬 Threaded replies
- 🔄 Real-time updates (tickets appear instantly)
- 🏷️ Status tracking: Open / In Progress / Resolved
- 🔐 Simple owner PIN for admin actions
- ☁️ Zero-server: GitHub Pages + Firebase
