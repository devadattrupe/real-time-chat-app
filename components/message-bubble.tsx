"use client"

import type { ChatMessage } from "@/lib/websocket"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={cn("flex gap-3 max-w-[80%]", isOwn ? "ml-auto flex-row-reverse" : "mr-auto")}>
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
            {message.sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        {!isOwn && <span className="text-xs text-muted-foreground font-medium">{message.sender}</span>}

        <div
          className={cn(
            "rounded-lg px-3 py-2 max-w-full break-words",
            isOwn ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border border-border",
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
