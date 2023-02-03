import { WordType } from '@/lib/types';

const genRandomColor = () => {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  return `#${color}`;
};

// 특수문자 처리
const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ch2pattern = (ch: string) => {
  // 사용자가 초성만 입력한 경우
  if (/[ㄱ-ㅎ]/.test(ch)) {
    const chToBegin: { [key: string]: number } = {
      ㄱ: '가'.charCodeAt(0),
      ㄲ: '까'.charCodeAt(0),
      ㄴ: '나'.charCodeAt(0),
      ㄷ: '다'.charCodeAt(0),
      ㄸ: '따'.charCodeAt(0),
      ㄹ: '라'.charCodeAt(0),
      ㅁ: '마'.charCodeAt(0),
      ㅂ: '바'.charCodeAt(0),
      ㅃ: '빠'.charCodeAt(0),
      ㅅ: '사'.charCodeAt(0),
      ㅆ: '싸'.charCodeAt(0),
      ㅇ: '아'.charCodeAt(0),
      ㅈ: '자'.charCodeAt(0),
      ㅊ: '차'.charCodeAt(0),
      ㅋ: '카'.charCodeAt(0),
      ㅌ: '타'.charCodeAt(0),
      ㅍ: '파'.charCodeAt(0),
      ㅎ: '하'.charCodeAt(0),
    };
    const begin = chToBegin[ch];
    const end = begin + 587;
    return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }
  // 사용자가 초성+중성 또는 초성+중성+종성을 입력한 경우
  else if (/[가-히]/.test(ch)) {
    const offset = '가'.charCodeAt(0);
    const chCode = ch.charCodeAt(0) - offset;
    // 사용자가 초성+중성을 입력한 경우
    if (chCode % 28 <= 0) {
      const begin = Math.floor(chCode / 28) * 28 + offset;
      const end = begin + 27;
      return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
    }
    // 사용자가 초성+중성+종성을 입력한 경우
    else return ch;
  }
  // 한글이 입력되지 않은 경우
  else return escapeRegExp(ch);
};

// 퍼지 문자열 검색을 위한 정규식 생성
const createFuzzyMatcher = (input: string) => {
  const pattern = input.split('').map(ch2pattern).join('.*?');
  return new RegExp(pattern);
};

const filterWords = (words: WordType[], input: string) => {
  if (!input) return words;

  const matcher = createFuzzyMatcher(input);
  return words.filter((word) => matcher.test(word.word));
};

export { createFuzzyMatcher, filterWords, genRandomColor };
