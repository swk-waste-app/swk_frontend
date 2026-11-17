import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuBot, LuMessageCircle, LuSend, LuX } from 'react-icons/lu';
import { toast } from 'sonner';
import { apiAiStatus, apiAiChat } from '../services/ai';
import { brand } from '../config/brand';
import { Button } from './ui';

const GREETING = {
  role: 'assistant',
  content: `Hello, I'm Eco. Ask me about recycling, sorting waste, composting or how ${brand.name} works.`,
};

const BUBBLE = {
  user: 'bg-brand-700 text-white dark:bg-brand-500 dark:text-gray-950',
  assistant: 'border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
};

// Floating assistant for recycling questions. Renders nothing when the backend
// has no AI key configured, so the app works unchanged without it.
const EcoChat = () => {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const signedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    apiAiStatus()
      .then(({ data }) => setEnabled(Boolean(data.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!enabled) return null;

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      // The model requires the conversation to start with a user message,
      // so the canned greeting is not sent.
      const payload = next.slice(next.findIndex((m) => m.role === 'user'));
      const { data } = await apiAiChat(payload);
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      const message = error.response?.status === 401
        ? 'Sign in to chat with Eco.'
        : error.response?.data?.message || 'Eco could not answer. Try again in a moment.';
      toast.error(message);
      setMessages(messages);
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the recycling assistant"
        className="btn btn-primary fixed bottom-5 right-5 z-[90] h-12 w-12 rounded-full p-0 shadow-pop"
      >
        <LuMessageCircle className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <section
      aria-label="Recycling assistant"
      className="fixed bottom-5 right-4 z-[90] flex h-[28rem] max-h-[75vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-pop animate-fade-in dark:border-gray-800 dark:bg-gray-900 sm:right-5"
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
            <LuBot className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-50">Eco</p>
            <p className="text-xs leading-tight text-gray-500 dark:text-gray-400">Recycling assistant</p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="btn btn-ghost -mr-1.5 h-8 w-8 p-0">
          <LuX className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      {!signedIn && (
        <p className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
          <Link to="/signin" className="link">Sign in</Link> to chat with Eco.
        </p>
      )}

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-950" aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === 'user' ? `self-end ${BUBBLE.user}` : `self-start ${BUBBLE.assistant}`
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className={`flex gap-1.5 self-start rounded-xl px-4 py-3.5 ${BUBBLE.assistant}`} role="status" aria-label="Eco is writing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about recycling"
          aria-label="Your question"
          maxLength={1000}
          className="input"
        />
        <Button type="submit" icon={LuSend} disabled={sending || !input.trim()} aria-label="Send" className="h-10 w-10 shrink-0 p-0" />
      </form>
    </section>
  );
};

export default EcoChat;
