import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from '../App';

// Fix for web platform
if (Platform.OS === 'web') {
  // Add polyfills or web-specific code here
  console.log('Running on web platform');
}

// Register the main component
registerRootComponent(App); 