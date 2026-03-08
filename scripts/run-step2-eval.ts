const withGemini = process.argv.includes("--with-gemini");

if (!withGemini) {
  process.env.GEMINI_API_KEY = "";
}

process.env.FIREBASE_PROJECT_ID = "";
process.env.FIREBASE_CLIENT_EMAIL = "";
process.env.FIREBASE_PRIVATE_KEY = "";

type EvalRow = {
  id: string;
  topic: string;
  expectedTopic: string;
  topicOk: boolean;
  lensHits: number;
  anchorHits: number;
  warningOk: boolean;
  questionCount: number;
};

async function main() {
  const [
    { STEP2_EVAL_CASES },
    { createSession },
    { persistSessionRecord },
    { runStep2Analyze },
    { BIAS_KEY_ORDER },
    {
      buildStep2Anchors,
      countAnchorHits,
      detectStep2Topic,
      getExpectedLensesForTopic,
    },
  ] = await Promise.all([
    import("../src/lib/evals/step2-cases"),
    import("../src/lib/server/session-store"),
    import("../src/lib/server/session-repository"),
    import("../src/lib/services/step2-service"),
    import("../src/lib/bias/characters"),
    import("../src/lib/step2-fallback"),
  ]);

  const rows: EvalRow[] = [];

  for (const testCase of STEP2_EVAL_CASES) {
    const session = createSession();
    session.step1_status = "ready_for_result";
    session.current_question = null;
    session.asked_question_ids = [];
    session.answers = Array.from({ length: 7 }, (_, index) => ({
      question_id: `eval-${testCase.id}-${index + 1}`,
      selected_option_id: `choice-${index + 1}`,
    }));

    for (const key of BIAS_KEY_ORDER) {
      session.bias_scores[key] = 0;
    }

    session.bias_scores[testCase.topBiasKey] = 12;
    for (const [index, key] of (testCase.secondaryBiasKeys ?? []).entries()) {
      session.bias_scores[key] = Math.max(4, 8 - index * 2);
    }

    await persistSessionRecord(session);
    const result = await runStep2Analyze({
      session_id: session.id,
      dilemma_text: testCase.dilemmaText,
    });

    const topic = detectStep2Topic(testCase.dilemmaText);
    const expectedLenses = getExpectedLensesForTopic(testCase.expectedTopic);
    const selectedLenses = new Set(result.selected_lenses.map((item) => item.lens));
    const lensHits = expectedLenses.filter((lens) => selectedLenses.has(lens)).length;
    const combined = [
      result.dilemma_text,
      result.bias_warning.tag,
      result.bias_warning.body,
      ...result.selected_lenses.flatMap((lens) => [lens.verdict, lens.summary]),
      ...result.critical_questions.map((question) => question.text),
      result.closing,
    ].join(" ");
    const anchorHits = countAnchorHits(combined, buildStep2Anchors(testCase.dilemmaText));
    const warningOk = !["amber", "blue", "violet", "emerald"].includes(
      result.bias_warning.tag.trim().toLowerCase(),
    );

    rows.push({
      id: testCase.id,
      topic,
      expectedTopic: testCase.expectedTopic,
      topicOk: topic === testCase.expectedTopic,
      lensHits,
      anchorHits,
      warningOk,
      questionCount: result.critical_questions.length,
    });
  }

  console.table(rows);

  const failed = rows.filter(
    (row) => !row.topicOk || row.lensHits < 2 || row.anchorHits < 2 || !row.warningOk || row.questionCount < 2,
  );

  if (failed.length > 0) {
    console.error(`Step 2 eval failed for ${failed.length} case(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Step 2 eval passed for ${rows.length} case(s)${withGemini ? " with Gemini enabled." : " using deterministic mode."}`,
  );
}

void main();
