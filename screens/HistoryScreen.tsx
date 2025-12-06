import { useState, useEffect } from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

type JournalEntry = {
  id: string;
  content: string;        
  mood: number | null;
  created_at: string;
};


export default function HistoryScreen() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>History 📜</Text>
      <Text>Here you’ll see your past entries.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 8,
  },
});
