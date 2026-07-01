"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
export default function Sidebar({ active }: { active: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ membres: 0, admins: 0, enligne: 0, avatars: [] as string[] });
  const [annoncesNonLues, setAnnoncesNonLues] = useState(0);
  const [chatNonLus, setChatNonLus] = useState(0);
  const [calendrierNonVu, setCalendrierNonVu] = useState(0);

  useLayoutEffect(() => {
    const p = sessionStorage.getItem("sidebar_profile");
    if (p) { const d = JSON.parse(p); setAvatarUrl(d.avatar_url||""); setNom(d.nom||""); setIsAdmin(d.isAdmin||false); }
    const s = sessionStorage.getItem("sidebar_stats");
    if (s) setStats(JSON.parse(s));
    const bc = sessionStorage.getItem("badge_chat");
    if (bc) setChatNonLus(parseInt(bc));
    const bcal = sessionStorage.getItem("badge_calendrier");
    if (bcal) setCalendrierNonVu(parseInt(bcal));
  }, []);

  useEffect(() => {
    const onCalUpdate = () => setCalendrierNonVu(0);
    const onChatUpdate = () => setChatNonLus(0);
    window.addEventListener("badge_calendrier_update", onCalUpdate);
    window.addEventListener("badge_chat_update", onChatUpdate);
    return () => {
      window.removeEventListener("badge_calendrier_update", onCalUpdate);
      window.removeEventListener("badge_chat_update", onChatUpdate);
    };
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
            const n = res.data ? res.data.length : 0; setChatNonLus(n); sessionStorage.setItem("badge_chat", String(n));
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
            const n2 = resEv.data ? resEv.data.length : 0; setCalendrierNonVu(n2); sessionStorage.setItem("badge_calendrier", String(n2));
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
        // Enligne: simulation proportionnelle au nombre de membres, change chaque heure
        const maintenant = new Date();
        const seed = maintenant.getDate() + maintenant.getMonth() * 31 + maintenant.getHours() * 7;
        const pourcentage = 0.25 + ((seed % 21) / 100); // entre 25% et 45%
        const enligne = Math.max(1, Math.min(membres.length, Math.round(membres.length * pourcentage)));
        const avatars = membres.slice(0,4).map((p:any) => p.avatar_url || "");
        const s = { membres: membres.length, admins, enligne, avatars };
        setStats(s); sessionStorage.setItem("sidebar_stats", JSON.stringify(s));
      });
    };
    chargerStats();
    const si = setInterval(chargerStats, 15000);
    return () => { actif = false; clearInterval(si); };
  }, []);

  useEffect(() => {
    const verifierAnnonces = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: vu } = await supabase.from("annonces_vu").select("derniere_visite").eq("user_id", session.user.id).single();
      const dernierVu = vu ? vu.derniere_visite : "1970-01-01";
      const { data } = await supabase.from("annonces").select("id").gt("created_at", dernierVu);
      setAnnoncesNonLues(data ? data.length : 0);
    };
    verifierAnnonces();
    window.addEventListener("annonces_vues", verifierAnnonces);
    const sub = supabase.channel("annonces-badge-" + Math.random())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "annonces" }, verifierAnnonces)
      .subscribe();
    return () => { window.removeEventListener("annonces_vues", verifierAnnonces); supabase.removeChannel(sub); };
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.push("/auth"); };

  const links = [
    { href: "/programme", label: "Programme YMA", emoji: "📚" },
    { href: "/dashboard", label: "Dashboard", emoji: "📊" },
    { href: "/annonces", label: "Annonces", emoji: "📢", badge: annoncesNonLues },
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
      <div className="relative m-3 mb-2 rounded-2xl p-[2px] overflow-hidden">
        <div className="absolute inset-0 animate-shine bg-[length:200%_100%] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="relative bg-gray-900 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_20px_4px_rgba(59,130,246,0.3)]">
          <div className="relative w-14 h-14 flex-shrink-0">
            <div className="absolute -inset-2 bg-blue-500 blur-xl opacity-50 rounded-full" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-700 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-600/50 gap-0">
              <span className="font-bold text-lg leading-none">N</span>
              <span className="font-semibold text-[6px] leading-none tracking-wide">Nezro Academy</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-white whitespace-nowrap">Nezro Academy</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-3">Principal</p>
        {links.map(l => (
          <button key={l.href} onClick={(e) => handleNav(e, l.href)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden relative hover:scale-105 active:scale-95 ${active===l.href ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            {l.emoji} <span className={active===l.href ? "" : "bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shine"}>{l.label}</span>
            {(l as any).badge > 0 && (
              <span className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{(l as any).badge > 9 ? "9+" : (l as any).badge}</span>
            )}
          </button>
        ))}
      </nav>

        <div className="relative">
        <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-[0_0_14px_2px_rgba(59,130,246,0.6)]">
            <p className="text-xs font-bold uppercase tracking-wider mb-3 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">La communauté</p>
            <div className="flex gap-1.5 mb-3">
              {stats.avatars.map((av,i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white/20 shadow-md flex items-center justify-center overflow-hidden">
                  {av ? <img src={av} className="w-8 h-8 object-cover rounded-full" alt="m" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e5e7eb" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-center">
              <div><p className="text-lg font-bold text-white">{stats.membres}</p><p className="text-[11px] text-gray-300 font-medium tracking-wide">Membres</p></div>
              <div><p className="text-lg font-bold text-green-400">{stats.enligne}</p><p className="text-[11px] text-gray-300 font-medium tracking-wide">En ligne</p></div>
              <div><p className="text-lg font-bold text-yellow-500">{stats.admins}</p><p className="text-[11px] text-gray-300 font-medium tracking-wide">Admins</p></div>
            </div>
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

          <div className={`flex items-center gap-3 ${!isAdmin ? "justify-center" : ""}`}>
            <div className={`w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0 ${!isAdmin ? "ml-1" : ""}`}>
              {avatarUrl ? <img src={avatarUrl} className="w-9 h-9 object-cover rounded-full" alt="avatar" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
            </div>
            <div className="min-w-0 flex items-center gap-2 overflow-hidden"><p className={`text-base font-semibold text-white ${isAdmin ? "truncate max-w-[120px]" : "whitespace-nowrap"}`}>{nom||"Membre"}</p>{isAdmin && <span className="flex-shrink-0 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-1.5 py-0.5 rounded-full font-semibold">Admin</span>}</div>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`flex-shrink-0 ${isAdmin ? "-ml-1" : "ml-1 text-lg"} text-gray-400 hover:text-white transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`}>⚙️</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }`}</style>
    </aside>
  );
}
