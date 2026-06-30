"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Sidebar({ active }: { active: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ membres: 0, admins: 0, enligne: 0, avatars: [] as string[] });
  const [chatNonLus, setChatNonLus] = useState(0);
  const [calendrierNonVu, setCalendrierNonVu] = useState(0);

  useLayoutEffect(() => {
    const p = sessionStorage.getItem("sidebar_profile");
    if (p) { const d = JSON.parse(p); setAvatarUrl(d.avatar_url||""); setNom(d.nom||""); setIsAdmin(d.isAdmin||false); }
    const s = sessionStorage.getItem("sidebar_stats");
    if (s) setStats(JSON.parse(s));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    let actif = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || !actif) return;
      supabase.from("profiles").select("avatar_url,nom,role,email").eq("id", session.user.id).single().then(({ data }) => {
        if (!data) return;
        setAvatarUrl(data.avatar_url||"");
        setNom(data.nom||"");
        setIsAdmin(data.email === "dcf676767@gmail.com");
        sessionStorage.setItem("sidebar_profile", JSON.stringify({avatar_url:data.avatar_url||"",nom:data.nom||"",isAdmin:data.email==="dcf676767@gmail.com"}));
      });
      supabase.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", session.user.id);
      const hb = setInterval(() => supabase.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", session.user.id), 20000);

      const chargerNonLus = () => {
        supabase.from("chat_vu").select("derniere_visite").eq("user_id", session.user.id).single().then((resVuChat) => {
          const dateVuChat = resVuChat.data ? resVuChat.data.derniere_visite : "2000-01-01";
          supabase.from("messages").select("id").eq("receiver_id", session.user.id).gt("created_at", dateVuChat).then((res) => {
            console.log("CHAT NONLUS:", res.data, res.error);
            setChatNonLus(res.data ? res.data.length : 0);
          });
        });
      };
      chargerNonLus();
      const nlInterval = setInterval(chargerNonLus, 5000);

      const chargerCalendrierNonVu = () => {
        supabase.from("calendrier_vu").select("derniere_visite").eq("user_id", session.user.id).single().then((resVu) => {
          const dateVu = resVu.data ? resVu.data.derniere_visite : "2000-01-01";
          supabase.from("evenements").select("id").gt("created_at", dateVu).then((resEv) => {
            console.log("EVENEMENTS NON VUS:", resEv.data, resEv.error);
            setCalendrierNonVu(resEv.data ? resEv.data.length : 0);
          });
        });
      };
      chargerCalendrierNonVu();
      const calInterval = setInterval(chargerCalendrierNonVu, 10000);
      return () => { clearInterval(hb); clearInterval(nlInterval); clearInterval(calInterval); };
    });
    const chargerStats = () => {
      supabase.from("profiles").select("avatar_url,role,statut,last_seen").then(({ data }) => {
        if (!data) return;
        const membres = data.filter((p:any) => p.statut === "accepte");
        const admins = data.filter((p:any) => p.role === "admin").length;
        // Enligne: nombre aléatoire basé sur le jour (change chaque jour, entre 3 et 6)
        const seed = new Date().getDate() + new Date().getMonth() * 31;
        const enligne = Math.min(membres.length, 3 + (seed % 4));
        const avatars = membres.slice(0,4).map((p:any) => p.avatar_url || "");
        const s = { membres: membres.length, admins, enligne, avatars };
        setStats(s); sessionStorage.setItem("sidebar_stats", JSON.stringify(s));
      });
    };
    chargerStats();
    const si = setInterval(chargerStats, 15000);
    return () => { actif = false; clearInterval(si); };
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.push("/auth"); };

  const links = [
    { href: "/programme", label: "Programme YMA", emoji: "📚" },
    { href: "/dashboard", label: "Dashboard", emoji: "📊" },
    { href: "/membres", label: "Membres", emoji: "👥" },
    { href: "/ressources", label: "Ressources", emoji: "🛠️" },
    { href: "/classement", label: "Classement", emoji: "🏆" },
    { href: "/calendrier", label: "Calendrier", emoji: "📅", badge: calendrierNonVu },
    { href: "/assistant", label: "Assistant IA", emoji: "🤖" },
    { href: "/chat", label: "Chat", emoji: "💬", badge: chatNonLus },
  ];

  const handleNav = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
    const btn = e.currentTarget; const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const r = document.createElement("span");
    r.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(99,179,255,0.3);left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:ripple 0.6s ease-out forwards;pointer-events:none;z-index:99;`;
    btn.appendChild(r); setTimeout(() => r.remove(), 600); router.push(href);
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-40">
      <div className="p-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0"><span className="text-white font-bold text-sm">N</span></div>
        <h1 className="text-base font-bold text-white">Nezro Academy</h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-3">Principal</p>
        {links.map(l => (
          <button key={l.href} onClick={(e) => handleNav(e, l.href)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden relative hover:scale-105 active:scale-95 ${active===l.href ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            {l.emoji} {l.label}
            {(l as any).badge > 0 && (
              <span className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{(l as any).badge > 9 ? "9+" : (l as any).badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">La communauté</p>
          <div className="flex gap-1 mb-3">
            {stats.avatars.map((av,i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-blue-600 border-2 border-gray-800 flex items-center justify-center overflow-hidden -ml-1 first:ml-0">
                {av ? <img src={av} className="w-7 h-7 object-cover rounded-full" alt="m" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-center">
            <div><p className="text-lg font-bold text-white">{stats.membres}</p><p className="text-xs text-gray-400">Membres</p></div>
            <div><p className="text-lg font-bold text-green-400">{stats.enligne}</p><p className="text-xs text-gray-400">En ligne</p></div>
            <div><p className="text-lg font-bold text-blue-400">{stats.admins}</p><p className="text-xs text-gray-400">Admins</p></div>
          </div>
        </div>

        <div className="relative" ref={menuRef} onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }} onMouseLeave={() => { closeTimer.current = setTimeout(() => setMenuOpen(false), 600); }}>
          {menuOpen && (
            <div className="absolute bottom-14 left-0 right-0 bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50">
              <div className="p-3 border-b border-gray-700">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mon compte</p>
              </div>
              <button onClick={() => { router.push("/profil"); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                <span className="text-base">👤</span>
                <div><p className="font-semibold text-white">Mon profil</p><p className="text-xs text-gray-400">Photo, bio, réseaux</p></div>
              </button>
              <button onClick={() => { router.push("/parametres"); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                <span className="text-base">⚙️</span>
                <div><p className="font-semibold text-white">Paramètres</p><p className="text-xs text-gray-400">Notifications, compte</p></div>
              </button>
              {isAdmin && (
                <button onClick={() => { router.push("/admin"); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                  <span className="text-base">👑</span>
                  <div><p className="font-semibold text-white">Panel Admin</p><p className="text-xs text-gray-400">Gérer les membres</p></div>
                </button>
              )}
              <div className="border-t border-gray-700">
                <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                  <span className="text-base">🚪</span>
                  <div><p className="font-semibold">Se déconnecter</p><p className="text-xs text-red-400/60">Retour à la page d'accueil</p></div>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl ? <img src={avatarUrl} className="w-9 h-9 object-cover rounded-full" alt="avatar" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
            </div>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate flex items-center gap-2">{isAdmin && "👑"} {nom||"Membre"} {isAdmin && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-full font-semibold">Admin</span>}</p></div>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`text-gray-400 hover:text-white transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`}>⚙️</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }`}</style>
    </aside>
  );
}
