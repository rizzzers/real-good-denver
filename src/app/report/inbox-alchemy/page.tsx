"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users, MousePointerClick, UserMinus, DollarSign, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
}

const octoberData: EmailData[] = [
  {
    date: "Oct 7th, 2025",
    subject: "Denver robotaxis laugh at snow, haunted bar crawls, and festivals turn the heat up",
    recipients: 17548,
    delivered: 16643,
    deliveryRate: "94.84%",
    openRate: "49.02%",
    uniqueOpens: 8158,
    totalOpens: 13286,
    clickRate: "3.49%",
    uniqueClicks: 285,
    totalClicks: 539,
    unsubscribeRate: "1.12%",
    unsubscribes: 186,
    spamReports: 0,
  },
  {
    date: "Oct 15th, 2025",
    subject: "Denver's haunted hotels, swastika scandal, and a $175 million question",
    recipients: 12197,
    delivered: 12176,
    deliveryRate: "99.83%",
    openRate: "59.03%",
    uniqueOpens: 7187,
    totalOpens: 12296,
    clickRate: "3.17%",
    uniqueClicks: 228,
    totalClicks: 496,
    unsubscribeRate: "1.19%",
    unsubscribes: 145,
    spamReports: 0,
  },
  {
    date: "Oct 22nd, 2025",
    subject: "Denver's justice gets weird: jugging thieves, AI crimes, and headless chickens",
    recipients: 12055,
    delivered: 12022,
    deliveryRate: "99.73%",
    openRate: "56.7%",
    uniqueOpens: 6816,
    totalOpens: 11417,
    clickRate: "2.79%",
    uniqueClicks: 190,
    totalClicks: 443,
    unsubscribeRate: "0.95%",
    unsubscribes: 114,
    spamReports: 1,
  },
  {
    date: "Oct 29th, 2025",
    subject: "Denver's plot twist: jam-band mogul on trial, auditor probes budgets, and somehow the library wins the week",
    recipients: 11941,
    delivered: 11899,
    deliveryRate: "99.65%",
    openRate: "56.95%",
    uniqueOpens: 6777,
    totalOpens: 11109,
    clickRate: "3.1%",
    uniqueClicks: 210,
    totalClicks: 437,
    unsubscribeRate: "0.84%",
    unsubscribes: 100,
    spamReports: 1,
  },
];

const novemberData: EmailData[] = [
  {
    date: "Nov 7th, 2025",
    subject: "Denver social media stars run for office and a nightclub becomes a crime scene",
    recipients: 12489,
    delivered: 12423,
    deliveryRate: "99.47%",
    openRate: "57.18%",
    uniqueOpens: 7104,
    totalOpens: 11593,
    clickRate: "3.34%",
    uniqueClicks: 237,
    totalClicks: 442,
    unsubscribeRate: "0.96%",
    unsubscribes: 119,
    spamReports: 0,
  },
  {
    date: "Nov 14th, 2025",
    subject: "Denver, bring your vinyl, your trauma, and your weirdest outfit, the city is calling",
    recipients: 12365,
    delivered: 12280,
    deliveryRate: "99.31%",
    openRate: "53.1%",
    uniqueOpens: 6521,
    totalOpens: 10581,
    clickRate: "2.62%",
    uniqueClicks: 171,
    totalClicks: 368,
    unsubscribeRate: "0.70%",
    unsubscribes: 86,
    spamReports: 0,
  },
  {
    date: "Nov 19th, 2025",
    subject: "Denver comedy, networking, and something weird in a brewery (probably)",
    recipients: 13171,
    delivered: 13064,
    deliveryRate: "99.19%",
    openRate: "48.66%",
    uniqueOpens: 6357,
    totalOpens: 9924,
    clickRate: "2.55%",
    uniqueClicks: 162,
    totalClicks: 361,
    unsubscribeRate: "0.80%",
    unsubscribes: 105,
    spamReports: 0,
  },
  {
    date: "Nov 26th, 2025",
    subject: "Denver kangaroo yoga, flaming cocktails, and a political plot twist",
    recipients: 13056,
    delivered: 12940,
    deliveryRate: "99.11%",
    openRate: "47.84%",
    uniqueOpens: 6191,
    totalOpens: 9310,
    clickRate: "3.34%",
    uniqueClicks: 207,
    totalClicks: 469,
    unsubscribeRate: "0.92%",
    unsubscribes: 119,
    spamReports: 0,
  },
];

const decemberData: EmailData[] = [
  {
    date: "Dec 4th, 2025",
    subject: "Denver protests skater's court date + Guided winter hikes under December skies",
    recipients: 13510,
    delivered: 13379,
    deliveryRate: "99.03%",
    openRate: "47.65%",
    uniqueOpens: 6375,
    totalOpens: 9181,
    clickRate: "2.48%",
    uniqueClicks: 158,
    totalClicks: 382,
    unsubscribeRate: "0.97%",
    unsubscribes: 130,
    spamReports: 0,
  },
];

const CPM_RATE = 100;

