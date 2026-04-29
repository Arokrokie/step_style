// Firebase Configuration
// Get your config from: https://console.firebase.google.com

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };

/*
=== SETUP INSTRUCTIONS ===

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing one)
3. Enable Authentication:
   - Go to Authentication
   - Enable Email/Password authentication
4. Create Firestore Database:
   - Go to Firestore Database
   - Create in production mode
   - Set security rules to:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
       match /orders/{orderId} {
         allow read, write: if request.auth.uid == resource.data.userId;
       }
       match /orders/{document=**} {
         allow create: if request.auth != null;
       }
     }
   }

5. Copy your config from Project Settings:
   - Click gear icon (Settings)
   - Scroll to "Your apps"
   - Click Web icon (or create web app)
   - Copy the config object
6. Replace the values in this file
*/
