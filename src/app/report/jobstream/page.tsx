"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users, MousePointerClick, DollarSign, ExternalLink, Headphones } from "lucide-react";
import ReportPasswordGate from "@/components/ReportPasswordGate";

interface EmailData {
  date: string;
  subject: string;
  recipients: number;
  delivered: number;
  deliveryRate: string;
  openRate: string;
  uniqueOpens: number;
  totalOpens: number;
  clickRate: string;
  uniqueClicks: number;
  totalClicks: number;
  unsubscribeRate: string;
  unsubscribes: number;
  spamReports: number;
  podcastUrl?: string;
}

const novemberData: EmailData[] = [
  {
    date: "Nov 19th, 2025",
    subject: "Denver comedy, networking, and something weird in a brewery (probably)",
    recipients: 13171,
    delivered: 13064,
    deliveryRate: "99.19%",
    openRate: "49.16%",
    uniqueOpens: 6422,
    totalOpens: 10311,
    clickRate: "2.54%",
    uniqueClicks: 163,
    totalClicks: 364,
    unsubscribeRate: "0.83%",
    unsubscribes: 108,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/4IoFc5zvbH6unDIImyuTrr",
  },
  {
    date: "Nov 26th, 2025",
    subject: "Denver kangaroo yoga, flaming cocktails, and a political plot twist",
    recipients: 13056,
    delivered: 12940,
    deliveryRate: "99.11%",
    openRate: "48.89%",
    uniqueOpens: 6326,
    totalOpens: 9926,
    clickRate: "3.32%",
    uniqueClicks: 210,
    totalClicks: 472,
    unsubscribeRate: "0.94%",
    unsubscribes: 122,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/6v0OpwAsTltxsmHRjDn1U8",
  },
];

const decemberData: EmailData[] = [
  {
    date: "Dec 4th, 2025",
    subject: "Denver protests skater's court date + Guided winter hikes under December skies",
    recipients: 13510,
    delivered: 13379,
    deliveryRate: "99.03%",
    openRate: "49.73%",
    uniqueOpens: 6654,
    totalOpens: 10286,
    clickRate: "2.48%",
    uniqueClicks: 165,
    totalClicks: 392,
    unsubscribeRate: "1.11%",
    unsubscribes: 148,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/4FweSzoBfnbPEKzAq6f4K4",
  },
  {
    date: "Dec 10th, 2025",
    subject: "Denver politicians fight, trash turns to fuel, and small businesses pay the holiday price",
    recipients: 13361,
    delivered: 13223,
    deliveryRate: "98.97%",
    openRate: "47.23%",
    uniqueOpens: 6245,
    totalOpens: 9429,
    clickRate: "2.08%",
    uniqueClicks: 130,
    totalClicks: 302,
    unsubscribeRate: "0.91%",
    unsubscribes: 120,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/73giM9y0iYl1fW9AzblygG",
  },
  {
    date: "Dec 17th, 2025",
    subject: "Denver man climbs a monument, bears are under the deck, protests stop drilling, and two police face charges.",
    recipients: 13684,
    delivered: 13530,
    deliveryRate: "98.87%",
    openRate: "47.38%",
    uniqueOpens: 6410,
    totalOpens: 10375,
    clickRate: "2.32%",
    uniqueClicks: 149,
    totalClicks: 1057,
    unsubscribeRate: "0.99%",
    unsubscribes: 134,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/6neU41PdDjFbjXuDHf84Sh",
  },
  {
    date: "Dec 24th, 2025",
    subject: "Denver Vaporwave Christmas Parties, Airport Showdowns, and a Very Quiet Wildlife Crossing",
    recipients: 13963,
    delivered: 13773,
    deliveryRate: "98.64%",
    openRate: "50.56%",
    uniqueOpens: 6963,
    totalOpens: 10386,
    clickRate: "2.24%",
    uniqueClicks: 156,
    totalClicks: 371,
    unsubscribeRate: "0.73%",
    unsubscribes: 101,
    spamReports: 0,
    podcastUrl: "https://open.spotify.com/episode/186EubZdLEMkXNFDdTFYxf",
  },
  {
    date: "Dec 31st, 2025",
    subject: "Denver's new stadiums, new towers, new promises as food bank lines stretch longer this winter",
    recipients: 13853,
    delivered: 13659,
    deliveryRate: "98.60%",
    openRate: "48.02%",
    uniqueOpens: 6559,
    totalOpens: 9242,
    clickRate: "2.42%",
    uniqueClicks: 159,
    totalClicks: 432,
    unsubscribeRate: "0.81%",
    unsubscribes: 110,
    spamReports: 1,
    podcastUrl: "https://open.spotify.com/episode/5a1UEFanfHyhtETzBPeMLR",
  },
];

const CPM_RATE = 20;

const calculateBillableCost = (uniqueOpens: number) => {
  return (uniqueOpens / 1000) * CPM_RATE;
};

