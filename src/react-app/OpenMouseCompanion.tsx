import "./openmouse-companion.css";

export default function OpenMouseCompanion() {
  return <section className="openmouse-companion" aria-label="OpenMouse device controls">
    <div><small>DEVICE CONTROLS / EXTERNAL TOOL</small><h3>Set up your mouse with OpenMouse</h3><p>OpenMouse can change DPI, polling rate and other settings on supported devices. Check support for your exact model in its control panel.</p><p>Use a Chromium browser with WebHID support, such as Chrome or Edge. Device access is requested by OpenMouse after you open it. After changing DPI, update your Atlas and Drift setup to match.</p></div>
    <div className="openmouse-links"><a href="https://control.openmouse.app/" target="_blank" rel="noopener noreferrer">Open OpenMouse</a><a href="https://github.com/OpenMouse-Project/openmouse" target="_blank" rel="noopener noreferrer">Source &amp; support</a><small>Opens a separate site. Atlas does not read or change your device settings.</small></div>
  </section>;
}
