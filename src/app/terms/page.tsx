import { MobileShell } from "@/components/ui/mobile-shell";
import { PageHeader } from "@/components/ui/page-header";

const sections = [
  {
    title: "1. 서비스 성격",
    body: "뇌피셜은 사용자의 사고 패턴을 정리하고 실제 고민을 여러 관점으로 돌아보도록 돕는 AI 기반 사고 보조 도구입니다. 의료, 법률, 투자 자문 또는 전문 상담을 대신하지 않습니다.",
  },
  {
    title: "2. 계정과 기록",
    body: "로그인 사용자는 진단과 분석 기록을 저장할 수 있으며, 비로그인 사용자의 결과는 익명 세션을 기준으로 제한적으로 복구됩니다.",
  },
  {
    title: "3. 사용 제한",
    body: "서비스는 운영 안정성과 비용 관리를 위해 비로그인과 로그인 사용자 모두에게 일일 사용 횟수 제한을 둘 수 있습니다. 비로그인 체험 제한은 best-effort 기준으로 적용됩니다.",
  },
  {
    title: "4. 광고 및 외부 서비스",
    body: "서비스에는 광고, 로그인, 분석 등 외부 플랫폼이 연동될 수 있습니다. 광고는 주요 행동 버튼과 혼동되지 않는 위치에만 노출하며, 외부 서비스 연동 방식은 실제 운영 환경에 맞게 고지합니다.",
  },
  {
    title: "5. 책임의 한계",
    body: "서비스 결과는 참고 정보이며, 최종 판단과 의사결정은 사용자 본인의 책임 아래 이뤄집니다.",
  },
];

export default function TermsPage() {
  return (
    <MobileShell>
      <PageHeader backHref="/" title="이용약관" />
      <main className="px-6 pb-12 pt-8">
        <div className="space-y-4">
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
