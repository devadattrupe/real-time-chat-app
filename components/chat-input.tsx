"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onTyping?: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (onTyping && e.target.value.length > 0) {
      onTyping()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="flex-1"
        maxLength={500}
      />
      <Button type="submit" size="icon" disabled={!message.trim() || disabled} className="flex-shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
