import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button } from 'react-native-paper';

import { colors, spacing, typography } from '../utils/theme';
import { loginSuccess } from '../store/slices/userSlice';
import type { User } from '../types';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate login for demo purposes
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        username: 'DragonSlayer',
        email: email,
      };
      
      const mockToken = 'mock-jwt-token';
      
      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      setIsLoading(false);
    }, 1000);
  };

  const handleGuestLogin = (): void => {
    const guestUser: User = {
      id: 'guest',
      username: 'Guest Adventurer',
      email: 'guest@example.com',
    };
    
    dispatch(loginSuccess({ user: guestUser, token: 'guest-token' }));
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.title}>D&D Miniature Arena</Text>
          <Text style={styles.subtitle}>
            Collect, Battle, and Conquer with your miniatures
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{
              colors: {
                primary: colors.primary,
                outline: colors.border,
                background: colors.surface,
                onSurface: colors.text,
              },
            }}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{
              colors: {
                primary: colors.primary,
                outline: colors.border,
                background: colors.surface,
                onSurface: colors.text,
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
            buttonColor={colors.primary}
            textColor={colors.background}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Start Your Adventure</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>📱 Scan QR codes to collect miniatures</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>⚔️ Battle friends with D&D 5e rules</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🏆 Build your legendary collection</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  guestButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  features: {
    alignItems: 'center',
  },
  featuresTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureItem: {
    marginBottom: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoginScreen; 