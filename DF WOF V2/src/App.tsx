import { useEffect, useRef, useState, type CSSProperties } from "react";
import rosterCapture from "@/imports/d01e69f6-d275-4630-a508-33f609de7bd0.jpg";

type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  group?: string;
};

const lead: Person = { id: "elina", name: "Elīna Miķelsone", role: "Nodaļas vadītāja", initials: "EM", accent: "#d865b5" };
const reports: Person[] = [
  { id: "daniela", name: "Daniela Hrapāne", role: "SkyLab vadītāja", initials: "DH", accent: "#92b7e5", group: "SkyLab" },
  { id: "jevgenija", name: "Jevgēņija Losa", role: "(EU+) un ECROSS projekta administratore", initials: "JL", accent: "#ed947b", group: "Programmas" },
  { id: "emils", name: "Emīls Erciņš", role: "VIP vadītājs", initials: "EE", accent: "#d1b357", group: "VIP" },
  { id: "liga", name: "Līga Veisa", role: "SIG un ECROS speciālists", initials: "LV", accent: "#b2b8d7", group: "SIG & ECROS" },
  { id: "anastasija", name: "Anastasija Bubļik", role: "Grāmatvedības vadītāja", initials: "AB", accent: "#dc8d9b", group: "Finanses" },
  { id: "paula", name: "Paula Čukura", role: "RESIST projekta vadītāja", initials: "PČ", accent: "#d2a961", group: "Projekti" },
  { id: "ivonna", name: "Ivonna Orlova", role: "SIG vadītāja", initials: "IO", accent: "#7c9aba", group: "SIG" },
  { id: "gavriils", name: "Gavriils Kņiga", role: "Ideanblox koordinators", initials: "GK", accent: "#a18dc9", group: "Ideanblox" },
];

const glass = "rgba(255,255,255,0.15)";
const glassStyle: CSSProperties = {
  background: glass,
  backdropFilter: "blur(38px) saturate(1.55)",
  WebkitBackdropFilter: "blur(38px) saturate(1.55)",
  border: "1px solid rgba(255,255,255,0.47)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.72), 0 12px 34px rgba(15,20,30,0.18)",
};

function Avatar({ person, size = 42 }: { person: Person; size?: number }) {
  return <div aria-hidden="true" style={{
    width: size, height: size, flex: "0 0 auto", borderRadius: "50%", display: "grid", placeItems: "center",
    background: `linear-gradient(135deg, ${person.accent}cc, ${person.accent}52)`, color: "rgba(255,255,255,.94)",
    border: "1.5px solid rgba(255,255,255,.64)", boxShadow: `0 3px 14px ${person.accent}66, inset 0 1px 0 rgba(255,255,255,.65)`,
    fontSize: size * .28, fontWeight: 700, letterSpacing: ".02em",
  }}>{person.initials}</div>;
}

function TreeNode({ person, selected, onSelect, leadNode = false, popToken }: { person: Person; selected: boolean; onSelect: () => void; leadNode?: boolean; popToken: number }) {
  return <button key={selected ? `${person.id}-${popToken}` : person.id} onClick={onSelect} className={`tree-node ${leadNode ? "tree-node-lead" : ""} ${selected ? "is-selected" : ""}`} style={{
    ...glassStyle, width: leadNode ? 172 : "100%", minHeight: leadNode ? 190 : 176, borderRadius: leadNode ? 28 : 24,
    padding: leadNode ? "20px 16px 17px" : "17px 13px 15px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", cursor: "pointer",
    outline: selected ? `2px solid ${person.accent}` : "none", outlineOffset: 4,
    ["--person-accent" as string]: person.accent,
  }}>
    <Avatar person={person} size={leadNode ? 61 : 52} />
    <span style={{ minWidth: 0 }}>
      <span style={{ display: "block", color: "rgba(255,255,255,.96)", fontWeight: 700, fontSize: leadNode ? 16 : 13, letterSpacing: "-.025em", lineHeight: 1.15 }}>{person.name}</span>
      <span style={{ display: "block", marginTop: 6, color: "rgba(255,255,255,.67)", fontSize: 10.5, lineHeight: 1.3 }}>{person.role}</span>
    </span>
  </button>;
}

function PermissionScreen({ onRequest, error }: { onRequest: () => void; error: string | null }) {
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at 50% 15%, #5a6688, #171b27 72%)" }}>
    <div style={{ ...glassStyle, maxWidth: 410, padding: 30, borderRadius: 30, textAlign: "center", color: "white" }}>
      <div style={{ fontSize: 34, marginBottom: 14 }}>◌</div><h1 style={{ margin: 0, fontSize: 25, letterSpacing: "-.04em" }}>Open your space</h1>
      <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.55, fontSize: 14 }}>{error || "Enable the camera to place your organization map in the room around you."}</p>
      <button onClick={onRequest} style={{ ...glassStyle, padding: "12px 22px", color: "white", cursor: "pointer", borderRadius: 99, fontWeight: 700 }}>Enable camera</button>
    </div>
  </div>;
}

