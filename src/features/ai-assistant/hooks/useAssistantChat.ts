'use client';

import { useState } from 'react';
import { aiAssistantApi } from '../api';
import type { AssistantMessage } from '../types';

export function useAssistantChat() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'Hello. I am the SmartOps AI placeholder. You can test the UI flow here before connecting a real AI backend.',
      createdAt: new Date().toISOString()
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString()
    };

    try {
      setIsSending(true);
      setError(null);
      setMessages((current) => [...current, userMessage]);

      const response = await aiAssistantApi.sendMessage({ message: trimmed });

      setMessages((current) => [...current, response.reply]);
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }

  return {
    messages,
    isSending,
    error,
    sendMessage
  };
}