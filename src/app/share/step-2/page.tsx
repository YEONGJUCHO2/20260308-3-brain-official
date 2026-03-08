import { Suspense } from "react";

import { StepTwoShareCardPage } from "@/components/app/share-card-pages";

export default function StepTwoShareRoute() {
  return (
    <Suspense fallback={null}>
      <StepTwoShareCardPage />
    </Suspense>
  );
}
