import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lucasaalira.aisecuritylab',
  appName: 'AI Security Lab',
  webDir: 'dist',
  plugins: { SystemBars: { insetsHandling: 'native', style: 'DARK' } }
};

export default config;
