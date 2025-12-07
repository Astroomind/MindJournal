import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setStatusMessage(null);

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error getting user in settings:', error);
        setStatusMessage('Could not load user info.');
        setLoading(false);
        return;
      }

      if (data.user) {
        setUserEmail(data.user.email ?? null);
      } else {
        setUserEmail(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

    const handleSignOut = async () => {
    setStatusMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log('Error signing out:', error);
      setStatusMessage('There was a problem signing out. Please try again.');
      setLoading(false);
      return;
    }

    setUserEmail(null);
    setStatusMessage('Signed out successfully.');
    setLoading(false);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {loading && <Text style={styles.info}>Checking your account...</Text>}

      {!loading && userEmail && (
        <View style={styles.block}>
          <Text style={styles.label}>Signed in as:</Text>
          <Text style={styles.value}>{userEmail}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !userEmail && (
        <Text style={styles.info}>You are not signed in.</Text>
      )}

      {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#4b5563',
  },
  block: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    marginTop: 16,
    fontSize: 14,
    color: '#16a34a',
  },
});

