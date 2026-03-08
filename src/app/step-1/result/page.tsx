import { Suspense } from "react";

import { StepOneResultPage } from "@/components/app/step-one-result-page";

export default function StepOneResultRoute() {
  return (
    <Suspense fallback={null}>
      <StepOneResultPage />
    </Suspense>
  );
}
