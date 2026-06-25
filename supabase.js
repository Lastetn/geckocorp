
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabaseUrl = "https://frtvvqdvdwjzrxnvcrgy.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHZ2cWR2ZHdqenJ4bnZjcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODExNTYsImV4cCI6MjA5Nzk1NzE1Nn0.ip-Gx4OjjEAAvCDdNjJXLonUAtaEll5nUJRalaYh6Cs";

export const supabase = createClient(supabaseUrl, supabaseKey);
