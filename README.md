# SmartClinicQ

Queue management web app for clinics with real-time updates.

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
     <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/6282006c-c933-473d-81f5-5f94078f16b0" />

     <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/0f153e13-a576-47dd-8fad-88bf605647a9" />

   - Staff Dashboard: http://localhost:5000/dashboard.html
     <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/d82ebe8c-5c0a-4393-92d3-d16c4642deab" />

     <img width="2160" height="1440" alt="image" src="https://github.com/user-attachments/assets/dd338d66-3cc2-4c4a-b574-10bce91dc8fe" />

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
