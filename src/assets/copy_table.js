// "Copy table to clipboard" button on the Fluence Table tab.
// Copies the tab-separated text the server renders into the hidden
// #table-copy-text element (optional '# ' params header + table), which
// Excel and Google Sheets paste into separate cells.
// Runs directly in the click handler (not a Dash callback) so the browser
// treats it as a user gesture and allows clipboard access in both WebKit
// (macOS app) and WebView2 (Windows app).
document.addEventListener("click", function (event) {
  if (!event.target.closest("#copy-table-btn")) return;
  var source = document.getElementById("table-copy-text");
  var text = source ? source.textContent : "";
  var status = document.getElementById("table-status");

  function done(ok) {
    if (status) status.innerText = ok ? "Table copied — paste into Excel or Google Sheets." : "Copy failed.";
  }
  if (!text) { if (status) status.innerText = "Nothing to copy yet."; return; }

  function fallback() {
    var area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    done(ok);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
  } else {
    fallback();
  }
});
