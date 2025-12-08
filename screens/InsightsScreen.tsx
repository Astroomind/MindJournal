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


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Insights 📊</Text>
      <Text>AI-based mood and journaling insights will show here.</Text>
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
