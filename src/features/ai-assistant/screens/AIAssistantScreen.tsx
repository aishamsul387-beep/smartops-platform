'use client';

import { useState, type FormEvent } from 'react';
import { useAssistantChat } from '../hooks/useAssistantChat';

function getBubbleStyle(role: 'user' | 'assistant') {
  if (role === 'user') {
    return {
      background: '#0f172a',
      color: '#ffffff',
      marginLeft: 'auto'
    };
  }

  return {
    background: '#f8fafc',
    color: '#0f172a',
    marginLeft: '0'
  };
}

export function AIAssistantScreen() {
  const { messages, isSending, error, sendMessage } = useAssistantChat();
  const [draft, setDraft] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = draft;
    setDraft('');
    await sendMessage(next);
  }

  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
          AI Assistant
        </div>
        <div style={{ color: '#475569', lineHeight: 1.6 }}>
          AI assistant UI foundation is ready with safe placeholder responses. Real AI backend
          integration can be added later with access control, logging, and guardrails.
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          minHeight: '360px'
        }}
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                maxWidth: '75%',
                padding: '12px 14px',
                borderRadius: '14px',
                whiteSpace: 'pre-wrap',
                ...getBubbleStyle(message.role)
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '6px' }}>
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px'
        }}
      >
        <label htmlFor="assistant-message" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Message
        </label>
        <textarea
          id="assistant-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a warehouse, inventory, or procurement question..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            resize: 'vertical'
          }}
        />

        {error ? (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca'
            }}
          >
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            type="submit"
            disabled={isSending}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isSending ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              cursor: isSending ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {isSending ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </form>
    </div>
  );
}