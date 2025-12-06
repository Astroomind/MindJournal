import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';


export default function JournalScreen() {
   const [entryText, setEntryText] = useState('');
   const [mood, setMood] = useState<number | null>(null);
   const [statusMessage, setStatusMessage] = useState<string | null>(null);

     const handleSave = async () => {
    if (!mood) {
      setStatusMessage('Please select a mood before saving.');
      return;
    }

    if (!entryText.trim()) {
      setStatusMessage('Please write something before saving.');
      return;
    }

    setStatusMessage('Saving entry...');

        const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.log('Error getting user:', userError);
      setStatusMessage('Could not check user status. Please try again.');
      return;
    }

    if (!userData.user) {
      setStatusMessage('Please sign in before saving your journal.');
      return;
    }
      const { error: profileError } = await supabase.from('profiles').upsert({
    id: userData.user.id,
  });

  if (profileError) {
    console.log('Error ensuring profile exists:', profileError);
    setStatusMessage('There was a problem preparing your profile. Please try again.');
    return;
  }


        const { error: insertError } = await supabase.from('journal_entries').insert({
      user_id: userData.user.id,
      content: entryText,
      mood: mood,
      // entry_date will be auto-generated from created_at in your SQL
    });

    if (insertError) {
      console.log('Error inserting journal entry:', insertError);
      setStatusMessage('There was a problem saving your entry. Please try again.');
      return;
    }

        setStatusMessage('Entry saved to your journal ✅');
    setEntryText('');
    setMood(null);

  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Today’s Journal</Text>

      <Text style={styles.date}>
        {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

            <Text style={styles.sectionLabel}>How are you feeling?</Text>

      <View style={styles.moodRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.moodButton,
              mood === value && styles.moodButtonSelected,
            ]}
            onPress={() => setMood(value)}
          >
            <Text style={styles.moodText}>
              {value === 1 && '😔'}
              {value === 2 && '😕'}
              {value === 3 && '😐'}
              {value === 4 && '🙂'}
              {value === 5 && '😄'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

            {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}

      <Text style={styles.sectionLabel}>Your thoughts</Text>

      <TextInput
        style={styles.entryInput}
        placeholder="Write anything that’s on your mind..."
        multiline
        textAlignVertical="top"
        value={entryText}
        onChangeText={setEntryText}
      />

     <TouchableOpacity
  style={styles.saveButton}
  onPress={handleSave}
>
  <Text style={styles.saveButtonText}>Save Entry</Text>
</TouchableOpacity>


    </ScrollView>
  );
}


const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginBottom: 8,
  },
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
    sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  moodText: {
    fontSize: 24,
  },
  status: {
    marginBottom: 8,
    color: '#16a34a', // green-ish
  },
  entryInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },


});
