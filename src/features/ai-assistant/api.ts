import type {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantMessage
} from './types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildReply(message: string): AssistantMessage {
  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content:
      `SmartOps AI placeholder response:\n\n` +
      `I received your request: "${message}".\n\n` +
      `At this stage, this module is running with safe mock behavior only. ` +
      `Later we can connect this to a controlled backend AI endpoint with permissions, observability, and guardrails.`,
    createdAt: new Date().toISOString()
  };
}

export const aiAssistantApi = {
  async sendMessage(payload: AssistantChatRequest): Promise<AssistantChatResponse> {
    await delay(250);

    return {
      reply: buildReply(payload.message)
    };
  }
};