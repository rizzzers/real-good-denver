import type { Metadata } from "next";
import TelescopeMappingReportClient from "./TelescopeMappingReportClient";

export const metadata: Metadata = {
  title: "Telescope Mapping Report | Real Good Denver",
  robots: { index: false, follow: false },
};

export default function TelescopeMappingReportPage() {
  return <TelescopeMappingReportClient />;
}
