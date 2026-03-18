import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "./../hooks/useChat";
import "../../../app/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const chat = useChat();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Init
  useEffect(() => {
    chat.handleGetChats();
    chat.initSocketConnection();
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId]);

  // Open chat (Bug-1 fix)
  const openChat = (chatId) => {
    if (chatId === currentChatId) return;
    chat.handleOpenChat(chatId);
  };

  // Send message (Bug-2 safe)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    if (!currentChatId) {
      console.log("❌ No chat selected");
      return;
    }

    await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setMessage("");
  };

  const currentChat = chats[currentChatId];

  return (
    <div className="h-screen bg-[#07171a] flex items-center justify-center text-white">
      <div className="flex w-full h-full border border-white/10 overflow-hidden bg-[#07171a] p-4">
        {/* Sidebar */}
        <div className="h-full flex flex-col gap-4">
          {/* Logo */}
          <div className="w-72 h-[10%] flex items-center justify-center bg-[#0d2226] rounded-4xl bg-gradient-to-br from-[#31b8c6]/35 to-transparent">
            <h2 className="text-2xl font-semibold text-[#31b8c6]">
              Perplexity
            </h2>
          </div>

          {/* Chat List */}
          <div className="w-72 h-[90%] flex flex-col bg-[#0d2226] p-6 rounded-4xl">
            <h2 className="text-xl font-semibold text-center text-[#31b8c6] mb-6">
              Chat History
            </h2>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
              {Object.values(chats).map((c) => (
                <button
                  key={c.id}
                  onClick={() => openChat(c.id)}
                  className={`w-full text-left px-4 py-2 rounded-xl border transition-all duration-200
                    ${
                      c.id === currentChatId
                        ? "bg-[#31b8c6]/20 border-[#31b8c6] text-[#31b8c6]"
                        : "border-white/10 bg-[#091417] hover:border-[#31b8c6]"
                    }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <button
              onClick={async () => {
                await chat.handleLogout();
              }}
              className="mt-4 rounded-xl cursor-pointer bg-red-500/70 py-2 font-medium hover:bg-red-700"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 ml-6 rounded-[35px] border border-white/10 shadow-xl overflow-hidden bg-[#061517]">
          {/* Header */}
          <div className="flex justify-center border-b border-white/10 px-6 py-3 bg-[#0d2226] bg-gradient-to-br from-[#31b8c6]/25 to-transparent">
            <div className="px-8 py-2 text-[#31b8c6] text-xl font-bold">
              {currentChat?.title || "Select Chat"}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-5">
            {currentChat?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="px-6 py-3 rounded-2xl border border-white/10 max-w-xl shadow bg-[#0d2226]">
                  {msg.role === "ai" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: (props) => (
                          <h1 className="text-xl font-bold mb-2" {...props} />
                        ),
                        h2: (props) => (
                          <h2
                            className="text-lg font-semibold mb-2"
                            {...props}
                          />
                        ),
                        p: (props) => (
                          <p className="mb-2 leading-relaxed" {...props} />
                        ),
                        code: ({ inline, ...props }) =>
                          inline ? (
                            <code
                              className="bg-[#091417] px-1 py-0.5 rounded text-sm"
                              {...props}
                            />
                          ) : (
                            <pre className="bg-[#091417] p-3 rounded-xl overflow-x-auto text-sm">
                              <code {...props} />
                            </pre>
                          ),
                        li: (props) => (
                          <li className="ml-4 list-disc" {...props} />
                        ),
                        strong: (props) => (
                          <strong className="text-[#31b8c6]" {...props} />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Auto Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-4 border-t border-white/10 px-6 py-4 bg-[#0d2226] bg-gradient-to-br from-[#31b8c6]/25 to-transparent"
          >
            <input
              type="text"
              placeholder="Type here ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#091417] rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 border border-white/10 focus:border-[#31b8c6]"
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#31b8c6] text-[#06262b] font-semibold hover:bg-[#57c9d4]"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
