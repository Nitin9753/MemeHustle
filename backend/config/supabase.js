const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

if (supabaseUrl === 'https://example.supabase.co' || supabaseKey === 'your-supabase-key') {
  console.warn('Warning: Using placeholder Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY in .env file for production use.');
}

module.exports = supabase; 