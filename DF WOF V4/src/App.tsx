import { useEffect, useRef, useState } from "react";

type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  x: number;
  y: number;
  level: "root" | "lead" | "member";
  photo?: string;
};

type Point = { x: number; y: number };

const people: Person[] = [
  { id: "elina", name: "Elīna Miķelsone", role: "Nodaļas vadītāja", initials: "EM", accent: "#e386c7", x: 0, y: -42, level: "root" },
  { id: "daniela", name: "Daniela Hrapāne", role: "SkyLab vadītāja", initials: "DH", accent: "#9ec6ef", x: -55, y: 20, level: "lead" },
  { id: "jevgenija", name: "Jevgēņija Losa", role: "Programmu administratore", initials: "JL", accent: "#f0a184", x: -18, y: 20, level: "lead" },
  { id: "emils", name: "Emīls Erciņš", role: "VIP vadītājs", initials: "EE", accent: "#dbc265", x: 18, y: 20, level: "lead" },
  { id: "liga", name: "Līga Veisa", role: "SIG un ECROS speciāliste", initials: "LV", accent: "#b8c0e3", x: 55, y: 20, level: "lead" },
  { id: "anastasija", name: "Anastasija Bubļik", role: "Grāmatvedības vadītāja", initials: "AB", accent: "#e59aa6", x: -55, y: 64, level: "member" },
  { id: "paula", name: "Paula Čukura", role: "RESIST projekta vadītāja", initials: "PČ", accent: "#dfb66c", x: -18, y: 64, level: "member" },
  { id: "ivonna", name: "Ivonna Orlova", role: "SIG vadītāja", initials: "IO", accent: "#8eafd0", x: 18, y: 64, level: "member" },
  { id: "gavriils", name: "Gavriils Kņiga", role: "Ideanblox koordinators", initials: "GK", accent: "#b39ed8", x: 55, y: 64, level: "member" },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function CameraPermission({ onRequest, error }: { onRequest: () => void; error: string | null }) {
  return <div className="permission-screen">
    <section className="permission-card">
      <span className="permission-orb" aria-hidden="true" />
      <p className="eyebrow">Wall of Fame · spatial edition</p>
      <h1>Open your space.</h1>
      <p className="permission-copy">The Wall of Fame lives in your space. Drag across the camera view to explore the organization, one person at a time.</p>
      {error && <p className="permission-error">{error}</p>}
      <button className="glass-button" onClick={onRequest}>Enable camera</button>
    </section>
  </div>;
}

function ARView({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [aim, setAim] = useState<Point>({ x: 0, y: 0 });
  const [overview, setOverview] = useState(false);
  const aimRef = useRef<Point>({ x: 0, y: 0 });
  const dragRef = useRef<{ pointerId: number; x: number; y: number; aim: Point } | null>(null);

  const nearest = people.reduce((best, person) => Math.hypot(aim.x - person.x, aim.y - person.y) < Math.hypot(aim.x - best.x, aim.y - best.y) ? person : best);
  const distance = Math.hypot(aim.x - nearest.x, aim.y - nearest.y);
  const focused = distance < 20 ? nearest : null;

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play();
      window.setTimeout(() => setReady(true), 140);
    };
  }, [stream]);

  const resetView = () => {
    aimRef.current = { x: 0, y: 0 };
    setAim({ x: 0, y: 0 });
  };

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, aim: aimRef.current };
  };

  const moveDrag = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (overview && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4) setOverview(false);
    const next = {
      x: clamp(drag.aim.x - (event.clientX - drag.x) * 0.34, -205, 205),
      y: clamp(drag.aim.y - (event.clientY - drag.y) * 0.34, -132, 154),
    };
    aimRef.current = next;
    setAim(next);
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const openOverview = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    resetView();
    setOverview(true);
  };

  return <div className="ar-scene" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
    <div className={`wall-field ${overview ? "is-overview" : ""}`} aria-hidden="true">
      <div className="wall-field-label">ORGANIZATION · {people.length} MEMBERS</div>
      <div className="wall-structure wall-structure-top" />
      <div className="wall-structure wall-structure-bottom" />
      {people.map((person) => {
        const relativeX = person.x - aim.x;
        const relativeY = person.y - aim.y;
        const personDistance = Math.hypot(relativeX, relativeY);
        const isNearest = person.id === nearest.id;
        const isFocused = person.id === focused?.id;
        const isRevealed = true;
        return <div className={`wall-person level-${person.level} ${isRevealed ? "is-revealed" : ""} ${isNearest ? "is-nearest" : ""} ${isFocused ? "is-focused" : ""}`} key={person.id} style={{ "--wall-x": relativeX, "--wall-y": relativeY, "--person-accent": person.accent, "--proximity": clamp(1 - personDistance / 270, 0.18, 1) } as React.CSSProperties}>
          <span className={`wall-person-orb ${person.photo ? "has-photo" : ""}`}>
            {person.photo ? <img src={person.photo} alt={`Portrait of ${person.name}`} /> : person.initials}
          </span>
          <span className="wall-person-name">{person.name}</span>
          <span className="wall-person-role">{person.role}</span>
        </div>;
      })}
    </div>
    <video ref={videoRef} muted playsInline className={`camera-feed ${ready ? "is-ready" : ""}`} />
    <div className="camera-wash" />
    <div className="grain" />
    <header className="ar-header">
      <div><p className="eyebrow">Spatial directory</p><h1>Hall of Fame</h1></div>
      <div className="tracking-pill"><i className="is-tracking" />Drag to explore</div>
    </header>
    <main className="viewfinder" aria-label="Spatial Hall of Fame viewfinder">
      <div className="viewfinder-corner corner-tl" /><div className="viewfinder-corner corner-tr" />
      <div className="viewfinder-corner corner-bl" /><div className="viewfinder-corner corner-br" />
      <div className="center-reticle" aria-hidden="true"><span /><span /></div>
      <div className={`exploration-prompt ${focused ? "is-focused" : ""}`}>
        <span className="search-ring" />
        <p>{focused ? "Exploring the wall" : <>Drag through the<br />organization tree</>}</p>
      </div>
    </main>
    <footer className="ar-footer">
      <div><span className="aim-dot" /> {focused ? `${focused.name} · explored` : "Drag to scan the organization"}</div>
      <div className="footer-actions">
        <button className="recenter-button overview-button" onPointerDown={openOverview}>Overview</button>
        <button className="recenter-button" onPointerDown={(event) => { event.stopPropagation(); resetView(); }}>Reset view</button>
      </div>
      <p>{Math.round(aim.x)}° · {Math.round(aim.y)}°</p>
    </footer>
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
    } catch (caught: unknown) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setError(message.includes("denied") || message.includes("NotAllowed") ? "Camera permission was denied. Allow access in your browser settings and retry." : "The camera could not be opened. Please try again.");
    }
  };
  useEffect(() => { requestCamera(); }, []);
  return stream ? <ARView stream={stream} /> : <CameraPermission onRequest={requestCamera} error={error} />;
}
