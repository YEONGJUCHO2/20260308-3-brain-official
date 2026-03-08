import { Suspense } from "react";

import { StepOneShareCardPage } from "@/components/app/share-card-pages";

export default function StepOneShareRoute() {
  return (
    <Suspense fallback={null}>
      <StepOneShareCardPage />
    </Suspense>
  );
}
