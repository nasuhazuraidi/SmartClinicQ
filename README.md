# SmartClinicQ

Queue management web app for clinics with real-time updates.

## Live Demo (No Download Needed)
- Patient View: https://smartclinicq-c2e3b.web.app
  <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/6cb0127b-2830-4460-9543-856529f5f369" />

- Staff Dashboard: https://smartclinicq-c2e3b.web.app/dashboard.html
  <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/41e145b6-964a-4fa7-b3a3-6b6674282ea5" />
  <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/f39bf2cc-c2c8-4437-a557-e86d70898df7" />



## Features
- Patient queue ticket creation
- Live queue display
- Staff dashboard (call next / served / skipped)
- Firebase Auth (staff login)
- Cloud Functions (server-side ticket logic)
- Firestore database
- Firebase Hosting

## Tech Stack
- HTML/CSS/JS (frontend)
- Firebase Hosting
- Cloud Firestore
- Firebase Auth
- Cloud Functions
- Cloud Logging (Google Cloud Logging) for Functions logs

## Setup (Local)
1. Install dependencies for Functions:
   ```bash
   cd functions
   npm install
   ```

2. Start hosting emulator:
   ```bash
   firebase emulators:start --only hosting
   ```

3. Open:
   - Patient UI: http://localhost:5000
   - Staff Dashboard: http://localhost:5000/dashboard.html

## Deploy
```bash
firebase deploy --only "functions,firestore:rules,hosting"
```

## Firebase Auth
- Enable Email/Password in Firebase Console
- Create staff users in Authentication ? Users

## Firestore
- Collection: `appointments`
- Counters: `counters/{ServiceType}` for ticket numbering

## Monitoring & Logs
- Functions: Firebase Console ? Functions ? Logs
- Usage: Hosting / Firestore / Auth ? Usage tabs
