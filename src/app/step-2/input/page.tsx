import { Suspense } from "react";

import { StepTwoInputPage } from "@/components/app/step-two-input-page";

export default function StepTwoInputRoute() {
  return (
    <Suspense fallback={null}>
      <StepTwoInputPage />
    </Suspense>
  );
}
