import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.apprevista.app',
  appName: 'App Revista',
  webDir: 'www',
  server: {
    url: 'https://apprevista.com.br',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'apprevista.com.br',
      '*.apprevista.com.br',
      'auth.appgroupbrasil.com.br',
    ],
  },
  android: {
    backgroundColor: '#1E3A5F',
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    backgroundColor: '#1E3A5F',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1E3A5F',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1E3A5F',
    },
  },
};

export default config;
