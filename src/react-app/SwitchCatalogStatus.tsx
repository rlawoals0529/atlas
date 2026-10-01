import { switches } from "../shared/catalog";
import { extraSwitches } from "../shared/switchCatalogExtras";
import { switchProductImages } from "../shared/switchProductImages";
import type { KeyboardSwitchProduct } from "../shared/types";
import "./switch-catalog-status.css";

const allSwitches = [...switches, ...extraSwitches] as KeyboardSwitchProduct[];

export default function SwitchCatalogStatus() {
  const total = allSwitches.length;
  const explicitMedia = allSwitches.filter(product => Boolean(switchProductImages[product.id])).length;
  const manufacturerSourced = allSwitches.filter(product => product.sources.some(source => source.kind === "manufacturer")).length;
  const forcePublished = allSwitches.filter(product => product.specs.initialForce || product.specs.actuationForce || product.specs.bottomOutForce).length;
  const preTravelPublished = allSwitches.filter(product => product.specs.preTravelMm != null).length;
  const magnetic = allSwitches.filter(product => product.specs.technology === "hall-effect" || product.specs.technology === "tmr");
  const magneticWithCompatibility = magnetic.filter(product => product.specs.compatibility?.length).length;

  const metrics = [
    ["Explicit product media", explicitMedia, total],
    ["Manufacturer source", manufacturerSourced, total],
    ["Published force point", forcePublished, total],
    ["Published pre-travel", preTravelPublished, total],
    ["Magnetic compatibility note", magneticWithCompatibility, magnetic.length],
  ] as const;

  return <section className="switch-catalog-status" aria-labelledby="switch-catalog-status-title">
    <header>
      <div><span>CATALOG COVERAGE</span><h2 id="switch-catalog-status-title">What Atlas actually has on file</h2></div>
      <p>These counts report field presence, not product quality or market coverage. Missing data stays missing instead of being inferred.</p>
    </header>

    <div className="switch-catalog-status-grid">
      {metrics.map(([label, value, denominator]) => <article key={label}>
        <span>{label}</span>
        <div><b>{value}</b><small>/ {denominator}</small></div>
        <i aria-hidden="true"><em style={{ width: `${denominator ? (value / denominator) * 100 : 0}%` }}/></i>
      </article>)}
    </div>

    <div className="switch-compatibility-guide">
      <div>
        <span>HALL-EFFECT / TMR COMPATIBILITY</span>
        <h3>“Magnetic” does not mean universally interchangeable.</h3>
        <p>Atlas keeps board compatibility notes separate because the switch is only one part of the sensing system.</p>
      </div>
      <ul>
        <li><b>Polarity and magnetic range matter.</b><span>Two Hall-effect switches can use different magnet orientation or flux behavior.</span></li>
        <li><b>The PCB and sensor implementation matter.</b><span>Board geometry, sensor placement and supported calibration range can change what works reliably.</span></li>
        <li><b>Firmware support matters.</b><span>A physically fitting switch can still require board-specific calibration or explicit firmware support.</span></li>
      </ul>
    </div>
  </section>;
}
