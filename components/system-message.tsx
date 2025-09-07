"use client"

import type { ChatMessage } from "@/lib/websocket"

interface SystemMessageProps {
  message: ChatMessage
}

export function SystemMessage({ message }: SystemMessageProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex justify-center">
      <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs">
        {message.content} • {formatTime(message.timestamp)}
      </div>
    </div>
  )
}
