export type Difficulty = "Dễ" | "Trung bình" | "Khó";

export interface Question {
  id: number;
  level: number;
  difficulty: Difficulty;
  sentencePre: string;
  wordBracket: string;
  sentencePost: string;
  correctWord: string;
  grammarTense: string;
  formula: string;
}

export const QUESTIONS: Question[] = [
  // Cấp độ Dễ - Hiện tại đơn
  {
    id: 1,
    level: 1,
    difficulty: "Dễ",
    sentencePre: "She ",
    wordBracket: "go",
    sentencePost: " to school every day.",
    correctWord: "goes",
    grammarTense: "Thì Hiện Tại Đơn (Present Simple)",
    formula: "S (He/She/It) + V(s/es) + O"
  },
  {
    id: 2,
    level: 2,
    difficulty: "Dễ",
    sentencePre: "He ",
    wordBracket: "don't",
    sentencePost: " like playing piano.",
    correctWord: "doesn't",
    grammarTense: "Thì Hiện Tại Đơn - Thể phủ định (Present Simple Negative)",
    formula: "S (He/She/It) + does not (doesn't) + V(nguyên mẫu) + O"
  },
  {
    id: 3,
    level: 3,
    difficulty: "Dễ",
    sentencePre: "The sun ",
    wordBracket: "rise",
    sentencePost: " in the east.",
    correctWord: "rises",
    grammarTense: "Thì Hiện Tại Đơn (Present Simple)",
    formula: "S (số ít) + V(s/es) + O"
  },
  // Cấp độ Trung bình - Quá khứ đơn
  {
    id: 4,
    level: 4,
    difficulty: "Trung bình",
    sentencePre: "I ",
    wordBracket: "see",
    sentencePost: " a ghost yesterday.",
    correctWord: "saw",
    grammarTense: "Thì Quá Khứ Đơn (Past Simple)",
    formula: "S + V2/ed + O + Thời gian quá khứ"
  },
  {
    id: 5,
    level: 5,
    difficulty: "Trung bình",
    sentencePre: "We did not ",
    wordBracket: "went",
    sentencePost: " to the park.",
    correctWord: "go",
    grammarTense: "Thì Quá Khứ Đơn - Thể phủ định",
    formula: "S + did not (didn't) + V(nguyên mẫu) + O"
  },
  {
    id: 6,
    level: 6,
    difficulty: "Trung bình",
    sentencePre: "When I was a child, I ",
    wordBracket: "play",
    sentencePost: " video games all day.",
    correctWord: "played",
    grammarTense: "Thì Quá Khứ Đơn (Thói quen trong quá khứ)",
    formula: "S + V2/ed + ... (Diễn tả thói quen đã kết thúc)"
  },
  // Cấp độ Khó - Mạo từ, Giới từ
  {
    id: 7,
    level: 7,
    difficulty: "Khó",
    sentencePre: "He is allergic ",
    wordBracket: "with",
    sentencePost: " peanuts.",
    correctWord: "to",
    grammarTense: "Giới từ đi với tính từ (Adjective + Preposition)",
    formula: "to be allergic + to + N. (Bị dị ứng với)"
  },
  {
    id: 8,
    level: 8,
    difficulty: "Khó",
    sentencePre: "She is ",
    wordBracket: "a",
    sentencePost: " honest person.",
    correctWord: "an",
    grammarTense: "Mạo từ (Articles a/an/the)",
    formula: "an + Danh từ/Tính từ bắt đầu bằng nguyên âm (ví dụ: honest phiên âm là /ɒnɪst/ nên dùng 'an')"
  },
  {
    id: 9,
    level: 9,
    difficulty: "Khó",
    sentencePre: "I will meet you ",
    wordBracket: "on",
    sentencePost: " the morning.",
    correctWord: "in",
    grammarTense: "Giới từ chỉ thời gian (Prepositions of Time)",
    formula: "in + the morning/afternoon/evening"
  },
  {
    id: 10,
    level: 10,
    difficulty: "Khó",
    sentencePre: "We are looking forward ",
    wordBracket: "to hear",
    sentencePost: " from you.",
    correctWord: "to hearing",
    grammarTense: "Danh động từ (Gerund)",
    formula: "look forward to + V-ing (Mong chờ việc gì đó sẽ xảy ra)"
  }
];
