export const CLUB_STATUS = [
    { value: 'ACTIVE', label: '활동중' },
    { value: 'INACTIVE', label: '비활동중' },
    { value: 'DISBANDED', label: '해체됨' },
]
export const JOIN_TYPE = [
    { value: 'FREE', label: '자유가입' },
    { value: 'APPROVAL', label: '승인가입' },
    { value: 'CLOSED', label: '비활동' },
]
export const CLUB_MEMBER_STATUS = [
    { value: 'PENDING', label: '대기중' },
    { value: 'APPROVED', label: '승인됨' },
    { value: 'REJECTED', label: '거절됨' },
    { value: 'WITHDRAW', label: '탈퇴함' },
    { value: 'EXPELLED', label: '추방됨' },
]
export const CLUB_ROLE = [
    { value: 'PRESIDENT', label: '회장' },
    { value: 'EXECUTIVE', label: '임원' },
    { value: 'MEMBER', label: '회원' },
]
export const PAYMENT_METHOD = [
    { value: 'CASH', label: '현금' },
    { value: 'TRANSFER', label: '이체' },
    { value: 'CARD', label: '카드' },
]
export const PAYMENT_STATUS = [
    { value: 'UNPAID', label: '미납' },
    { value: 'PARTIAL', label: '부분 납부' },
    { value: 'PAID', label: '납부 완료' },
    { value: 'EXEMPTED', label: '면제' },
]
export const ACTIVITY_PREFERENCE = [
    { value: 'MORNING', label: '오전' },
    { value: 'AFTERNOON', label: '오후' },
    { value: 'EVENING', label: '저녁' },
    { value: 'WEEKEND', label: '주말' }
];
export const ENROLLMENT_STATUS = [
    { value: 'ENROLLED', label: '재학' },
    { value: 'LEAVE', label: '휴학' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'EXPELLED', label: '자퇴' }
];
export const GENDER = [
    { value: 'MALE', label: '남자' },
    { value: 'FEMALE', label: '여자' },
    { value: 'OTHER', label: '미정' }
]
export const ROLE = [
    { value: 'USER', label: '회원' },
    { value: 'ADMIN', label: '관리자' }
]
export const SCHEDULE_STATUS = [
    { value: 'SCHEDULED', label: '예정' },
    { value: 'ONGOING', label: '진행중' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'CANCELLED', label: '취소됨' },
]
export const SCHEDULE_TYPE = [
    { value: 'REGULAR', label: '정기 회합' },
    { value: 'SPECIAL', label: '특별 일정' },
    { value: 'COMPETITION', label: '대회' },
    { value: 'WORKSHOP', label: '워크숍' },
    { value: 'PARTY', label: '파티' },
    { value: 'ETC', label: '그 외' },
]
export const TERM = [
    { value: 'FIRST', label: '1학기' },
    { value: 'SECOND', label: '2학기' },
    { value: 'SUMMER', label: '여름방학' },
    { value: 'WINTER', label: '겨울방학' },
]
export const MBTI_LIST = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
];