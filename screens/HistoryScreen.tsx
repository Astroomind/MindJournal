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

      useEffect(() => {
            const fetchEntries = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.log('Error getting user in history screen:', userError);
        setError('Could not check user status.');
        setLoading(false);
        return;
      }

      if (!userData.user) {
        setError('Please sign in to view your history.');
        setLoading(false);
        return;
      }

      const { data, error: entriesError } = await supabase
        .from('journal_entries')
        .select('id, content, mood, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (entriesError) {
        console.log('Error loading entries:', entriesError);
        setError('There was a problem loading your entries.');
      } else {
        setEntries(data || []);
      }

      setLoading(false);
    };
        fetchEntries();

    
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Journal History</Text>

      {loading && <Text style={styles.info}>Loading entries...</Text>}

      {!loading && error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && entries.length === 0 && (
        <Text style={styles.info}>You don’t have any entries yet.</Text>
      )}

      {!loading && !error && entries.length > 0 && (
        <ScrollView style={styles.list}>
          {entries.map((entry) => (
            <TouchableOpacity key={entry.id} style={styles.entryCard}>
              <Text style={styles.entryDate}>
                {new Date(entry.created_at).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.entryMood}>
                {entry.mood ? `Mood: ${entry.mood}/5` : 'Mood: N/A'}
              </Text>
              <Text
                style={styles.entrySnippet}
                numberOfLines={3}
              >
                {entry.content}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  error: {
    fontSize: 16,
    color: '#dc2626', // red-ish
    marginTop: 8,
  },
  list: {
    marginTop: 12,
  },
  entryCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  entryDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  entryMood: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  entrySnippet: {
    fontSize: 16,
    color: '#111827',
  },
});

