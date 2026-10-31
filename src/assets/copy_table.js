// "Copy table to clipboard" button on the Fluence Table tab.
// Runs directly in the click handler (not a Dash callback) so the browser
// treats it as a user gesture and allows clipboard access in both WebKit
// (macOS app) and WebView2 (Windows app). Copies tab-separated text, which
// Excel and Google Sheets paste into separate cells.
document.addEventListener("click", function (event) {
  var button = event.target.closest("#copy-table-btn");
  if (!button) return;
  var table = document.getElementById("fluence-table");
  if (!table) return;

  var text = Array.from(table.rows)
    .map(function (row) {
      return Array.from(row.cells).map(function (c) { return c.innerText.trim(); }).join("\t");
    })
    .join("\n");

  function done(ok) {
    var status = document.getElementById("table-status");
    if (status) status.innerText = ok ? "Table copied — paste into Excel or Google Sheets." : "Copy failed.";
  }

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
