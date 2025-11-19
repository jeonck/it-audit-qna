import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertQuestion(title, content, author) {
  const { data, error } = await supabase
    .from('questions')
    .insert([
      { title, content, author },
    ])
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully:', data);
  }
}

// Example usage:
// node scripts/insert_question.js "새로운 질문 제목" "새로운 질문 내용" "새로운 작성자"
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node scripts/insert_question.js "<title>" "<content>" "<author>"');
  process.exit(1);
}

const title = args[0];
const content = args[1];
const author = args[2];

insertQuestion(title, content, author);
