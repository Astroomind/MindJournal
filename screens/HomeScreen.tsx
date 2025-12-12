import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';


export default function HomeScreen() {
  const todaysPrompt = "Whats one thing you learned about yourself today?";
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSavePromptAnswer = async () => {
  if (!answerText.trim()) {
    setStatusMessage('Please write an answer before saving.');
    return;
  }

  setSaving(true);
  setStatusMessage(null);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log('Error getting user in home prompt:', userError);
    setStatusMessage('Could not check user status. Please try again.');
    setSaving(false);
    return;
  }

  if (!userData.user) {
    setStatusMessage('Please sign in to save your answer.');
    setSaving(false);
    return;
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userData.user.id,
  });

  if (profileError) {
    console.log('Error ensuring profile exists from home:', profileError);
    setStatusMessage('There was a problem preparing your profile. Please try again.');
    setSaving(false);
    return;
  }

  const { error: insertError } = await supabase.from('journal_entries').insert({
    user_id: userData.user.id,
    content: answerText,
    mood: null, // no mood from this flow (we can add later)
    source: 'ai_prompt',
    prompt_text: todaysPrompt,
  });

  if (insertError) {
    console.log('Error inserting prompt entry:', insertError);
    setStatusMessage('There was a problem saving your answer. Please try again.');
    setSaving(false);
    return;
  }

  setStatusMessage('Your answer has been saved to your journal ✅');
  setAnswerText('');
  setIsAnswering(false);
  setSaving(false);
};

  return (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Welcome back 👋</Text>

    <View style={styles.promptCard}>
  <Text style={styles.promptLabel}>Today’s prompt</Text>
  <Text style={styles.promptText}>{todaysPrompt}</Text>

  {!isAnswering && (
    <TouchableOpacity
      style={styles.promptButton}
      onPress={() => {
        setIsAnswering(true);
        setStatusMessage(null);
      }}
    >
      <Text style={styles.promptButtonText}>Answer this prompt</Text>
    </TouchableOpacity>
  )}

  {isAnswering && (
    <View style={styles.answerSection}>
      <TextInput
        style={styles.answerInput}
        placeholder="Write your answer here..."
        multiline
        textAlignVertical="top"
        value={answerText}
        onChangeText={setAnswerText}
      />

      <TouchableOpacity
        style={[styles.promptButton, saving && styles.promptButtonDisabled]}
        onPress={handleSavePromptAnswer}
        disabled={saving}
      >
        <Text style={styles.promptButtonText}>
          {saving ? 'Saving...' : 'Save answer'}
        </Text>
      </TouchableOpacity>
    </View>
  )}

  {statusMessage && (
    <Text style={styles.status}>{statusMessage}</Text>
  )}
</View>

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
  promptCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  promptLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  promptButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  promptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  answerSection: {
  marginTop: 12,
},
answerInput: {
  minHeight: 100,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  padding: 10,
  fontSize: 16,
  marginBottom: 8,
  backgroundColor: '#ffffff',
},
promptButtonDisabled: {
  opacity: 0.6,
},
status: {
  marginTop: 8,
  fontSize: 14,
  color: '#16a34a',
},

});
