import { useEffect, useRef, useState } from "react";
import pranikaPhoto from "@/imports/SwapTheProblem-76.jpg";
import shivPhoto from "@/imports/SwapTheProblem-77.jpg";
import matinPhoto from "@/imports/SwapTheProblem-78.jpg";
import wenTingPhoto from "@/imports/SwapTheProblem-87.jpg";
import teamPhoto from "@/imports/SwapTheProblem-89.jpg";

type Member = {
  id: string;
  name: string;
  accent: string;
  photo: string;
  crop?: string;
};

const members: Member[] = [
  { id: "pranika", name: "Pranika", accent: "#b7f8ff", photo: pranikaPhoto, crop: "50% 28%" },
  { id: "shiv", name: "Shiv", accent: "#79eaff", photo: shivPhoto, crop: "50% 28%" },
  { id: "matin", name: "Matin", accent: "#9baeff", photo: matinPhoto, crop: "50% 27%" },
  { id: "wen-ting", name: "Wen Ting", accent: "#c0b4ff", photo: wenTingPhoto, crop: "50% 27%" },
];

const teamDestination = "https://df-virtual-cards.vercel.app/elina-mikelsone";

function PortraitProjection({ member, selected, onSelect, popToken }: { member: Member; selected: boolean; onSelect: () => void; popToken: number }) {
  return (
    <button
      key={selected ? `${member.id}-${popToken}` : member.id}
      className={`member-node ${selected ? "is-selected" : ""}`}
      style={{ "--accent": member.accent } as React.CSSProperties}
      onClick={onSelect}
      aria-label={`Project ${member.name}'s profile`}
    >
      <span className="projector-beam" aria-hidden="true" />
      <span className="holo-corner holo-corner-tl" aria-hidden="true" />
      <span className="holo-corner holo-corner-br" aria-hidden="true" />
      <span className="portrait-frame">
        <img src={member.photo} alt={`${member.name} from Team SWUP`} style={{ objectPosition: member.crop }} />
        <span className="portrait-scan" aria-hidden="true" />
      </span>
      <span className="member-copy"><small>TEAM SWUP / 0{members.indexOf(member) + 1}</small><strong>{member.name}</strong><span>Maker</span></span>
      <span className="project-label">tap to project <b>↗</b></span>
    </button>
  );
}

function TeamProjection({ selected, onSelect, popToken }: { selected: boolean; onSelect: () => void; popToken: number }) {
  return (
    <button key={selected ? `swup-${popToken}` : "swup"} className={`team-node ${selected ? "is-selected" : ""}`} onClick={onSelect} aria-label="Project Team SWUP profile">
      <span className="team-beam" aria-hidden="true" />
      <span className="team-photo-wrap"><img src={teamPhoto} alt="Team SWUP together" /><span className="team-photo-scan" aria-hidden="true" /></span>
      <span className="team-copy"><small>HACKATHON WINNERS</small><strong>TEAM SWUP</strong><span>4 makers · one signal</span></span>
      <span className="team-status">WINNING TRANSMISSION <b>✦</b></span>
    </button>
  );
}

function PermissionScreen({ onRequest, error }: { onRequest: () => void; error: string | null }) {
  return <div className="permission-screen"><div className="permission-card">
    <div className="permission-orb">✦</div><p className="eyebrow">AR / SWUP PROTOCOL</p><h1>Open the stage<br />in your space.</h1>
    <p>{error || "Enable your camera to place Team SWUP’s holographic victory projection directly in your room."}</p>
    <button onClick={onRequest}>Enable camera <span>↗</span></button>
  </div></div>;
}

function ARView({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState("swup");
  const [popToken, setPopToken] = useState(0);
  const project = (id: string) => {
    setSelected(id);
    setPopToken((token) => token + 1);
    window.setTimeout(() => window.location.assign(teamDestination), 520);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.onloadedmetadata = () => { void video.play(); window.setTimeout(() => setReady(true), 140); };
  }, [stream]);

  return <div className="ar-stage">
    <video ref={videoRef} muted playsInline className={`camera-feed ${ready ? "is-ready" : ""}`} />
    <div className="fallback-environment" aria-hidden="true" />
    <div className="camera-grade" aria-hidden="true" />
    <div className="global-scanlines" aria-hidden="true" />
    <div className="scan-sweep" aria-hidden="true" />

    <main className="main-overlay">
      <header className="top-hud">
        <div className="brand-lockup"><span className="brand-mark">✦</span><div><p>HACKATHON 2026</p><h1>Wall of Fame</h1></div></div>
        <div className="live-status"><i /> LIVE ROOM TRACKING <span>98.4%</span></div>
      </header>

      <section className="victory-intro">
        <div><p className="eyebrow">WINNER SIGNAL / 01</p><h2>One team.<br /><em>Full momentum.</em></h2></div>
        <p className="intro-note">Team SWUP<br />beamed into your room.</p>
      </section>

      <section className="projection-field" aria-label="Team SWUP holographic projection">
        <div className="field-caption"><span>TEAM CONSTELLATION / SWUP</span><span>FLOOR ANCHORED</span></div>
        <div className="team-constellation">
          <TeamProjection selected={selected === "swup"} onSelect={() => project("swup")} popToken={popToken} />
          <div className="constellation-link" aria-hidden="true"><span /><i /></div>
          <div className="member-grid">{members.map((member) => <div className="member-wrap" key={member.id}><span className="member-stem" aria-hidden="true" /><PortraitProjection member={member} selected={selected === member.id} onSelect={() => project(member.id)} popToken={popToken} /></div>)}</div>
        </div>
      </section>

      <footer className="bottom-hud"><span>SELECT A PROJECTION TO MEET TEAM SWUP</span><span>⌖ HORIZONTAL PLANE LOCKED</span></footer>
    </main>
  </div>;
}

export default function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestCamera = async () => {
    setError(null);
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      setStream(camera);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message.includes("denied") || message.includes("NotAllowed") ? "Camera permission denied. Allow access in browser settings and retry." : message.includes("NotFound") ? "No camera found on this device." : `Camera error: ${message}`);
    }
  };
  useEffect(() => { void requestCamera(); }, []);
  return stream ? <ARView stream={stream} /> : <PermissionScreen onRequest={requestCamera} error={error} />;
}
