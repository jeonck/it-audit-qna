
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables must be set.',
  );
  console.error('Please ensure your .env file is correctly set up.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newQuestion = {
  title: '취약점 분석과 모의 침투 테스트의 차이점은 무엇인가요?',
  content:
    '취약점 분석(Vulnerability Assessment)과 모의 침투 테스트(Penetration Testing)는 둘 다 시스템의 보안을 강화하기 위한 활동이지만, 목표와 접근 방식에 차이가 있습니다. 취약점 분석은 시스템에 알려진 보안 취약점이 있는지 스캔하고 목록화하는, 즉 "어떤 약점이 있는가"를 찾는 방어적인 접근입니다. 반면, 모의 침투 테스트는 발견된 취약점을 공격자가 실제로 악용하여 시스템에 침투할 수 있는지, 그리고 침투했을 때 어디까지 접근할 수 있는지를 확인하는, 즉 "그 약점으로 무엇을 할 수 있는가"를 검증하는 공격적인 접근입니다. 취약점 분석이 넓고 얕게 약점을 찾는다면, 모의 침투 테스트는 좁고 깊게 특정 공격 경로의 유효성을 검증합니다.',
  author: 'Security Analyst',
  tags: ['취약점 분석', '모의 침투 테스트', '보안 테스팅'],
  answers: [
    {
      author: '주니어 감사인',
      content:
        '명확한 설명 감사합니다. 이제 두 용어를 혼용하지 않고 정확하게 보고서에 기재할 수 있겠어요.',
    },
  ],
};

async function addQuestion() {
  console.log(`Inserting new question: "${newQuestion.title}"`);

  const { answers, ...questionData } = newQuestion;

  // Insert question
  const { data: insertedQuestion, error: questionError } = await supabase
    .from('questions')
    .insert(questionData)
    .select()
    .single();

  if (questionError) {
    console.error(`Error inserting question:`, questionError);
    return;
  }

  if (answers && answers.length > 0) {
    const answersWithQuestionId = answers.map((ans) => ({
      ...ans,
      question_id: insertedQuestion.id,
    }));

    // Insert answers
    const { error: answerError } = await supabase.from('answers').insert(answersWithQuestionId);

    if (answerError) {
      console.error(`Error inserting answers for the question:`, answerError);
    }
  }

  console.log('New question and its answers were added successfully!');
}

addQuestion();
