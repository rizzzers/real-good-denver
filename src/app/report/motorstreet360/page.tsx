import type { Metadata } from "next";
import MotorStreet360ReportClient from "./MotorStreet360ReportClient";

export const metadata: Metadata = {
  title: "MotorStreet360 Report | Real Good Denver",
  robots: { index: false, follow: false },
};

export default function MotorStreet360ReportPage() {
  return <MotorStreet360ReportClient />;
}
