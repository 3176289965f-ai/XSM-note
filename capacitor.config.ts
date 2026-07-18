import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.premiumnote.app',
  appName: 'Premium Notes',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // We can add Capacitor core plugins here for deep native API access if needed
  }
};

export default config;
