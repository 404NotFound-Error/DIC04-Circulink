import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Loader, AlertCircle, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient, MessageThread } from '../lib/api';

interface Message {
  id: string;
  body?: string;
  content?: string;
  senderId: string;
  createdAt: string;
  isUser?: boolean;
}

interface ThreadDisplay {
  id: string;
  participantName: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime?: string;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadDisplay[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load all message threads on mount
  useEffect(() => {
    loadThreads();
  }, []);

  // Load messages for selected thread
  const loadMessages = useCallback(async (threadId: string) => {
    try {
      const response = await apiClient.getMessages(threadId);
      console.log('Messages response:', response);
      
      const messageList = (response.data || []).map((msg: Message, index: number) => ({
        ...msg,
        content: msg.body || msg.content || '',
        isUser: msg.senderId === user?.id || index % 2 === 0 // Fallback for demo
      }));
      
      setMessages(messageList);
    } catch (err) {
      console.error('Load messages error:', err);
      // Don't set error state for messages, just log it
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  }, [selectedThreadId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMessageThreads();
      console.log('Threads response:', response);
      
      const threadList = response.data || [];
      
      // Transform threads to include participant names
      const transformedThreads: ThreadDisplay[] = threadList.map((thread: MessageThread) => ({
        id: thread.id,
        participantName: thread.item?.title || `Thread ${thread.id.slice(0, 8)}`,
        lastMessage: thread.lastMessage?.body || 'No messages yet',
        unreadCount: thread.unreadCount || 0,
        lastMessageTime: thread.lastMessage?.createdAt
      }));
      
      setThreads(transformedThreads);
      
      if (transformedThreads.length > 0) {
        setSelectedThreadId(transformedThreads[0].id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMsg);
      console.error('Load threads error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThreadId) return;

    try {
      setSending(true);
      console.log('Sending message:', { threadId: selectedThreadId, body: newMessage });
      
      await apiClient.sendMessage(selectedThreadId, newMessage);
      setNewMessage('');
      await loadMessages(selectedThreadId);
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((thread) =>
    (thread.participantName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="flex h-[calc(100vh-48px)] bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Threads List Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-emerald-200 shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <MessageCircle className="h-5 sm:h-6 w-5 sm:w-6" />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-emerald-600" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading conversations...</p>
              </div>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <MessageCircle className="h-12 w-12 mb-3 opacity-30 text-gray-400" />
              <p className="text-sm text-gray-500 text-center">No conversations yet</p>
              <p className="text-xs text-gray-400 text-center mt-1">Start by contacting a seller</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-4 rounded-lg mb-2 transition-colors ${
                    selectedThreadId === thread.id
                      ? 'bg-emerald-100 border-l-4 border-emerald-500'
                      : 'hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                      {(thread.participantName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-emerald-900 truncate">
                          {thread.participantName || 'Unknown User'}
                        </h3>
                        {thread.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {thread.lastMessage || 'No messages yet'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {thread.lastMessageTime || 'Now'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-gradient-to-b from-cyan-50 to-emerald-50">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-emerald-200 bg-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                  {(selectedThread.participantName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    {selectedThread.participantName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Start a conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-emerald-500 text-white rounded-br-none'
                          : 'bg-white border border-emerald-200 text-emerald-900 rounded-bl-none'
                      }`}
                    >
                      <p className="break-words text-sm">
                        {message.body || message.content || ''}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isUser ? 'text-emerald-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Message Input */}
            <div className="p-6 border-t border-emerald-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {sending ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
