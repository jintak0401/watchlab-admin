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
  return new RegExp(pattern, 'i');
};

const filterWords = <T>(list: T[], key: keyof T, input: string) => {
  if (!input) return list;

  const matcher = createFuzzyMatcher(input);
  return list.filter((item) => matcher.test(item[key] as string));
};

const appendFormData = (formData: FormData, key: string, value: any) => {
  if (value instanceof Blob) {
    formData.append('file', value);
  } else if (typeof value === 'string') {
    formData.append(key, value);
  } else if (typeof value === 'number') {
    formData.append(key, String(value));
  }
};

const genMultiPartFormData = <T>(data: T) => {
  const formData = new FormData();
  for (const _key in data) {
    const key: keyof T = _key;
    if (Array.isArray(data[key])) {
      const arr = data[key] as any[];
      arr.forEach((item) => {
        appendFormData(formData, key, item);
      });
    } else {
      appendFormData(formData, key, data[key]);
    }
  }
  return formData;
};

const string2css = (str?: string) => {
  if (!str) return {};
  const cssJson = `{"${str
    .replace(/; /g, '", "')
    .replace(/: /g, '": "')
    .replace(';', '')}"}`;

  const obj = JSON.parse(cssJson);

  const keyValues = Object.keys(obj).map((key) => {
    const camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
    return { [camelCased]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

export {
  createFuzzyMatcher,
  filterWords,
  genMultiPartFormData,
  genRandomColor,
  string2css,
};
