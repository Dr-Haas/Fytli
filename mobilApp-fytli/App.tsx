import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  DashboardScreen,
  ProgramsListScreen,
  ProgramDetailScreen,
  FeedScreen,
  DailyCardScreen,
  ProfileScreen,
  FriendProfileScreen,
  WorkoutScreen,
  SessionSummaryScreen,
  LockedFeedScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation bottom tabs (barre du bas)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF7948',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="Programs" 
        component={ProgramsListScreen}
        options={{
          tabBarLabel: 'Programmes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💪</Text>,
        }}
      />
      <Tab.Screen 
        name="FeedTab" 
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔥</Text>,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Navigation principale avec authentification
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen navigation={undefined} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // Routes non authentifiées
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Routes authentifiées
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen 
            name="ProgramDetail" 
            component={ProgramDetailScreen}
            options={{
              headerShown: true,
              title: 'Programme',
              headerStyle: { backgroundColor: '#FBFAF7' },
              headerTintColor: '#4A2E20',
            }}
          />
          <Stack.Screen 
            name="Feed" 
            component={FeedScreen}
            options={{
              headerShown: true,
              title: 'Mon Cercle',
              headerStyle: { backgroundColor: '#FBFAF7' },
              headerTintColor: '#4A2E20',
            }}
          />
          <Stack.Screen 
            name="LockedFeed" 
            component={LockedFeedScreen}
            options={{
              headerShown: true,
              title: 'Mon Cercle',
              headerStyle: { backgroundColor: '#FBFAF7' },
              headerTintColor: '#4A2E20',
            }}
          />
          <Stack.Screen 
            name="DailyCard" 
            component={DailyCardScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Mon Profil',
              headerStyle: { backgroundColor: '#FBFAF7' },
              headerTintColor: '#4A2E20',
            }}
          />
          <Stack.Screen name="FriendProfile" component={FriendProfileScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="SessionSummary" component={SessionSummaryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