const calculateMonthlyAverages = (data: EmailData[]) => {
  const totalRecipients = data.reduce((sum, d) => sum + d.recipients, 0);
  const totalDelivered = data.reduce((sum, d) => sum + d.delivered, 0);
  const avgOpenRate = data.reduce((sum, d) => sum + parseFloat(d.openRate), 0) / data.length;
  const avgClickRate = data.reduce((sum, d) => sum + parseFloat(d.clickRate), 0) / data.length;
  const totalUniqueOpens = data.reduce((sum, d) => sum + d.uniqueOpens, 0);
  const totalClicks = data.reduce((sum, d) => sum + d.totalClicks, 0);
  const totalBillable = data.reduce((sum, d) => sum + calculateBillableCost(d.uniqueOpens), 0);

  return {
    totalRecipients,
    totalDelivered,
    avgOpenRate: avgOpenRate.toFixed(2),
    avgClickRate: avgClickRate.toFixed(2),
    totalUniqueOpens,
    totalClicks,
    emailCount: data.length,
    totalBillable,
  };
};

const allData = [...novemberData, ...decemberData];
const combinedTotals = calculateMonthlyAverages(allData);

const MetricCard = ({
  title,
  value,
  subtitle,
  subtitleValue,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  icon: React.ElementType;
}) => (
  <Card className="bg-card border-border">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && subtitleValue && (
        <p className="text-sm text-muted-foreground mt-2">
          {subtitle}: <span className="text-foreground font-medium">{subtitleValue}</span>
        </p>
      )}
    </CardContent>
  </Card>
);

const EmailRow = ({ email }: { email: EmailData }) => (
  <Card className="bg-card border-border mb-4">
    <CardContent className="p-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{email.date}</p>
        <h3 className="text-lg font-semibold text-foreground mt-1">{email.subject}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Recipients</p>
          <p className="text-xl font-bold text-foreground">{email.recipients.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Delivered: {email.delivered.toLocaleString()} ({email.deliveryRate})</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Open Rate</p>
          <p className="text-xl font-bold text-primary">{email.openRate}</p>
          <p className="text-xs text-muted-foreground">Unique Opens: {email.uniqueOpens.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Click Rate</p>
          <p className="text-xl font-bold text-foreground">{email.clickRate}</p>
          <p className="text-xs text-muted-foreground">Total Clicks: {email.totalClicks.toLocaleString()}</p>
        </div>
      </div>
      {email.podcastUrl && (
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={email.podcastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Headphones className="h-4 w-4" />
            <span className="text-sm font-medium">Listen to this week&apos;s podcast episode</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </CardContent>
  </Card>
);

const BillingSummary = () => (
  <Card className="bg-primary/5 border-primary/20 mb-8">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Billing Summary (Nov + Dec 2025)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Unique Opens</p>
          <p className="text-2xl font-bold text-foreground">{combinedTotals.totalUniqueOpens.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">CPM Rate</p>
          <p className="text-2xl font-bold text-foreground">$20</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-2xl font-bold text-foreground">${combinedTotals.totalBillable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sponsor Credit</p>
          <p className="text-2xl font-bold text-green-600">-${combinedTotals.totalBillable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-primary/20">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-foreground">Total Due</p>
          <p className="text-3xl font-bold text-primary">$0.00</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Calculated as: (Unique Opens ÷ 1,000) × $20 CPM
      </p>
    </CardContent>
  </Card>
);

const MonthSummary = ({ data }: { data: EmailData[] }) => {
  const averages = calculateMonthlyAverages(data);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Recipients"
          value={averages.totalRecipients.toLocaleString()}
          subtitle="Emails Sent"
          subtitleValue={averages.emailCount}
          icon={Users}
        />
        <MetricCard
          title="Avg Open Rate"
          value={`${averages.avgOpenRate}%`}
          subtitle="Total Unique Opens"
          subtitleValue={averages.totalUniqueOpens.toLocaleString()}
          icon={Mail}
        />
        <MetricCard
          title="Avg Click Rate"
          value={`${averages.avgClickRate}%`}
          subtitle="Total Clicks"
          subtitleValue={averages.totalClicks.toLocaleString()}
          icon={MousePointerClick}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Individual Emails</h3>
        {data.map((email, index) => (
          <EmailRow key={index} email={email} />
        ))}
      </div>
    </div>
  );
};

export default function JobstreamReportPage() {
  return (
    <ReportPasswordGate>
      <div className="min-h-screen bg-background">
        <header className="bg-primary py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <img src="/real-good-denver-logo.png" alt="Real Good Denver" className="h-12" />
              <span className="text-primary-foreground/80 text-sm">Sponsor Report</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <a
                href="https://jobstream.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <div className="h-20 md:h-24 bg-white rounded-lg p-4 flex items-center justify-center">
                  <img
                    src="/jobstream-logo.png"
                    alt="Jobstream"
                    className="h-12 md:h-16 object-contain"
                  />
                </div>
              </a>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  Jobstream
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Sponsorship Performance Report • Nov - Dec 2025
                </p>
                <a
                  href="https://jobstream.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mt-2 transition-colors"
                >
                  jobstream.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <BillingSummary />

          <Tabs defaultValue="december" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="november">November 2025</TabsTrigger>
              <TabsTrigger value="december">December 2025</TabsTrigger>
            </TabsList>

            <TabsContent value="november">
              <MonthSummary data={novemberData} />
            </TabsContent>

            <TabsContent value="december">
              <MonthSummary data={decemberData} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="bg-muted py-8 px-4 mt-12">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">
              Report generated by{" "}
              <a
                href="https://realgooddenver.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Real Good Denver
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Questions? Contact us at hello@realgooddenver.com
            </p>
          </div>
        </footer>
      </div>
    </ReportPasswordGate>
  );
}
