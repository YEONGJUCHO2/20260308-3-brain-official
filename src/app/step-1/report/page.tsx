import { Suspense } from "react";

import { StepOneReportPage } from "@/components/app/step-one-report-page";

export default function StepOneReportRoute() {
  return (
    <Suspense fallback={null}>
      <StepOneReportPage />
    </Suspense>
  );
}
