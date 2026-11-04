"use client";

type Row = { email: string; subscribedAt: string; status: string };

function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function NewsletterCsvButton({ rows }: { rows: Row[] }) {
  function download() {
    const csv = ["Email,Subscribed at,Status", ...rows.map((row) => [row.email, row.subscribedAt, row.status].map(csvCell).join(","))].join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={download} disabled={rows.length === 0} className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
      Download CSV
    </button>
  );
}
