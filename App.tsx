import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react'; // This line imports two named exports from the react library.
import { View, ActivityIndicator } from 'react-native';
import AuthScreen from './screens/AuthScreen';
import { supabase } from './lib/supabase';

import HomeScreen from './screens/HomeScreen';
import JournalScreen from './screens/JournalScreen';
import HistoryScreen from './screens/HistoryScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsSignedIn(!!data.user);
    };
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setIsSignedIn(!!session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  if (isSignedIn === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        </View>
   )
 }
  if (isSignedIn == false) {
    return <AuthScreen />;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
