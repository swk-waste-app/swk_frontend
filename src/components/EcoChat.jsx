import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import { toast } from 'sonner';
import { apiAiStatus, apiAiChat } from '../services/ai';

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm Eco 🌿 Ask me anything about recycling, waste sorting, composting or how Taka Kipawa works.",
};

// Floating AI chat helper. Renders nothing when the backend has no
// Anthropic key, so the app works unchanged without it.
const EcoChat = () => {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const signedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    apiAiStatus()
      .then(({ data }) => setEnabled(Boolean(data.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open, sending]);

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
        ? 'Please sign in to chat with Eco.'
        : error.response?.data?.message || 'Eco could not answer right now — try again shortly.';
      toast.error(message);
      setMessages(messages);
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with Eco, the AI assistant"
          className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/30 flex items-center justify-center transition-transform duration-200 hover:scale-105"
        >
          <FaComments size={22} />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[90] w-[22rem] max-w-[92vw] h-[28rem] max-h-[75vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 flex flex-col overflow-hidden animate-fade-in">
          <div className="px-4 py-3 bg-green-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"><FaRobot size={15} /></span>
              <div>
                <p className="text-sm font-bold leading-tight">Eco</p>
                <p className="text-[11px] text-green-200 leading-tight">AI recycling assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-full hover:bg-white/15">
              <FaTimes size={14} />
            </button>
          </div>

          {!signedIn && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs border-b border-amber-100 dark:border-amber-900/40">
              <Link to="/signin" className="font-semibold underline">Sign in</Link> to chat with Eco.
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50 dark:bg-gray-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 rounded-bl-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:120ms]" />
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recycling…"
              maxLength={1000}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EcoChat;
