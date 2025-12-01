import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://uywhlldwfnlyebndtwzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2hsbGR3Zm5seWVibmR0d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzkwNDIsImV4cCI6MjA4MDA1NTA0Mn0.JxMxO8VpRF4pR82ODcZNAGBTFd146epl4wpR9xtvClg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});