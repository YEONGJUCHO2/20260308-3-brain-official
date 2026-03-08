export type Step1SessionStatus = "in_progress" | "ready_for_result";

export type Step1Option = {
  id: string;
  label: string;
};

export type Step1Question = {
  id: string;
  turn_number: number;
  prompt: string;
  helper: string;
  interaction: "choice" | "input";
  options?: Step1Option[];
  placeholder?: string;
  examples?: string[];
  progress: number;
};

export type Step1ConversationTurn = {
  turn_number: number;
  question: string;
  answer: string;
};

export type Step1TopCharacter = {
  bias_id: number;
  bias_key: string;
  bias_name_original: string;
  character_name: string;
  subtitle: string;
  summary: string;
  detail: string;
  strength: string;
  watch_out_for: string;
  reflection_question: string;
  score: number;
  rank: 1 | 2 | 3;
  tone: "pink" | "violet" | "indigo";
  image_src: string;
};

export type Step1RadarScore = {
  bias_id: number;
  bias_key: string;
  label: string;
  value: number;
  display_score: number;
};

export type Step1BiasBreakdownItem = {
  bias_id: number;
  bias_key: string;
  bias_name_original: string;
  character_name: string;
  subtitle: string;
  summary: string;
  detail: string;
  strength: string;
  watch_out_for: string;
  reflection_question: string;
  raw_score: number;
  display_score: number;
  tone: "pink" | "violet" | "indigo";
  image_src: string;
};

export type Step1ResultData = {
  session_id: string;
  status: Step1SessionStatus;
  top3: Step1TopCharacter[];
  radar_scores: Step1RadarScore[];
  bias_breakdown: Step1BiasBreakdownItem[];
  overall_insight: string;
  share_line: string;
};

export type Step1ChatRequest = {
  session_id?: string;
  selected_option_id?: string;
  input_text?: string;
};

export type Step1ChatResponse = {
  session_id: string;
  status: Step1SessionStatus;
  question: Step1Question | null;
  history: Step1ConversationTurn[];
  answered_turns: number;
  recommended_min_turns: number;
  progress: number;
};

export type Step1ResultRequest = {
  session_id: string;
};
