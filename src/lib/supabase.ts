import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xrpbjtdbwuodfixgpapx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycGJqdGRid3VvZGZpeGdwYXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTMwMjUsImV4cCI6MjA2MjgyOTAyNX0.MQvIzfrm1qNCmLAxX8bIxaPMXl_7v6JHrRS6Wr1QpY8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
