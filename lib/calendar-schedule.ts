import type { CalendarCategory, CalendarEvent } from './timelines'

const toId = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function eachDay(from: string, to: string, fn: (date: Date, id: string) => void) {
  const [fy, fm, fd] = from.split('-').map(Number)
  const [ty, tm, td] = to.split('-').map(Number)
  const end = new Date(ty, tm - 1, td)
  for (let d = new Date(fy, fm - 1, fd); d <= end; d.setDate(d.getDate() + 1)) {
    fn(d, toId(d))
  }
}

/** 2023~2024년 일정 (1차 2024.12.31 기준 캘린더) */
export function buildSchedule2024(): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const add = (date: string, title: string, category: CalendarCategory, canceled = false) =>
    events.push({ date, title, category, ...(canceled && { canceled }) })
  const range = (from: string, to: string, title: string, category: CalendarCategory) =>
    eachDay(from, to, (_, id) => add(id, title, category))

  // 2023
  add('2023-10-21', '병원', 'hospital')
  add('2023-11-04', '교외봉사', 'school')
  add('2023-11-15', '싱가포르 비행기/유학', 'plan', true)
  add('2023-11-24', 'D-DAY', 'plan')
  range('2023-12-11', '2023-12-15', '기말고사', 'exam')
  add('2023-12-31', '수호와 카운트다운 보기', 'plan')

  // 2024
  for (const date of ['2024-03-08', '2024-05-08', '2024-06-04', '2024-07-11', '2024-09-04', '2024-10-15']) {
    add(date, '모의고사', 'exam')
  }
  range('2024-04-25', '2024-04-30', '중간고사', 'exam')
  range('2024-07-01', '2024-07-04', '기말고사', 'exam')
  range('2024-10-21', '2024-10-24', '중간고사', 'exam')
  add('2024-11-14', '수능', 'exam')
  range('2024-11-25', '2024-11-28', '기말고사', 'exam')
  add('2024-12-06', '성적발표', 'school')
  add('2024-12-31', '정시 원서', 'school')
  add('2024-12-31', '수호와 카운트다운 보기', 'plan')

  // 반복 일정 (2023~2024)
  eachDay('2023-01-01', '2024-12-31', (d, id) => {
    const weekday = d.getDay()
    const month = d.getMonth() + 1
    const day = d.getDate()
    if (month === 7 && day === 9) add(id, '수호 생일', 'birthday')
    if (d.getFullYear() === 2024 && weekday === 0 && day >= 8 && day <= 14) {
      add(id, '바쿠, 고탁, 준태', 'friends')
    }
    if (weekday === 0 || weekday === 6) add(id, '수호 병원', 'hospital')
    if (weekday === 1 || weekday === 3 || weekday === 5) add(id, '학원', 'academy')
  })

  return events
}

/** 2022년 일정 (2차 2022.07.13 기준 캘린더) */
export function buildSchedule2022(): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const add = (date: string, title: string, category: CalendarCategory, canceled = false) =>
    events.push({ date, title, category, ...(canceled && { canceled }) })

  add('2022-06-02', '모의고사', 'exam')
  add('2022-06-12', '수행평가 모임 안수호 오범석', 'school')
  add('2022-06-17', '영이', 'friends')
  add('2022-06-25', '엄마랑 점심', 'plan')
  add('2022-06-26', '점심약속', 'plan')
  add('2022-06-28', '한강', 'friends')
  add('2022-07-01', '좋았던 날', 'plan')
  add('2022-07-09', '안수호 생일(파티룸)', 'birthday')
  add('2022-07-09', '양양', 'plan', true)
  add('2022-07-14', '기말고사', 'exam')

  eachDay('2022-01-01', '2022-12-31', (d, id) => {
    const weekday = d.getDay()
    if (weekday >= 1 && weekday <= 4) add(id, '학원', 'academy')
  })

  return events
}
