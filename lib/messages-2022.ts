import type { Conversation, Message } from './timelines'

type Line = [from: 'me' | 'them', text: string, extra?: Partial<Message>]

function day(date: string, ...lines: Line[]): Message[] {
  return lines.map(([from, text, extra]) => ({ from, text, date, ...extra }))
}

const FATHER: Conversation = {
  id: 'father',
  name: '아버지',
  color: '#64748b',
  messages: [
    ...day('2022-05-27', ['me', '네 그럴게요']),
    ...day(
      '2022-05-28',
      ['them', '아빠 합숙 다녀올게'],
      ['them', '카드는 식탁에 뒀고, 늘 고맙다 아들.'],
      ['them', '별 일 없지'],
      ['me', '네'],
    ),
  ],
}

const SUHO: Conversation = {
  id: 'suho',
  name: '안수호',
  color: '#3b82f6',
  messages: [
    ...day('2022-06-06', ['them', '연시은. 나 안수호. 번호 저장해라']),
    ...day('2022-06-08', ['them', '손은 괜찮냐'], ['me', '어'], ['them', '내일 보자']),
    ...day(
      '2022-06-12',
      ['me', '어디서 볼래'],
      ['them', '당구장'],
      ['me', '수행평가를 무슨 당구장에서 해'],
      ['them', '형이 다음에는 안 봐준다. 담에는 고잡 콜?'],
    ),
    ...day('2022-06-14', ['them', '시은씨. 별 일 없지?'], ['me', '어'], ['them', '나한테는 안 물어봐?']),
    ...day(
      '2022-06-15',
      ['them', '어디냐 먼저 밥먹으러 갔냐'],
      ['me', '응 너 자길래 범석이랑 왔어'],
      ['them', '와…배신자…'],
      ['them', '거기에 꼼짝말고 있어라 바로 튀어갈꺼니까'],
      ['me', '지금 나왔는데?'],
      ['them', '아씨 기다려!!'],
    ),
    ...day(
      '2022-06-17',
      ['me', '서울 노원구 상계로 17-1 2층 단독주택 파란대문'],
      ['me', '주소 맞으면 답장해 아무 말이나'],
      ['them', '아 집이 예쁘네. 파란 대문. 저게 코발트 블루인가? 예쁘네', { voice: '0:13' }],
    ),
    ...day(
      '2022-06-18',
      ['me', '퇴원했어?'],
      ['them', '어. 형 튼튼하지?'],
      ['me', '너는 거기 오지 말았어야 했어', { failed: true }],
      ['me', '잘 쉬고 월요일에 보자'],
    ),
    ...day(
      '2022-06-20',
      ['them', '야'],
      ['them', '야'],
      ['them', '어이 시은씨'],
      ['them', '뭐해'],
      ['me', '공부'],
      ['them', '이 시간까지?'],
      ['me', '어. 학원 숙제 해야 해'],
      ['them', '나 심심한데 통화 해도 돼?'],
    ),
    ...day(
      '2022-06-23',
      ['them', '야!! 밥먹으러 갈 때 나 깨우라고 했지'],
      ['me', '깨웠는데 너가 안일어났어'],
      ['them', '치사하다 치사해'],
      ['me', '진짜야'],
    ),
    ...day(
      '2022-06-26',
      ['them', '형이 데리러 갈까?'],
      ['me', '됐어'],
      ['them', '됐기는. 동백아파트 밑에서 딱 기다려'],
    ),
    ...day(
      '2022-06-28',
      ['me', '마음에 담지 마'],
      ['them', '형 걱정되냐?'],
      ['me', '응'],
      ['them', '얼른 자기나 해'],
    ),
    ...day('2022-07-01', ['them', '시은아 오늘 특강 맞지?'], ['me', '응 맞아'], ['me', '왜?']),
    ...day(
      '2022-07-04',
      ['me', '다리 진짜 괜찮은 거 맞아?'],
      ['them', '껌이지 내일이면 다 나을걸?'],
      ['me', '오토바이 안 타면 안 돼?', { failed: true }],
    ),
    ...day(
      '2022-07-09',
      ['me', '영이 먼저 만났어'],
      ['them', '야 어디야'],
      ['them', '언제 와'],
      ['them', '왜 전화도 안받냐'],
    ),
    ...day(
      '2022-07-11',
      ['me', '집에 일이 생겨서 당분간 학교 못 가'],
      ['them', '무슨일?'],
      ['me', '나중에 말해줄게 기말고사때는 갈 거야'],
    ),
  ],
}

const YOUNGI: Conversation = {
  id: 'youngi',
  name: '영이',
  color: '#ec4899',
  messages: [
    ...day('2022-06-16', ['me', 'XX카페에서 보자']),
    ...day('2022-06-17', ['them', '일단 망우동 쪽으로 와 너 친구들도 거기 있는 거 같아'], ['me', '응 알겠어']),
    ...day('2022-06-26', ['me', '어디쯤 왔어?']),
    ...day(
      '2022-07-08',
      ['them', '내일 뭐 먹을까?'],
      ['me', '피자랑 치킨이랑 미역국'],
      ['them', '미역국도 팔아?'],
      ['me', '내가 만들거야'],
      ['them', '그런 것도 할 줄 알아?'],
    ),
  ],
}

const BEOMSEOK: Conversation = {
  id: 'beomseok',
  name: '오범석',
  color: '#10b981',
  messages: [
    ...day('2022-06-12', ['them', '시은아 도착했어?'], ['me', '어. 다 왔어']),
    ...day('2022-06-17', ['me', '범석아 잘 들어갔어?'], ['them', '응']),
  ],
}

const lastDate = (c: Conversation) => c.messages[c.messages.length - 1]?.date ?? ''

export const MESSAGES_2022: Conversation[] = [FATHER, SUHO, YOUNGI, BEOMSEOK].sort((a, b) =>
  lastDate(b).localeCompare(lastDate(a)),
)
