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

    console.log('Saving journal entry (local only):', { mood, entryText });

    // We’ll replace this console.log with a real Supabase insert in the next step
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
        onPress={() => {
          if (!mood) {
            setStatusMessage('Please select a mood before saving.');
            return;
          }
          if (!entryText.trim()) {
            setStatusMessage('Please write something before saving.');
            return;
          }

          console.log('Saving journal entry:', { mood, entryText });

          setStatusMessage('Entry saved (locally for now).');
          setEntryText('');
          setMood(null);
        }}
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
