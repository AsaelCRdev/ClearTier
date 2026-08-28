import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { fetchUsers } from '../api/userApi';
import { fetchRoles } from '../api/roleApi';
import { fetchPermissionMatrix } from '../api/permissionApi';
import { fetchAuditLogs } from '../api/auditApi';
import { Chart, ChartConfiguration, registerables, TimeScaleOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';



//si no hay sesión, esto redirige y detiene el resto del script.
const session = requireAuth();

//Layout mostrando como marcado el das dashboard
renderSidebar('sidebar-root', 'dashboard');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

//para habilitar globalmente los componentes de la libreria
Chart.register(...registerables);

//ajustes golbales de estilo(debo ver si cambio lo posible del css en linea al main.css)
Chart.defaults.color = 'rgba(255, 255, 255, 0.6)';
Chart.defaults.font.family = 'system-ui, -apple-system, sans-serif';

let evolutionChart: Chart | null = null;
let currentAuditLogs: { timestamp: string }[] = [];

const mainColor = '#f5a623';
const darkBg = '#1e232b';

function generateChartData(logs: { timestamp: string }[], mode: '24h' | 'year'): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = [];
  const now = new Date();

  if (mode === '24h') {
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const start = time.getTime();
      const end = start + 60 * 60 * 1000;
      data.push({ x: start, y: logs.filter((log) => {
        const timestamp = new Date(log.timestamp).getTime();
        return timestamp >= start && timestamp < end;
      }).length });
    }
  } else {
    const currentYear = now.getFullYear();
    for (let i = 0; i < 12; i++) {
      const time = new Date(currentYear, i, 1);
      data.push({ x: time.getTime(), y: logs.filter((log) => {
        const timestamp = new Date(log.timestamp);
        return timestamp.getFullYear() === currentYear && timestamp.getMonth() === i;
      }).length });
    }
  }
  return data;
}

function initChart(logs: { timestamp: string }[]): void {
  const canvas = document.getElementById('usersEvolutionChart') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const initialData = generateChartData(logs, '24h');

  // Gradiente para el fondo oscuro
  const gradient = ctx.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, 'rgba(245, 166, 35, 0.3)'); 
  gradient.addColorStop(1, 'rgba(245, 166, 35, 0.0)');

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Acciones realizadas',
        data: initialData,
        borderColor: mainColor,
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: darkBg,
        pointBorderColor: mainColor,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: mainColor,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          padding: 12,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: mainColor,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleFont: { size: 13 },
          bodyFont: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: { hour: 'HH:mm', month: 'MMM yyyy' }
          },
          grid: { 
            color: 'rgba(255, 255, 255, 0.05)',
            tickLength: 0
          },
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: false,
          grid: { 
            color: 'rgba(255, 255, 255, 0.05)',
            tickLength: 0 
          },
          border: { 
            display: false,
             dash: [5, 5]
          }
        }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  };

  evolutionChart = new Chart(ctx, config);
}

function setupChartInteractions(): void {
  const btn24h = document.getElementById('filter-24h') as HTMLInputElement;
  const btnYear = document.getElementById('filter-year') as HTMLInputElement;

  btn24h?.addEventListener('change', () => {
    if (!evolutionChart) return;
    evolutionChart.data.datasets[0].data = generateChartData(currentAuditLogs, '24h');

    const xScale = evolutionChart.options.scales?.x as TimeScaleOptions | undefined;
    if (xScale?.time) {
     xScale.time.unit = 'hour';
    }

    evolutionChart.update();
  });

  btnYear?.addEventListener('change', () => {
    if (!evolutionChart) return;
    evolutionChart.data.datasets[0].data = generateChartData(currentAuditLogs, 'year');

    const xScale = evolutionChart.options.scales?.x as TimeScaleOptions | undefined;
    if (xScale?.time) {
     xScale.time.unit ='month';
    }
    evolutionChart.update();
  });
}

// Carga de métricas usando Promise.all para pedir todo en paralelo en vez de hacer que espere a los fecth uno detras de otro
async function loadMetrics() {
  const [users, roles, matrix, logs] = await Promise.all([
    fetchUsers(),
    fetchRoles(),
    fetchPermissionMatrix(),
    fetchAuditLogs(),
  ]);

  
  void users;
  currentAuditLogs = logs;
  const totalUsers = roles.reduce((sum, r) => sum + r.usersCount, 0);
  document.getElementById('metric-total-users')!.textContent = totalUsers.toLocaleString('en-US');

  document.getElementById('metric-active-roles')!.textContent = String(roles.length);

  const grantedPermissions = matrix.filter((cell) => cell.effect !== 'UNSET').length;
  document.getElementById('metric-permissions')!.textContent = String(grantedPermissions);

  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recentChanges = logs.filter((log) => new Date(log.timestamp).getTime() >= since).length;
  document.getElementById('metric-recent-changes')!.textContent = String(recentChanges || logs.length);

  initChart(logs);
    initChart(logs);
  setupChartInteractions();
}

loadMetrics();
