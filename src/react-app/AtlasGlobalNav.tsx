type AtlasGlobalNavProps = {
  hash: string;
};

const routes = [
  { href: "#", label: "Browse", hint: "Database", match: (hash: string) => hash === "" || hash === "#" },
  { href: "#pointing", label: "Setup", hint: "Mouse + shape", match: (hash: string) => hash === "#pointing" },
  { href: "#keyboard-lab", label: "Keyboards", hint: "Boards + switches", match: (hash: string) => hash === "#keyboard-lab" },
  { href: "#sensitivity", label: "Sensitivity", hint: "cm/360", match: (hash: string) => hash === "#sensitivity" },
  { href: "#product-lab", label: "Research", hint: "Evidence", match: (hash: string) => hash === "#product-lab" || hash === "#validation-run" },
];

export default function AtlasGlobalNav({ hash }: AtlasGlobalNavProps) {
  return <header className="atlas-global-nav">
    <a className="atlas-global-brand" href="#" aria-label="Atlas database home">
      <span className="atlas-global-mark" aria-hidden="true"><i/><i/><i/></span>
      <span><b>ATLAS</b><small>input gear intelligence</small></span>
    </a>
    <nav aria-label="Primary Atlas navigation">
      {routes.map(route => <a key={route.href} href={route.href} className={route.match(hash) ? "active" : ""}>
        <b>{route.label}</b><small>{route.hint}</small>
      </a>)}
    </nav>
    <span className="atlas-global-status"><i/> evidence-aware</span>
  </header>;
}
