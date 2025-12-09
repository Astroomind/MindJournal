import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

type JournalEntry = {
  id: string;
  mood: number | null;
  created_at: string;
};

export default function InsightsScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
          const fetchEntries = async () => {
      setLoading(true);
      setError(null);


      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.log('Error getting user in insights:', userError);
        setError('Could not check user status.');
        setLoading(false);
        return;
      }

      if (!userData.user) {
        setError('Please sign in to see insights.');
        setLoading(false);
        return;
      }

      const { data, error: entriesError } = await supabase
        .from('journal_entries')
        .select('id, mood, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (entriesError) {
        console.log('Error loading entries for insights:', entriesError);
        setError('There was a problem loading your data.');
      } else {
        setEntries(data || []);
      }

      setLoading(false);
    };
    fetchEntries();
  }, []);

    const totalEntries = entries.length;

  const moodValues = entries
    .map((entry) => entry.mood)
    .filter((mood): mood is number => mood !== null);

  const averageMood =
    moodValues.length > 0
      ? moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length
      : null;

  const lastEntryDate =
    entries.length > 0 ? new Date(entries[0].created_at) : null;



    return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Insights 📊</Text>

      {loading && <Text style={styles.info}>Crunching your data...</Text>}

      {!loading && error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && totalEntries === 0 && (
        <Text style={styles.info}>
          No entries yet. Start journaling to see insights here.
        </Text>
      )}

      {!loading && !error && totalEntries > 0 && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total entries</Text>
            <Text style={styles.cardValue}>{totalEntries}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Average mood</Text>
            <Text style={styles.cardValue}>
              {averageMood !== null ? averageMood.toFixed(1) + ' / 5' : 'N/A'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Most recent entry</Text>
            <Text style={styles.cardValue}>
              {lastEntryDate
                ? lastEntryDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
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
  error: {
    fontSize: 16,
    color: '#dc2626',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
});
