import { Suspense, lazy, useEffect, useRef, useState } from "react";
const AtlasJump = lazy(() => import("./AtlasJump"));

type AtlasGlobalNavProps = {
  hash: string;
  onPreload?: (href: string) => void;
};

const routes = [
  { href: "#", label: "Browse", hint: "Database", match: (hash: string) => hash === "" || hash === "#" },
  { href: "#pointing", label: "Setup", hint: "Mouse + shape", match: (hash: string) => hash === "#pointing" },
  { href: "#mousepads", label: "Mousepads", hint: "Surfaces", match: (hash: string) => hash === "#mousepads" },
  { href: "#keyboards", label: "Keyboards", hint: "Boards", match: (hash: string) => hash === "#keyboards" || hash === "#keyboard-lab" },
  { href: "#switches", label: "Switches", hint: "Switch index", match: (hash: string) => hash === "#switches" },
  { href: "#sensitivity", label: "Sensitivity", hint: "cm/360", match: (hash: string) => hash === "#sensitivity" },
  { href: "#product-lab", label: "Research", hint: "Evidence", match: (hash: string) => hash === "#product-lab" || hash === "#validation-run" },
];
const routeIcons = ["panels-top-left", "crosshair", "layers", "keyboard", "circuit-board", "sliders-horizontal", "book-open"];

export default function AtlasGlobalNav({ hash, onPreload }: AtlasGlobalNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [jumpOpen, setJumpOpen] = useState(false);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !event.isComposing && !document.querySelector('[role="dialog"]')) { event.preventDefault(); setJumpOpen(true); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement || navElement.scrollWidth <= navElement.clientWidth) return;
    const activeLink = navElement.querySelector<HTMLElement>('[aria-current="page"]');
    activeLink?.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
  }, [hash]);

  return <header className="atlas-global-nav atlas-sidebar">
    <a className="atlas-global-brand" href="#" aria-label="Atlas database home">
      <img className="atlas-global-mark" src="/atlas-mark.svg?v=compass" alt=""/>
      <span><b>Atlas</b><small>Find your next peripheral</small></span>
    </a>
    <button type="button" className="atlas-jump-trigger" aria-label="Search Atlas" aria-haspopup="dialog" onClick={() => setJumpOpen(true)}><span className="atlas-route-icon" style={{ maskImage:"url(/icons/search.svg)" }} aria-hidden="true"/><span>Search Atlas</span><kbd>Ctrl K</kbd></button>
    <span className="atlas-nav-label">Workspace</span>
    <nav ref={navRef} aria-label="Primary Atlas navigation">
      {routes.map((route, index) => {
        const active = route.match(hash);
        return <a key={route.href} href={route.href} className={active ? "active" : ""} aria-label={route.label} title={route.label} aria-current={active ? "page" : undefined} onMouseEnter={() => onPreload?.(route.href)} onFocus={() => onPreload?.(route.href)} onPointerDown={() => onPreload?.(route.href)}>
        <span className="atlas-route-icon" style={{ maskImage:`url(/icons/${routeIcons[index]}.svg)` }} aria-hidden="true"/><b>{route.label}</b><small>{route.hint}</small>
      </a>;
      })}
    </nav>
    {jumpOpen && <Suspense fallback={null}><AtlasJump onClose={() => setJumpOpen(false)}/></Suspense>}
  </header>;
}
