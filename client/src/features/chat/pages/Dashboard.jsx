import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "./../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const chat = useChat();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  // 🔥 Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // "delete" | "logout"
    chatId: null,
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    chat.handleGetChats();
    chat.initSocketConnection();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chats, currentChatId]);

  const openChat = (chatId) => {
    if (chatId === currentChatId) return;
    chat.handleOpenChat(chatId);
    setShowSidebar(false);
  };

  // ✅ FIXED INPUT CLEAR
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessage(""); // 🔥 instant clear

    try {
      await chat.handleSendMessage({
        message: trimmed,
        chatId: currentChatId || null,
      });
    } catch (err) {
      setMessage(trimmed); // restore if failed
    }
  };

  const currentChat = chats[currentChatId];

  return (
    <div className="h-screen bg-[#07171a] flex items-center justify-center text-white relative">
      {/* Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <div className="flex w-full h-full border border-white/10 overflow-hidden bg-[#07171a] md:p-4">
        
        {/* ================= SIDEBAR ================= */}
        <div
          className={`h-full flex flex-col gap-4 fixed md:relative z-50 bg-[#07171a] md:bg-transparent left-0 top-0 w-72 transition-transform duration-300
          ${showSidebar ? "translate-x-0 " : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex items-center justify-between h-[10%] w-72">
            <div className="w-full flex items-center justify-center border-r border-white/10 bg-[#0d2226] rounded-4xl">
              <h2 className="text-2xl font-semibold py-4 text-[#31b8c6]">
                Perplexity
              </h2>
            </div>

            <button
              onClick={() => setShowSidebar(false)}
              className="md:hidden text-right p-3"
            >
              ✕
            </button>
          </div>

          <div className="w-72 h-[90%] flex flex-col border-r border-white/10 bg-[#0d2226] p-6 rounded-4xl">
            <button
              onClick={() => chat.startNewChat()}
              className="mb-4 rounded-xl bg-[#31b8c6] py-2 font-semibold text-[#06262b]"
            >
              + New Chat
            </button>

            <h2 className="text-xl font-semibold text-center text-[#31b8c6] mb-6">
              Chat History
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {Object.values(chats).map((c) => (
                <div
                  key={c.id}
                  className={`flex justify-between items-center w-full px-4 py-2 rounded-xl border cursor-pointer
        ${
          c.id === currentChatId
            ? "bg-[#31b8c6]/20 border-[#31b8c6] text-[#31b8c6]"
            : "border-white/10 bg-[#091417] hover:border-[#31b8c6]"
        }`}
                  onClick={() => openChat(c.id)}
                >
                  <span>{c.title}</span>

                  {/* 🔥 Delete with confirmation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModal({
                        isOpen: true,
                        type: "delete",
                        chatId: c.id,
                      });
                    }}
                    className="h-6 w-6 text-red-500 hover:bg-red-500 hover:text-white rounded flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-[#31b8c6]">
              {user.email}
            </div>

            {/* 🔥 Logout with confirmation */}
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: "logout",
                  chatId: null,
                })
              }
              className="mt-2 rounded-xl bg-red-500/70 py-2"
            >
              Log out
            </button>
          </div>
        </div>

        {/* ================= CHAT AREA ================= */}
        <div className=" flex flex-col flex-1 md:ml-6 md:rounded-[35px] border border-white/10 overflow-hidden bg-[#061517]">
          
          {/* Header */}
          <div className="flex justify-center items-center relative border-b border-white/10 px-6 py-3 bg-[#0d2226]">
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute left-6 md:hidden"
            >
              ☰
            </button>

            <div className="px-8 py-2 text-[#31b8c6] text-xl font-bold">
              {currentChat?.title || "New Chat"}
            </div>
          </div>

          {/* Messages */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {currentChat?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl ${
                    msg.role === "user"
                      ? "px-4 py-3 rounded-2xl border bg-[#0d2226]"
                      : ""
                  }`}
                >
                  {msg.role === "ai" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loader */}
            {isLoading && currentChatId && (
              <div className="flex">
                <div className="px-4 py-2 rounded-xl bg-[#0d2226] flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-white/10 px-6 py-4 bg-[#0d2226]"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#091417] rounded-xl px-4 py-3 outline-none"
              placeholder="Ask anything..."
            />

            <button className="px-6 py-3 rounded-xl bg-[#31b8c6] text-[#06262b] font-semibold">
              Send
            </button>
          </form>
        </div>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0d2226] p-6 rounded-2xl w-[90%] max-w-sm border border-white/10">
            
            <h2 className="text-lg font-semibold text-center mb-4">
              {confirmModal.type === "delete"
                ? "Delete this chat?"
                : "Are you sure you want to logout?"}
            </h2>

            <div className="flex gap-3">
              {/* Cancel */}
              <button
                onClick={() =>
                  setConfirmModal({ isOpen: false, type: "", chatId: null })
                }
                className="flex-1 py-2 rounded-xl bg-gray-600"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                onClick={() => {
                  if (confirmModal.type === "delete") {
                    chat.handleDeleteChat(confirmModal.chatId);
                  } else {
                    chat.handleLogout();
                  }

                  setConfirmModal({
                    isOpen: false,
                    type: "",
                    chatId: null,
                  });
                }}
                className="flex-1 py-2 rounded-xl bg-red-500"
              >
                {confirmModal.type === "delete" ? "Delete" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;