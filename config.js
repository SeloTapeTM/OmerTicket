// ─────────────────────────────────────────────────────────────
// This file is a TEMPLATE. Real values are injected by GitHub
// Actions at deploy time — never commit secrets here.
//
// To configure the app, add these as GitHub Actions secrets:
//   FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID, NTFY_TOPIC, ADMIN_PIN, OWNER_NAME
//
// See README.md → Step 7 for full instructions.
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  firebase: {
    apiKey: "REPLACE_WITH_YOUR_API_KEY",
    authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
    storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
    appId: "REPLACE_WITH_YOUR_APP_ID"
  },
  ntfy: {
    topic: "REPLACE_WITH_SECRET_TOPIC",
    server: "https://ntfy.sh"
  },
  adminPin: "REPLACE_WITH_YOUR_PIN",
  ownerName: "אומר"
};
