import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ChatBox({ childId }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadConversation();
  }, [childId]);

  const loadConversation = async () => {
    const res = await api.get(`/chat/conversation/${childId}`);
    setConversation(res.data.conversation);
    loadMessages(res.data.conversation._id);
  };

  const loadMessages = async (cid) => {
    const res = await api.get(`/chat/messages/${cid}`);
    setMessages(res.data.messages);
  };

  const send = async () => {
    if (!text.trim()) return;
    await api.post(`/chat/messages/${conversation._id}`, { text });
    setText("");
    loadMessages(conversation._id);
  };

  if (!conversation) return null;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="font-semibold mb-2">Chat</h3>

      <div className="h-64 overflow-y-auto border p-2 mb-2 space-y-2">
        {messages.map(m => {
          const isParent = m.senderRole === "parent";
          return (
            <div
              key={m._id}
              className={`flex ${isParent ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  isParent
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <div className="font-semibold text-xs mb-1 capitalize">
                  {m.senderRole}
                </div>
                <div>{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Type message..."
        />
        <button onClick={send} className="btn btn-sm btn-primary">
          Send
        </button>
      </div>
    </div>
  );
}
