export interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}
 
export interface AiChangeItem {
  operation: 'ADD_ROLE' | 'ALLOW' | 'DENY';
  label: string;
}
 
/* Representa la solicitud completa hecha a la IA.Para manejar su estatus.*/
export interface AiChangeRequest {
  id: string;
  promptText: string;
  status: 'DRAFT' | 'COMMITTED' | 'REJECTED';
  items: AiChangeItem[];
  createdAt: string;
}
 