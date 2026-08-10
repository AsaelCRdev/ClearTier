/* Un mensaje dentro del chat del AI Assistant.*/
export interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

/* Una línea individual del diff de cambios propuestos. 
   operation indica si la línea agrega, quita o crea algo nuevo.*/
export interface AiChangeItem {
  operation: 'ADD_ROLE' | 'ALLOW' | 'DENY';
  label: string;
}

/* Representa la solicitud completa hecha a la IA para control del status del flujo.*/
export interface AiChangeRequest {
  id: string;
  promptText: string;
  status: 'DRAFT' | 'COMMITTED' | 'REJECTED';
  items: AiChangeItem[];
  createdAt: string;
}
