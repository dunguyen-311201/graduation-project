# SOS mobile app (Expo)

React Native app for raising and handling rescue requests. Built with Expo SDK 58
(React Native 0.88, React 19) using a **development build** (`expo-dev-client`),
not Expo Go, because React Native Firebase and Google Maps need native code.
See [ADR-0014](../docs/04-adr/0014-expo-dev-client.md).

## Setup

1. Install Node 22 and Android Studio (SDK + an emulator), then run `npm install`.
2. Copy `.env.example` to `.env` and fill in `EXPO_PUBLIC_API_URL` and
   `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. Download `google-services.json` for the Android app `com.sosapp` from the
   Firebase console and put it next to this README (it is git-ignored).
4. Build and install the dev client once: `npm run android`.
   This runs `expo prebuild` (generates `android/`, which is git-ignored) and Gradle.
5. Afterwards, day-to-day work only needs `npm start`.

Rebuild the dev client (`npm run android`) whenever you add a native package or
change `app.config.ts`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm start` | Metro for the dev client |
| `npm run android` | Prebuild + build + install on the emulator/device |
| `npm run prebuild` | Regenerate native folders from `app.config.ts` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run doctor` | `expo-doctor` dependency checks |

## Cloud builds (EAS)

`npx eas-cli build --profile development --platform android` builds the dev
client in the cloud. Upload `google-services.json` as an EAS file environment
variable named `GOOGLE_SERVICES_JSON`; `app.config.ts` reads it.

## Notes

- Firebase uses the modular API (`getFirestore`, `doc`, `onSnapshot`, ...);
  instances live in `src/services/firebase.ts`.
- Writes that change business state are moving to the NestJS API
  (`services/api`, ADR-0011) and go through `callAPI` in `src/services/api.ts`.
- Avatar upload uses Firebase Storage, which needs the Blaze plan.
