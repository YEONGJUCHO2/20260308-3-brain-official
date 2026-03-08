import { MobileShell } from "@/components/ui/mobile-shell";
import { PageHeader } from "@/components/ui/page-header";

const sections = [
  {
    title: "1. 수집하는 정보",
    body: "로그인 사용자의 경우 Google 계정에서 제공하는 기본 프로필 정보와 앱 사용 기록을 저장할 수 있습니다. 비로그인 사용자의 경우 익명 세션 식별자와 Step 1, Step 2 진행 상태를 임시로 저장합니다.",
  },
  {
    title: "2. 이용 목적",
    body: "수집한 정보는 Step 1 결과 복구, Step 2 분석 제공, 로그인 후 기록 마이그레이션, 서비스 품질 개선과 운영 안정성 확인을 위해 사용합니다.",
  },
  {
    title: "3. 보관 기간",
    body: "익명 세션 데이터는 운영 정책에 따라 주기적으로 정리할 수 있습니다. 로그인 사용자의 기록은 사용자가 삭제를 요청하거나 서비스 정책상 정리 시점이 도래할 때까지 보관될 수 있습니다.",
  },
  {
    title: "4. 광고 및 쿠키",
    body: "서비스는 Google AdSense 등 광고 플랫폼을 사용할 수 있습니다. 이 과정에서 쿠키 또는 기기 식별 정보가 광고 노출, 빈도 제한, 성과 측정에 활용될 수 있으며, 실제 광고 운영 시점에는 관련 고지와 동의 절차를 운영 정책에 맞게 보강합니다.",
  },
  {
    title: "5. 문의",
    body: "정식 운영 연락처가 확정되기 전까지는 배포 환경에 별도 문의 메일 또는 고객지원 채널을 연결해야 합니다.",
  },
];

export default function PrivacyPage() {
  return (
    <MobileShell>
      <PageHeader backHref="/" title="개인정보처리방침" />
      <main className="px-6 pb-12 pt-8">
        <div className="brain-card p-6">
          <p className="text-sm leading-7 text-[var(--muted)]">
            본 문서는 MVP 운영 기준의 초안입니다. 실제 배포 전에는 법적 검토, 사업자
            정보, 고객 문의 채널, 광고 및 쿠키 정책을 서비스 운영 기준에 맞게 보강해야
            합니다.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="brain-card p-6">
              <h2 className="text-xl font-black tracking-[-0.03em]">{section.title}</h2>
              <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
    </MobileShell>
  );
}
