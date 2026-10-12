import { StyleSheet, Text, View, Animated, Image, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import MainScreen from './src/screens/MainScreen';
import { store } from './src/redux/Store';
import React, { useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Define App as a named function component
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start visible
  const [sloganText, setSloganText] = useState('');
  const fullSlogan = "Give the gift of Life, Give Medicine";
  const [textColor, setTextColor] = useState('#01b3bd');

  // Typewriter effect
  useEffect(() => {
    if (showSplash) {
      setSloganText("");

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullSlogan.length) {
          setSloganText(fullSlogan.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showSplash]);

  // Initial setup
  useEffect(() => {
    async function prepare() {
      try {
        // Hide the native splash screen immediately
        await SplashScreen.hideAsync();

        // Wait for typewriter effect to finish (approx. length of text * 100ms)
        const typewriterDuration = fullSlogan.length * 100 + 500; // Add a little buffer

        // Wait for typewriter to finish
        await new Promise(resolve => setTimeout(resolve, typewriterDuration));

        // Now trigger the fade-out and transition
        finishSplashScreen();
      } catch (e) {
        console.warn("Error in splash screen:", e);
        // If there's an error, still try to move to the main app
        finishSplashScreen();
      }
    }

    prepare();
  }, []);

  // Function to handle transitioning to main app
  const finishSplashScreen = () => {
    console.log("Starting fade out animation");

    // Start fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      console.log("Fade out complete, setting appIsReady and showSplash");
      setAppIsReady(true);
      setShowSplash(false);
    });
  };

  // Debug the rendering condition
  useEffect(() => {
    console.log(`Render condition: appIsReady=${appIsReady}, showSplash=${showSplash}`);
  }, [appIsReady, showSplash]);

  // Render based on the app state
  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('./assets/gift-box(2).png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.sloganText, { color: textColor }]}>
          {sloganText}
        </Text>
      </Animated.View>
    );
  }

  // Main app screen
  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Set a background color
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 0,
  },
  sloganText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    width: width * 0.8,
  }
});

// Export the component
export default App;