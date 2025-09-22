# SpendWise Mobile App

**SpendWise** is a personal finance management application designed to help users track their expenses, set financial goals, and visualize spending patterns. Built with React Native and Firebase, it offers a seamless experience for managing finances on the go.

---

## Features

- **User Authentication**: Secure sign-up and login using email/password with Firebase Authentication.
- **Expense Tracking**: Add, edit, and delete expenses; categorize them for better organization.
- **Budgeting**: Set and monitor budgets to stay within financial limits.
- **Data Visualization**: Visualize spending patterns through charts and graphs.
- **User Profile**: Manage personal information and view transaction history.

---

## Technologies Used

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Styling**: Tailwind CSS with NativeWind
- **Persistence**: AsyncStorage (via `getReactNativePersistence`)

---

## Installation

### Prerequisites

Make sure you have installed the following:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/chanukacsj/SpendWise-mobile-app.git
   cd SpendWise-mobile-app

2. Install Dependencies
   ```bash
   npm install

3. Install AsyncStorage
   ```bash
   npm install @react-native-async-storage/async-storage

4. Configure Firebase

   Create a Firebase project at Firebase Console
   
   Enable Email/Password Authentication
   
   Create Firestore database
   
   Copy Firebase config to firebase.ts:
    ```bash
      const firebaseConfig = {
      
        apiKey: "YOUR_API_KEY",
      
        authDomain: "YOUR_AUTH_DOMAIN",
      
        projectId: "YOUR_PROJECT_ID",
      
        storageBucket: "YOUR_STORAGE_BUCKET",
      
        messagingSenderId: "YOUR_SENDER_ID",
      
        appId: "YOUR_APP_ID",
      };

6. Start the App
   ```bash
   npm start

   ## 🎥 Demo Video

Watch the app demo here:

https://youtu.be/8_Q4LdwnaU0

## 📲 Download

You can download the latest Android build (APK) here:

[Download APK](https://drive.google.com/file/d/1L7RqT51nN7eYosCXBYh2c4eUPmgrgiLd/view?usp=sharing)


