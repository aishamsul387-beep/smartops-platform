export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AssistantChatRequest {
  message: string;
}

export interface AssistantChatResponse {
  reply: AssistantMessage;
}