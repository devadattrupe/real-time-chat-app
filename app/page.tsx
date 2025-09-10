"use client"

import { useState, useEffect, useRef } from "react"
import { type ChatMessage, type OnlineUser, WebSocketManager } from "@/lib/websocket"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { UserJoinForm } from "@/components/user-join-form"
import { ConnectionStatus } from "@/components/connection-status"
import { TypingIndicator } from "@/components/typing-indicator"
import { UserSidebar } from "@/components/user-sidebar"
import { Button } from "@/components/ui/button"
import { Users, X } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [username, setUsername] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [showUserSidebar, setShowUserSidebar] = useState(false)
  const wsManager = useRef<WebSocketManager | null>(null)

  useEffect(() => {
    if (hasJoined && username) {
      wsManager.current = new WebSocketManager(
        (message) => {
          setMessages((prev) => [...prev, message])
        },
        (connected) => {
          setIsConnected(connected)
        },
        (typing) => {
          setTypingUsers(typing)
        },
        (users) => {
          setOnlineUsers(users)
        },
      )

      wsManager.current.connect(username)

      return () => {
        if (wsManager.current) {
          wsManager.current.disconnect(username)
        }
      }
    }
  }, [hasJoined, username])

  const handleJoinChat = (name: string) => {
    setUsername(name)
    setHasJoined(true)
  }

  const handleSendMessage = (content: string) => {
    if (wsManager.current && content.trim()) {
      wsManager.current.stopTyping(username)

      wsManager.current.sendMessage({
        content: content.trim(),
        sender: username,
        type: "message",
      })
    }
  }

  const handleTyping = () => {
    if (wsManager.current) {
      wsManager.current.startTyping(username)
    }
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <UserJoinForm onJoin={handleJoinChat} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Real-time Chat</h1>
            <p className="text-sm text-muted-foreground">Welcome, {username}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserSidebar(!showUserSidebar)}
              className="lg:hidden"
            >
              <Users className="h-4 w-4 mr-2" />
              {onlineUsers.length}
            </Button>
            <ConnectionStatus isConnected={isConnected} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <MessageList messages={messages} currentUser={username} />
          <TypingIndicator typingUsers={typingUsers} currentUser={username} />
          <div className="p-4 border-t border-border bg-card">
            <ChatInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              disabled={!isConnected}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
            />
          </div>
        </div>

        {/* User Sidebar - Desktop */}
        <div className="hidden lg:block w-80 border-l border-border">
          <UserSidebar users={onlineUsers} currentUser={username} className="h-full border-0" />
        </div>

        {/* User Sidebar - Mobile Overlay */}
        {showUserSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowUserSidebar(false)}>
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Online Users</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowUserSidebar(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <UserSidebar users={onlineUsers} currentUser={username} className="border-0 shadow-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
