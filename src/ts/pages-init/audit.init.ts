import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { openModal } from '../components/modal';
import { fetchAuditLogs } from '../api/auditApi';
import { formatTimestamp, csvEscape } from '../utils/formatters';
import type { AuditLogEntry } from '../models/auditLog.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'audit');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const tableBody = document.getElementById('audit-table-body') as HTMLTableSectionElement;
const filterInput = document.getElementById('filter-input') as HTMLInputElement;
const filterDate = document.getElementById('filter-date') as HTMLInputElement;
const exportBtn = document.getElementById('export-csv-btn') as HTMLButtonElement;

let allLogs: AuditLogEntry[] = [];

function getFilteredLogs(): AuditLogEntry[] {
  const text = filterInput.value.toLowerCase();
  const dateFilter = filterDate.value;

  return allLogs.filter((log) => {
    const matchesText = !text || log.actor.toLowerCase().includes(text) || log.action.toLowerCase().includes(text);
    const matchesDate = !dateFilter || log.timestamp.slice(0, 10) === dateFilter;
    return matchesText && matchesDate;
  });
}

function renderTable(): void {
  const logs = getFilteredLogs();
  if (logs.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4" style="color:var(--text-muted);">No hay auditorías que coincidan con el filtro.</td></tr>`;
    return;
  }
  tableBody.innerHTML = logs
    .map(
      (log) => `
      <tr>
        <td style="font-family: Consolas, monospace; font-size:0.85rem;">${formatTimestamp(log.timestamp)}</td>
        <td>${log.actor}</td>
        <td style="color:var(--accent);">${log.action}</td>
        <td>${log.target}</td>
      </tr>`
    )
    .join('');
}

filterInput.addEventListener('input', renderTable);
filterDate.addEventListener('change', renderTable);

/**
 * Genera el archivo CSV en memoria usando un Blob y dispara la descarga
 * creando un <a> temporal con URL.createObjectURL — no requiere backend.
 */
function downloadCsv(logs: AuditLogEntry[]): void {
  const header = 'Timestamp,Actor,Action,Target';
  const rows = logs.map((l) => [formatTimestamp(l.timestamp), l.actor, l.action, l.target].map(csvEscape).join(','));
  const csvContent = [header, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `iam-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url); // libera la memoria reservada para el blob
}

function openPrintPreview(logs: AuditLogEntry[]): void {
  const rows = logs
    .map(
      (l) => `<tr><td>${formatTimestamp(l.timestamp).slice(0, 10)}<br/><span style="font-size:0.75rem;color:#888;">${formatTimestamp(l.timestamp).slice(11)}</span></td><td>${l.actor}</td><td>${l.action} : ${l.target}</td></tr>`
    )
    .join('');

  openModal({
    title: 'Export Audit Log (Print Preview)',
    showConfirm: false,
    bodyHtml: `
      <div style="background:white; color:#111; padding:1rem; border-radius:6px;">
        <h5 style="margin-bottom:0.2rem;">IAM Audit Log Export</h5>
        <p style="color:#666; font-size:0.8rem;">Generated: ${new Date().toLocaleString('en-US')}</p>
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead><tr style="border-bottom:1px solid #ccc;"><th style="text-align:left;padding:6px 4px;">Date</th><th style="text-align:left;padding:6px 4px;">Actor</th><th style="text-align:left;padding:6px 4px;">Action</th></tr></thead>
          <tbody id="print-preview-rows">${rows}</tbody>
        </table>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-warning" id="print-to-pdf-btn"><i class="bi bi-printer me-1"></i>Print to PDF</button>
      </div>
    `,
  });

  // window.print() abre el diálogo de impresión nativo del navegador; ahí el
  // usuario elige "Guardar como PDF" como destino — no requiere ninguna
  // librería de generación de PDF en el cliente.
  document.getElementById('print-to-pdf-btn')?.addEventListener('click', () => window.print());
}

exportBtn.addEventListener('click', () => {
  const logs = getFilteredLogs();
  downloadCsv(logs);
  openPrintPreview(logs);
});

async function loadLogs(): Promise<void> {
  allLogs = await fetchAuditLogs();
  renderTable();
}

loadLogs();
