export type Step2AnalyzeRequest = {
  session_id: string;
  dilemma_text?: string;
};

export type Step2LensTone = "amber" | "blue" | "violet" | "emerald";

export type Step2LensResult = {
  lens: string;
  verdict: string;
  tone: Step2LensTone;
  summary: string;
};

export type Step2ExcludedLens = {
  lens: string;
  reason: string;
};

export type Step2CriticalQuestion = {
  id: string;
  text: string;
};

export type Step2BiasWarning = {
  title: string;
  tag: string;
  body: string;
};

export type Step2ResultData = {
  session_id: string;
  dilemma_text: string;
  bias_warning: Step2BiasWarning;
  selected_lenses: Step2LensResult[];
  excluded_lenses: Step2ExcludedLens[];
  critical_questions: Step2CriticalQuestion[];
  closing: string;
};