function ARView({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Person>(lead);
  const [popToken, setPopToken] = useState(0);
  const [rosterOpen, setRosterOpen] = useState(false);
  const selectPerson = (person: Person) => {
    setSelected(person);
    setPopToken((token) => token + 1);
    window.setTimeout(() => window.location.assign("https://df-virtual-cards.vercel.app/elina-mikelsone"), 360);
  };
  useEffect(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.onloadedmetadata = () => { videoRef.current?.play(); setTimeout(() => setReady(true), 160); }; } }, [stream]);

  return <div style={{ position: "fixed", inset: 0, overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
    <video ref={videoRef} muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity .6s" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(16,22,34,.09), rgba(16,22,34,.02) 42%, rgba(16,22,34,.13))" }} />
    <main className="main-overlay" style={{ position: "absolute", inset: 0, zIndex: 10, overflow: "auto", padding: "22px 24px 38px" }}>
      <header style={{ ...glassStyle, maxWidth: 1120, padding: "13px 17px 13px 21px", margin: "0 auto 17px", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div><div style={{ color: "white", fontSize: 20, fontWeight: 700, letterSpacing: "-.04em" }}>Organization map</div><div style={{ color: "rgba(255,255,255,.63)", fontSize: 10.5, marginTop: 3 }}>Wall of Fame · 9 members · spatial view</div></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 99, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.3)", color: "rgba(255,255,255,.82)", fontSize: 11 }}><i style={{ width: 7, height: 7, borderRadius: "50%", background: "#65e98a", boxShadow: "0 0 9px #65e98a" }} />AR live</div>
      </header>

      <section className="tree-shell" style={{ ...glassStyle, maxWidth: 1120, margin: "0 auto", borderRadius: 30, padding: "clamp(20px,3vw,38px)", minHeight: 540, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,.19), transparent 38%)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 26 }}><div><div style={{ color: "rgba(255,255,255,.62)", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 700 }}>People · hierarchy</div><div style={{ color: "white", fontWeight: 700, fontSize: 18, letterSpacing: "-.03em", marginTop: 5 }}>Department constellation</div></div><button onClick={() => setRosterOpen(true)} style={{ ...glassStyle, color: "white", padding: "9px 12px", borderRadius: 99, cursor: "pointer", fontSize: 11 }}>View roster ↗</button></div>

        <div className="org-tree" style={{ position: "relative", zIndex: 1, minWidth: 690 }}>
          <div className="lead-wrap"><TreeNode person={lead} selected={selected.id === lead.id} onSelect={() => selectPerson(lead)} leadNode popToken={popToken} /></div>
          <div className="tree-connector" aria-hidden="true"><span className="lead-stem" /><span className="connector-bar" /></div>
          <div className="report-grid">{reports.map((person) => <div key={person.id} className="report-wrap"><span className="connector-stem" aria-hidden="true" /><TreeNode person={person} selected={selected.id === person.id} onSelect={() => selectPerson(person)} popToken={popToken} /></div>)}</div>
        </div>
      </section>
    </main>



    {rosterOpen && <div role="dialog" aria-modal="true" className="roster-modal" style={{ position: "absolute", inset: 0, zIndex: 40, display: "grid", placeItems: "center", padding: 24, background: "rgba(10,14,22,.32)", backdropFilter: "blur(10px)" }} onClick={() => setRosterOpen(false)}><div onClick={(event) => event.stopPropagation()} style={{ ...glassStyle, maxWidth: 470, width: "100%", borderRadius: 28, padding: 14, color: "white" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 7px 13px" }}><div><b>Original organization roster</b><div style={{ color: "rgba(255,255,255,.6)", fontSize: 10.5, marginTop: 3 }}>Source capture</div></div><button onClick={() => setRosterOpen(false)} style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.35)", color: "white", width: 30, height: 30, borderRadius: "50%", cursor: "pointer" }}>×</button></div><img src={rosterCapture} alt="Organization roster with Elīna Miķelsone and team members" style={{ display: "block", width: "100%", borderRadius: 18 }} /></div></div>}
  </div>;
}

export default function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestCamera = async () => { setError(null); try { const camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }); setStream(camera); } catch (err: unknown) { const message = err instanceof Error ? err.message : String(err); setError(message.includes("denied") || message.includes("NotAllowed") ? "Camera permission denied. Allow access in browser settings and retry." : message.includes("NotFound") ? "No camera found on this device." : `Camera error: ${message}`); } };
  useEffect(() => { requestCamera(); }, []);
  return <>{stream ? <ARView stream={stream} /> : <PermissionScreen onRequest={requestCamera} error={error} />}</>;
}