const calculateBillableCost = (uniqueOpens: number) => {
  return (uniqueOpens / 1000) * CPM_RATE;
};

const calculateMonthlyAverages = (data: EmailData[]) => {
  const totalRecipients = data.reduce((sum, d) => sum + d.recipients, 0);
  const totalDelivered = data.reduce((sum, d) => sum + d.delivered, 0);
  const avgOpenRate = data.reduce((sum, d) => sum + parseFloat(d.openRate), 0) / data.length;
  const avgClickRate = data.reduce((sum, d) => sum + parseFloat(d.clickRate), 0) / data.length;
  const avgUnsubRate = data.reduce((sum, d) => sum + parseFloat(d.unsubscribeRate), 0) / data.length;
  const totalUniqueOpens = data.reduce((sum, d) => sum + d.uniqueOpens, 0);
  const totalClicks = data.reduce((sum, d) => sum + d.totalClicks, 0);
  const totalUnsubscribes = data.reduce((sum, d) => sum + d.unsubscribes, 0);
  const totalBillable = data.reduce((sum, d) => sum + calculateBillableCost(d.uniqueOpens), 0);

  return {
    totalRecipients,
    totalDelivered,
    avgOpenRate: avgOpenRate.toFixed(2),
    avgClickRate: avgClickRate.toFixed(2),
    avgUnsubRate: avgUnsubRate.toFixed(2),
    totalUniqueOpens,
    totalClicks,
    totalUnsubscribes,
    emailCount: data.length,
    totalBillable,
  };
};

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div>
          <p className="text-sm text-muted-foreground">Unsubscribe Rate</p>
          <p className="text-xl font-bold text-foreground">{email.unsubscribeRate}</p>
          <p className="text-xs text-muted-foreground">Unsubscribes: {email.unsubscribes}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PerformanceChart = ({ data }: { data: EmailData[] }) => {
  const chartData = data.map((email) => ({
    date: email.date.split(",")[0],
    openRate: parseFloat(email.openRate),
    clickRate: parseFloat(email.clickRate),
    recipients: email.recipients,
  }));

  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value, name) => {
                  const v = Number(value ?? 0);
                  const n = String(name ?? "");
                  if (n === "recipients") return [v.toLocaleString(), "Recipients"];
                  return [`${v}%`, n === "openRate" ? "Open Rate" : "Click Rate"];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="openRate"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                name="Open Rate"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="clickRate"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))" }}
                name="Click Rate"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="recipients"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--muted-foreground))" }}
                name="Recipients"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <span className="font-semibold">📊 Note:</span> The dip in subscriber count was due to a strategic email list cleaning.
            The good news? <span className="text-primary font-semibold">Engagement went way up!</span> Removing inactive subscribers
            resulted in significantly higher open and click rates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const MonthSummary = ({ data }: { data: EmailData[]; month?: string }) => {
  const averages = calculateMonthlyAverages(data);

  return (
    <div className="space-y-8">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Billing Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Unique Opens</p>
              <p className="text-2xl font-bold text-foreground">{averages.totalUniqueOpens.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPM Rate</p>
              <p className="text-2xl font-bold text-foreground">$100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Total</p>
              <p className="text-3xl font-bold text-primary">${averages.totalBillable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Calculated as: (Unique Opens ÷ 1,000) × $100 CPM
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <MetricCard
          title="Avg Unsubscribe Rate"
          value={`${averages.avgUnsubRate}%`}
          subtitle="Total Unsubscribes"
          subtitleValue={averages.totalUnsubscribes}
          icon={UserMinus}
        />
      </div>

      <PerformanceChart data={data} />

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Individual Emails</h3>
        {data.map((email, index) => (
          <EmailRow key={index} email={email} />
        ))}
      </div>
    </div>
  );
};

export default function InboxAlchemyReportPage() {
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
                href="https://inboxalchemy.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="/inbox-alchemy-logo.png"
                  alt="Inbox Alchemy"
                  className="h-20 md:h-24 bg-white rounded-lg p-3"
                />
              </a>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  Inbox Alchemy
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Newsletter Performance Report • Q4 2025
                </p>
                <a
                  href="https://inboxalchemy.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mt-2 transition-colors"
                >
                  inboxalchemy.co
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Tabs defaultValue="october" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="october">October 2025</TabsTrigger>
              <TabsTrigger value="november">November 2025</TabsTrigger>
              <TabsTrigger value="december">December 2025</TabsTrigger>
            </TabsList>

            <TabsContent value="october">
              <MonthSummary data={octoberData} month="October 2025" />
            </TabsContent>

            <TabsContent value="november">
              <MonthSummary data={novemberData} month="November 2025" />
            </TabsContent>

            <TabsContent value="december">
              <MonthSummary data={decemberData} month="December 2025" />
            </TabsContent>
          </Tabs>

          <footer className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Report generated by Real Good Denver • {new Date().toLocaleDateString()}
            </p>
          </footer>
        </main>
      </div>
    </ReportPasswordGate>
  );
}
