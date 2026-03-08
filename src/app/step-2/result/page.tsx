import { Suspense } from "react";

import { StepTwoResultPage } from "@/components/app/step-two-result-page";

export default function StepTwoResultRoute() {
  return (
    <Suspense fallback={null}>
      <StepTwoResultPage />
    </Suspense>
  );
}
