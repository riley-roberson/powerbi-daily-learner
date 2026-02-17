import DayPageClient from "./DayPageClient";

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ n: String(i + 1) }));
}

export default function DayPage({ params }: { params: { n: string } }) {
  return <DayPageClient />;
}
