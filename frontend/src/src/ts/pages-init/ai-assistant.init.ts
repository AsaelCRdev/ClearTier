import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { showToast } from '../components/toast';
import { fetchAiQuota, interpretPrompt, commitAiChanges, discardAiChanges } from '../api/aiApi';
import type { AiChangeRequest } from '../models/aiChange.model';
import type { ChatMessage } from '../models/aiChange.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'ai-assistant');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const chatLog = document.getElementById('chat-log') as HTMLDivElement;
const promptForm = document.getElementById('prompt-form') as HTMLFormElement;
const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
const diffView = document.getElementById('diff-view') as HTMLDivElement;
const commitBtn = document.getElementById('commit-btn') as HTMLButtonElement;
const discardBtn = document.getElementById('discard-btn') as HTMLButtonElement;
const quotaFill = document.getElementById('quota-fill') as HTMLSpanElement;
const quotaLabel = document.getElementById('quota-label') as HTMLSpanElement;

let messages: ChatMessage[] = [
  { role: 'assistant', text: 'I am your IAM assistant powered by the Gemini API. I can help you draft new roles, analyze permissions, or audit user access securely. What do you need?' },
];
let currentDraft: AiChangeRequest | null = null;

function renderChat(): void {
  chatLog.innerHTML = messages
    .map(
      (m) =>
        `<div class="d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}">
           <div class="chat-bubble ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}">${escapeHtml(m.text)}</div>
         </div>`
    )
    .join('');
  chatLog.scrollTop = chatLog.scrollHeight; // auto-scroll al último mensaje
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderDiff(): void {
  if (!currentDraft) {
    diffView.innerHTML = '<span style="color:var(--text-muted);">No active draft.</span>';
    commitBtn.disabled = true;
    discardBtn.disabled = true;
    return;
  }
  diffView.innerHTML = currentDraft.items
    .map((item) => {
      if (item.operation === 'ADD_ROLE') return `<div class="diff-line diff-add-role">+ ${item.label}</div>`;
      if (item.operation === 'ALLOW') return `<div class="diff-line diff-allow">+ ALLOW ${item.label}</div>`;
      return `<div class="diff-line diff-deny">- DENY ${item.label}</div>`;
    })
    .join('');
  commitBtn.disabled = false;
  discardBtn.disabled = false;
}

async function refreshQuota(): Promise<void> {
  const { used, limit } = await fetchAiQuota();
  const pct = Math.min(100, Math.round((used / limit) * 100));
  quotaFill.style.width = `${pct}%`;
  quotaLabel.textContent = `${used}/${limit} today`;
}

promptForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = promptInput.value.trim();
  if (!text) return;

  messages.push({ role: 'user', text });
  renderChat();
  promptInput.value = '';
  promptInput.disabled = true;

  try {
    const result = await interpretPrompt(text);

    if (result.outOfScope) {
      // Regla de negocio: el modelo solo responde sobre objetivos de la alta
      // dirección (gestión de accesos); fuera de ese alcance, reafirma su límite.
      messages.push({ role: 'assistant', text: 'Lo siento, solo puedo ayudarte con configuración de roles, permisos y accesos del sistema. ¿Podrías reformular tu instrucción en esos términos?' });
    } else if (result.request) {
      currentDraft = result.request;
      messages.push({ role: 'assistant', text: `He preparado un borrador de cambios a partir de tu instrucción. Revísalo en el panel "Proposed Changes" y confirma o descarta.` });
      renderDiff();
    }
    renderChat();
  } catch (err) {
    messages.push({ role: 'assistant', text: err instanceof Error ? err.message : 'Ocurrió un error al procesar la solicitud.' });
    renderChat();
  } finally {
    promptInput.disabled = false;
    promptInput.focus();
    await refreshQuota();
  }
});

commitBtn.addEventListener('click', async () => {
  if (!currentDraft) return;
  await commitAiChanges(currentDraft.id);
  showToast('Cambios aplicados y registrados en auditoría', 'success');
  messages.push({ role: 'assistant', text: 'Cambios aplicados correctamente. Quedaron registrados en el historial de auditoría.' });
  currentDraft = null;
  renderChat();
  renderDiff();
});

discardBtn.addEventListener('click', async () => {
  if (!currentDraft) return;
  await discardAiChanges(currentDraft.id);
  showToast('Cambios descartados', 'success');
  currentDraft = null;
  renderDiff();
});

renderChat();
renderDiff();
refreshQuota();
