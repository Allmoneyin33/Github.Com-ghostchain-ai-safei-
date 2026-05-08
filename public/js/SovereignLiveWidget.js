(function () {
    const WIDGET_ID = 'omega-telemetry-v158';
    if (document.getElementById(WIDGET_ID)) return;
    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.style.cssText = `position:fixed;bottom:20px;right:20px;width:350px;background:#080808;border:2px solid #ff4500;border-radius:12px;padding:15px;color:#ffffff;font-family:monospace;z-index:9999;box-shadow:0 0 20px rgba(255,69,0,0.4);`;
    const date = new Date().toLocaleTimeString();
    widget.innerHTML = `
        <div style="border-bottom:1px solid #ff4500;padding-bottom:5px;margin-bottom:10px;color:#ff4500;">⚡³³ GHOSTCHAIN OMEGA v1.5.8</div>
        <div style="font-size:12px;">
            <div>STATUS: <span style="color:#0f0">SOVEREIGN_LIVE</span></div>
            <div>COMPUTE: AMD MI300X (HBM3)</div>
            <div>ESCROW: SafeFi Gated</div>
            <div>ID: T. Giatano Jones</div>
        </div>
        <div style="margin-top:10px;font-size:10px;color:#666;">[${date}] >> HANDSHAKE SECURE</div>
    `;
    document.body.appendChild(widget);
})();
