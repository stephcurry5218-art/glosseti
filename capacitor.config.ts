import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glosseti.app',
  appName: 'Glosseti',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2400,
      launchAutoHide: false,
      launchFadeOutDuration: 600,
      backgroundColor: '#0F0B09',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
      splashFullScreen: true,
    },
    GoogleAuth: {
      iosClientId: '397756734481-noqav0d4im5v9r8bkrgqntrcucn9u5po.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      serverClientId: '397756734481-noqav0d4im5v9r8bkrgqntrcucn9u5po.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
