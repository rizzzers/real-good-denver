import type { Metadata } from "next";
import InboxAlchemyReportClient from "./InboxAlchemyReportClient";

export const metadata: Metadata = {
  title: "Inbox Alchemy Report | Real Good Denver",
  robots: { index: false, follow: false },
};

export default function InboxAlchemyReportPage() {
  return <InboxAlchemyReportClient />;
}
