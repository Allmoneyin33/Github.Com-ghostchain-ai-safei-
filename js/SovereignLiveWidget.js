(function () {
    const WIDGET_ID = 'sov-preview-widget-v33';
    if (document.getElementById(WIDGET_ID)) return;
    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 340px;
        height: 420px;
        background-color: #0d0d0d;
        border: 1px solid #ff4500;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.85);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #ffffff;
        padding: 16px;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: hidden;
    `;
    widget.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px;">
            <strong style="color: #ff4500; font-size: 14px;">⚡³³ ALLMONEYIN33: ACTIVE</strong>
            <button id="sov-close-btn" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 16px;">&times;</button>
        </div>
        <div id="sov-metrics" style="margin-top: 12px; font-size: 12px; flex-grow: 1; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Environment:</span>
                <span style="color: #00ff00;">v33-ALL TOTALITY</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Platforms:</span>
                <span style="color: #00ff00;">Multi-Cloud / Desktop</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Shield:</span>
                <span style="color: #00ff00;">U.D.A.W.G. LOCKED</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Bridge:</span>
                <span style="color: #00ff00;">CCTP V2 SYNCED</span>
            </div>
            <div style="margin-top: 16px; padding: 10px; background-color: #161616; border-radius: 6px;">
                <em>Runtime Logs:</em>
                <div style="color: #d4d4d4; font-family: monospace; font-size: 10px; margin-top: 4px;">
                   Pulse telemetry online...
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid #333; padding-top: 8px; font-size: 10px; color: #666; text-align: center;">
            ERC-8004 Identity Layer Verified
        </div>
    `;
    document.body.appendChild(widget);
    document.getElementById('sov-close-btn').addEventListener('click', () => widget.remove());
})();
