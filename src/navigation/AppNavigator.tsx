import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '@/utils/theme';
import { selectIsAuthenticated } from '@/store/slices/userSlice';
import type { 
  RootStackParamList, 
  MainTabParamList, 
  CollectionStackParamList, 
  BattleStackParamList 
} from '@/types';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import CollectionScreen from '@/screens/CollectionScreen';
import ScanScreen from '@/screens/ScanScreen';
import BattleScreen from '@/screens/BattleScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import LoginScreen from '@/screens/LoginScreen';
import MiniatureDetailScreen from '@/screens/MiniatureDetailScreen';
import BattleSetupScreen from '@/screens/BattleSetupScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const CollectionStack = createStackNavigator<CollectionStackParamList>();
const BattleStackNavigator = createStackNavigator<BattleStackParamList>();

const CollectionStackComponent: React.FC = () => (
  <CollectionStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <CollectionStack.Screen 
      name="CollectionMain" 
      component={CollectionScreen}
      options={{ title: 'My Miniatures' }}
    />
    <CollectionStack.Screen 
      name="MiniatureDetail" 
      component={MiniatureDetailScreen}
      options={{ title: 'Miniature Details' }}
    />
  </CollectionStack.Navigator>
);

const BattleStackComponent: React.FC = () => (
  <BattleStackNavigator.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <BattleStackNavigator.Screen 
      name="BattleMain" 
      component={BattleScreen}
      options={{ title: 'Battle' }}
    />
    <BattleStackNavigator.Screen 
      name="BattleSetup" 
      component={BattleSetupScreen}
      options={{ title: 'Battle Setup' }}
    />
  </BattleStackNavigator.Navigator>
);

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Collection':
            iconName = 'view-module';
            break;
          case 'Scan':
            iconName = 'qr-code-scanner';
            break;
          case 'Battle':
            iconName = 'gavel';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        paddingBottom: 20,
        paddingTop: 12,
        height: 85,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen 
      name="Collection" 
      component={CollectionStackComponent}
      options={{ title: 'My Miniatures' }}
    />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Battle" component={BattleStackComponent} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <MainTabs /> : <AuthStack />;
};

export default AppNavigator; 