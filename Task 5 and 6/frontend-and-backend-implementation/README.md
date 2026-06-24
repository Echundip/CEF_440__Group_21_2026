# Adaptive E-Learning Platform

A mobile e-learning application that adapts content delivery (HD video → SD video → audio → text)
based on real-time **Quality of Experience (QoE)** so students in bandwidth-constrained
environments never miss a lesson.

> CEF 440 — Group 21 — University of Buea. Built with **React Native + Expo (TypeScript)**.

## Features (Task 5 — UI Implementation)

The app is organized into three areas: **Authentication**, **Student**, and **Instructor**, plus the
**QoE** innovation module.

| # | Screen | Area |
|---|--------|------|
| 1 | Splash | Auth |
| 2 | Welcome | Auth |
| 3 | Login (role-aware) | Auth |
| 4 | Register (role-aware) | Auth |
| 5 | Student Dashboard | Student |
| 6 | Course List (search + filter) | Student |
| 7 | Course Details (Videos / Notes / Quizzes tabs) | Student |
| 8 | **Learning Screen + QoE Status Card** (video / audio / text adaptive modes) | Student |
| 9 | Downloads (offline) | Student |
| 10 | Student Profile (data-saver preferences) | Student |
| 11 | QoE Monitoring (bandwidth / latency / packet loss + charts) | QoE |
| 12 | Instructor Dashboard | Instructor |
| 13 | Upload Content | Instructor |
| 14 | Create Course | Instructor |
| 15 | Manage Courses | Instructor |
| 16 | Analytics (participation, completion, network issues) | Instructor |

The **Learning Screen** is the centerpiece: it shows the QoE status card and automatically switches
between **HD Video → SD Video → Audio Only → Text/Notes** as the network degrades. A demo "Simulate
network" control (Good / Moderate / Poor) lets you watch the adaptive behavior live.

## Tech Stack

- React Native `0.85` via **Expo SDK 56**
- **expo-router**-free navigation using **React Navigation** (native-stack + bottom-tabs)
- TypeScript (strict)
- `@expo/vector-icons` (Ionicons)

## Getting Started

> Works on Windows, macOS and Linux. Requires **Node.js ≥ 22.13** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start
```

Then:

- Press **`a`** to open the **Android** emulator (requires Android Studio / an AVD).
- Press **`w`** to open in the **web** browser.
- Or scan the QR code with the **Expo Go** app on your phone.

### Useful scripts

```bash
npm run android     # start on Android
npm run web         # start in the browser
npm run typecheck   # TypeScript type check
```

## Project Structure

```
App.tsx                     # Root: providers + navigation container
index.ts                    # Expo entry point
src/
  components/               # Reusable UI (Card, AppButton, QoEStatusCard, ...)
  context/QoEContext.tsx    # Shared, simulatable network/QoE state
  data/                     # Mock data, domain types, QoE helpers
  navigation/              # Root stack + Student/Instructor tab navigators
  screens/
    auth/                  # Splash, Welcome, Login, Register
    student/               # Dashboard, Courses, Details, Learning, Downloads, Profile, QoE
    instructor/            # Dashboard, Upload, Create, Manage, Analytics
  theme/                   # Colors (deep navy), spacing, typography
```

## Notes

- Authentication is mocked for this UI milestone — the Login/Register screens route to the Student or
  Instructor experience based on the selected role. The backend (Firebase, per Task 3/4) is not wired
  up yet.
- All data is mock data in `src/data/mock.ts`.
