import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glosseti.app',
  appName: 'Glosseti',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
