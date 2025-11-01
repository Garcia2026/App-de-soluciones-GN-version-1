import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.solucionesgn.jardineria',
  appName: 'GN Jardinería',
  webDir: 'out', // Next.js usa 'out' para static export
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'sistemasolucionesgn.web.app', // Tu dominio Firebase
    // allowNavigation: ['sistemasolucionesgn.web.app', 'firebase.google.com'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2d5016",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#2d5016",
    },
    Keyboard: {
      resize: "ionic"
    }
  }
};

export default config;
