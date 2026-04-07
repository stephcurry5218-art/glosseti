import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glosseti.app',
  appName: 'Glosseti',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: false,
      launchFadeOutDuration: 600,
      backgroundColor: '#0F0B09',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
      splashFullScreen: true,
    },
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#0F0B09',
  },
};

export default config;
