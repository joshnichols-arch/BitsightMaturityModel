const exportButton = document.getElementById("export-button");
const exportFormat = document.getElementById("export-format");
const lastUpdated = document.getElementById("last-updated");

function updateTimestamp() {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
}

function escapeCsvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function getTableData() {
  const rows = document.querySelectorAll("#maturity-table tbody tr");
  return Array.from(rows).map((row) =>
    Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim())
  );
}

function exportCsv() {
  const headers = ["Domain", "Capability", "Owner", "Maturity (1-5)"];
  const rows = getTableData();
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(","));
  const content = `${lines.join("\n")}\n`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bitsight-maturity-model-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportPdf() {
  const previousTitle = document.title;
  const filenameBase = `bitsight-maturity-model-${new Date().toISOString().slice(0, 10)}`;
  let restored = false;

  const restore = () => {
    if (restored) {
      return;
    }

    restored = true;
    document.title = previousTitle;
    window.removeEventListener("afterprint", restore);
  };

  // The print dialog allows users to select "Save as PDF".
  window.addEventListener("afterprint", restore);
  document.title = filenameBase;
  window.print();
  setTimeout(restore, 1500);
}

function handleExportClick() {
  if (exportFormat.value === "pdf") {
    exportPdf();
    return;
  }

  exportCsv();
}

updateTimestamp();
exportButton.addEventListener("click", handleExportClick);
