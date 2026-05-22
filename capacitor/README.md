# App Revista — Wrapper Capacitor (Android/iOS)

Empacota o site `https://apprevista.com.br` num app nativo. O Capacitor abre o site
direto no webview — toda a UI/UX é a mesma do web.

## Setup inicial (uma vez)

```bash
cd capacitor
npm install
npx cap add android
# (opcional) ios — requer Mac + Xcode
# npx cap add ios
```

Depois de `cap add android`, os arquivos do projeto Android ficam em `capacitor/android/`.

## Build do APK (debug)

```bash
cd capacitor
npm run sync           # injeta capacitor.config.ts no Android
npm run open:android   # abre Android Studio
# OU via CLI:
cd android
./gradlew assembleDebug
# APK em capacitor/android/app/build/outputs/apk/debug/app-debug.apk
```

## Build do AAB para Play Store

```bash
cd capacitor
npm run build:bundle
# AAB em capacitor/android/app/build/outputs/bundle/release/app-release.aab
```

Antes do release, assine com sua keystore (mesma `voxia-release.jks` ou nova):

1. Edite `capacitor/android/app/build.gradle` adicionando o `signingConfigs`.
2. Configure `~/.gradle/gradle.properties` com `RELEASE_STORE_FILE`, `RELEASE_KEY_ALIAS`,
   `RELEASE_STORE_PASSWORD`, `RELEASE_KEY_PASSWORD`.

## Trocar ícone e splash

Coloque os PNGs em `capacitor/resources/icon.png` (1024×1024) e
`capacitor/resources/splash.png` (2732×2732), depois:

```bash
npm install -D @capacitor/assets
npx @capacitor/assets generate --android
```

## Atualizar app sem republicar

Como o webview aponta para `https://apprevista.com.br`, qualquer mudança no site
**aparece automaticamente** no app instalado. Só precisa republicar o app quando:

- Trocar ícone, splash ou nome
- Mudar `appId` ou permissões nativas
- Atualizar plugins do Capacitor

## Identificadores

- `appId`: `br.com.apprevista.app`
- `appName`: `App Revista`
- URL embutida: `https://apprevista.com.br`
