
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabaseUrl = "https://ljhizncikukcddsbkdxv.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaGl6bmNpa3VrY2Rkc2JrZHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTU4MzMsImV4cCI6MjA5OTI3MTgzM30.zHWJk4AM9ODijSJWMebk0YD565IX82ShmVKwsqoGidg";

export const supabase = createClient(supabaseUrl, supabaseKey);

