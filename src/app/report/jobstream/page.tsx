import type { Metadata } from "next";
import JobstreamReportClient from "./JobstreamReportClient";

export const metadata: Metadata = {
  title: "Jobstream Report | Real Good Denver",
  robots: { index: false, follow: false },
};

export default function JobstreamReportPage() {
  return <JobstreamReportClient />;
}
