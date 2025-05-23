import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/utils/theme';
import type { ThemeColors } from './src/types';

const customTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4FC3F7', // Teal/Blue accent
    secondary: '#29B6F6', // Lighter blue
    tertiary: '#0277BD', // Darker blue
    surface: '#1B263B',
    background: '#0D1B2A',
    onSurface: '#ffffff',
    onBackground: '#ffffff',
  },
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={customTheme}>
          <NavigationContainer theme={theme}>
            <StatusBar 
              barStyle="light-content" 
              backgroundColor={customTheme.colors.background}
            />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App; 