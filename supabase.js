
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabaseUrl = "https://frtvvqdvdwjzrxnvcrgy.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHZ2cWR2ZHdqenJ4bnZjcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODExNTYsImV4cCI6MjA5Nzk1NzE1Nn0.ip-Gx4OjjEAAvCDdNjJXLonUAtaEll5nUJRalaYh6Cs";

export const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseUrl = "https://frtvvqdvdwjzrxnvcrgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHZ2cWR2ZHdqenJ4bnZjcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODExNTYsImV4cCI6MjA5Nzk1NzE1Nn0.ip-Gx4OjjEAAvCDdNjJXLonUAtaEll5nUJRalaYh6Cs";
const supabase = createClient(supabaseUrl, supabaseKey);

// Afficher / cacher Connexion / Déconnexion
async function updateAuthUI() {
    const { data } = await supabase.auth.getUser();
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (data.user) {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    } else {
        loginLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
}

updateAuthUI();

// Déconnexion
document.getElementById("logout-link")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.reload();
});

supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    loadMessages();
  })
  .subscribe();
