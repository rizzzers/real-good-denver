"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface ReportPasswordGateProps {
  children: React.ReactNode;
}

const CORRECT_PASSWORD = "1234";
const STORAGE_KEY = "report_access_granted";

const ReportPasswordGate = ({ children }: ReportPasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessGranted = sessionStorage.getItem(STORAGE_KEY);
    if (accessGranted === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-card-foreground mb-6">Password Required</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 text-center border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {error && (
                <p className="text-sm text-destructive mt-2 text-center">{error}</p>
              )}
            </div>
            <button type="submit" className="w-full h-10 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Access Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPasswordGate;
