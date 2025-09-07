"use client"

import { useEffect, useRef } from "react"
import type { ChatMessage } from "@/lib/websocket"
import { MessageBubble } from "@/components/message-bubble"
import { SystemMessage } from "@/components/system-message"

interface MessageListProps {
  messages: ChatMessage[]
  currentUser: string
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) =>
          message.type === "message" ? (
            <MessageBubble key={message.id} message={message} isOwn={message.sender === currentUser} />
          ) : (
            <SystemMessage key={message.id} message={message} />
          ),
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
