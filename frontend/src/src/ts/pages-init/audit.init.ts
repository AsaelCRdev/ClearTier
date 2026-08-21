import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { openModal } from '../components/modal';
import { fetchAuditLogs } from '../api/auditApi';
import { formatTimestamp } from '../utils/formatters';
import type { AuditLogEntry } from '../models/auditLog.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'audit');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const tableBody = document.getElementById('audit-table-body') as HTMLTableSectionElement;
const filterInput = document.getElementById('filter-input') as HTMLInputElement;
const filterDate = document.getElementById('filter-date') as HTMLInputElement;
const exportBtn = document.getElementById('export-pdf-btn') as HTMLButtonElement;

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
    tableBody.innerHTML = `
    <tr>
       <td colspan="4" 
         class="text-center py-4" 
         style="color:var(--text-muted);">
           No hay auditorías que coincidan con el filtro.
       </td>
    </tr>`;
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

/* Genera el documento PDFy empieza su descarga.
 */
function downloadPdf(logs: AuditLogEntry[]): void {
  const doc = new jsPDF();

  // Encabezado deel pdf
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Clear Tier Log Export', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleString('en-US')}`, 14, 28);

  // construyendo las filas que tendra
  const tableRows = logs.map((l) => [
    formatTimestamp(l.timestamp),
    l.actor,
    `${l.action} : ${l.target}`
  ]);

  // generar el formato que tendra la taba de las auditorias si quieren esto aqui se puede perzonalizar mas
  autoTable(doc, {
    startY: 35,
    head: [['Date', 'Actor', 'Action']],
    body: tableRows,
    theme: 'plain',
    headStyles: {
      fontStyle: 'bold',
      textColor: [0, 0, 0],
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },
  });

  // Descarga del archivo y definicion del nombre del mismo
  doc.save(`ClearTier-audit-log-${new Date().toISOString().slice(0, 10)}.pdf`);
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
        <h5 style="margin-bottom:0.2rem;">ClearTier Log Export</h5>
        <p style="color:#666; font-size:0.8rem;">Fecha de Emisión: ${new Date().toLocaleString('en-US')}</p>
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
           <tr style="border-bottom:1px solid #ccc;">
             <th style="text-align:left;padding:6px 4px;">Date</th>
             <th style="text-align:left;padding:6px 4px;">Actor</th>
             <th style="text-align:left;padding:6px 4px;">Action</th>
          </tr>
          </thead>
          <tbody id="print-preview-rows">${rows}</tbody>
        </table>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-warning" id="print-to-pdf-btn"><i class="bi bi-printer me-1"></i>Print to PDF</button>
      </div>
    `,
  });

  // Al hacer clic en el botón dorado se ejecuta la descarga del PDF
  document.getElementById('print-to-pdf-btn')?.addEventListener('click', () => {
    downloadPdf(logs);
  });
}

// Únicamente abre el modal de vista previa
exportBtn.addEventListener('click', () => {
  const logs = getFilteredLogs();
  openPrintPreview(logs);
});

async function loadLogs(): Promise<void> {
  allLogs = await fetchAuditLogs();
  renderTable();
}

loadLogs();