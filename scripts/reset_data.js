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
  console.error('Please create a .env file in the root of your project with these values.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newQuestions = [
  {
    title: 'SOC 2 보고서의 Type 1과 Type 2의 주요 차이점은 무엇인가요?',
    content:
      'SOC 2(System and Organization Controls 2) 보고서에는 Type 1과 Type 2의 두 가지 주요 유형이 있습니다. 이 둘의 근본적인 차이점은 평가 시점과 관련이 있습니다. Type 1 보고서는 특정 시점(a point in time)에 조직의 시스템 및 통제가 설계의 적절성을 충족하는지를 평가합니다. 반면, Type 2 보고서는 특정 기간(usually 6-12 months) 동안 해당 통제가 효과적으로 운영되었는지를 평가합니다. 따라서 Type 2 보고서가 통제의 실제 운영 효과성에 대한 더 높은 수준의 보증을 제공합니다.',
    author: '감사 전문가',
    tags: ['SOC 2', '컴플라이언스', '보고서'],
    answers: [
      {
        author: '신입 감사인',
        content',
          '설계의 적절성과 운영의 효과성 차이군요. 고객에게 설명할 때 Type 2가 더 신뢰도가 높다고 말할 수 있겠네요. 감사합니다!',
      },
    ],
  },
  {
    title: '웹 애플리케이션 감사 중 SQL 인젝션 취약점은 어떻게 테스트하나요?',
    content:
      'SQL 인젝션(SQL Injection)은 가장 흔하면서도 치명적인 웹 취약점 중 하나입니다. 감사 시 테스트하는 방법은 크게 두 가지로 나뉩니다. 첫째, 자동화된 도구(예: OWASP ZAP, Burp Suite)를 사용하여 일반적인 패턴을 스캔하는 방법이 있습니다. 둘째, 수동 테스트로, 입력 필드에 특수문자(\'", \"--, ;\')나 논리 구문(OR 1=1)을 직접 입력하여 애플리케이션의 반응을 분석합니다. 예를 들어, 로그인 폼의 사용자 이름 필드에 \' OR \'1\'=\'1\' -- 을 입력했을 때 인증을 우회하고 로그인이 성공한다면 취약점이 존재한다고 볼 수 있습니다. 이 과정에서 데이터베이스 오류 메시지가 외부에 노출되는지도 중요한 점검 항목입니다.',
    author: '보안 컨설턴트',
    tags: ['웹 보안', '취약점 분석', 'SQL 인젝션'],
    answers: [
      {
        author: '개발자',
        content',
          '수동 테스트 예시가 도움이 되었습니다. 저희 애플리케이션에 바로 적용해서 테스트해봐야겠습니다.',
      },
      {
        author: '감사 주니어',
        content',
          '자동화된 도구와 수동 테스트를 병행하는 것이 중요하군요. 두 가지 방법 모두 보고서에 포함해야겠습니다.',
      },
    ],
  },
  {
    title: 'IT 감사에서 COBIT 프레임워크의 역할은 무엇인가요?',
    content:
      'COBIT(Control Objectives for Information and Related Technologies)은 IT 거버넌스 및 관리를 위한 세계적으로 인정받는 프레임워크입니다. IT 감사에서 COBIT의 주요 역할은 감사의 기준점(benchmark)을 제공하는 것입니다. COBIT은 비즈니스 목표와 IT 프로세스를 연결하고, 각 프로세스에 대한 통제 목표를 정의합니다. 감사인은 이를 활용하여 조직의 IT 프로세스가 비즈니스 요구사항을 충족하고, 관련 법규를 준수하며, 리스크를 적절히 관리하고 있는지 체계적으로 평가할 수 있습니다. 즉, COBIT은 "무엇을" 감사해야 하고 "왜" 감사해야 하는지에 대한 명확한 가이드를 제공합니다.',
    author: 'IT 감사 총괄',
    tags: ['COBIT', 'IT 거버넌스', '프레임워크'],
    answers: [],
  },
  {
    title: '클라우드 환경(AWS)에서 사용자 접근 통제 감사를 위한 핵심 절차는 무엇인가요?',
    content',
      'AWS 환경에서 사용자 접근 통제를 감사할 때 몇 가지 핵심 절차가 있습니다. 첫째, IAM(Identity and Access Management) 정책을 검토하여 "최소 권한의 원칙(Principle of Least Privilege)"이 잘 지켜지고 있는지 확인합니다. 사용자와 그룹에 과도한 권한이 부여되지 않았는지 분석해야 합니다. 둘째, MFA(Multi-Factor Authentication)가 루트 계정 및 모든 IAM 사용자에 대해 활성화되어 있는지 확인합니다. 셋째, CloudTrail 로그를 분석하여 비정상적인 API 호출이나 권한 상승 시도가 있었는지 모니터링합니다. 마지막으로, 정기적으로 IAM Access Analyzer 결과를 검토하여 외부 엔터티와 공유된 리소스가 있는지 확인하고 불필요한 공유를 제거해야 합니다.',
    author: '클라우드 보안 전문가',
    tags: ['클라우드', 'AWS', '접근 통제', '보안 감사'],
    answers: [
      {
        author: '시스템 운영자',
        content',
          'MFA 적용과 CloudTrail 로그 분석이 특히 중요하겠네요. 체크리스트에 추가하겠습니다.'
      }
    ],
  },
];

async function resetData() {
  console.log('Deleting existing data...');

  // Delete all answers first due to foreign key constraints
  const { error: deleteAnswersError } = await supabase.from('answers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteAnswersError) {
    console.error('Error deleting answers:', deleteAnswersError);
    return;
  }
  console.log('All answers deleted.');

  // Delete all questions
  const { error: deleteQuestionsError } = await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteQuestionsError) {
    console.error('Error deleting questions:', deleteQuestionsError);
    return;
  }
  console.log('All questions deleted.');

  console.log('Inserting new data...');

  for (const q of newQuestions) {
    const { answers, ...questionData } = q;

    // Insert question
    const { data: insertedQuestion, error: questionError } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();

    if (questionError) {
      console.error(`Error inserting question "${q.title}":`, questionError);
      continue; // Skip to next question
    }

    if (answers && answers.length > 0) {
      const answersWithQuestionId = answers.map((ans) => ({
        ...ans,
        question_id: insertedQuestion.id,
      }));

      // Insert answers
      const { error: answerError } = await supabase.from('answers').insert(answersWithQuestionId);

      if (answerError) {
        console.error(`Error inserting answers for question "${q.title}":`, answerError);
      }
    }
  }

  console.log('Data reset completed successfully!');
}

resetData();
