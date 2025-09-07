"use client"

interface TypingIndicatorProps {
  typingUsers: string[]
  currentUser: string
}

export function TypingIndicator({ typingUsers, currentUser }: TypingIndicatorProps) {
  const otherTypingUsers = typingUsers.filter((user) => user !== currentUser)

  if (otherTypingUsers.length === 0) {
    return null
  }

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      return `${otherTypingUsers[0]} is typing...`
    } else if (otherTypingUsers.length === 2) {
      return `${otherTypingUsers[0]} and ${otherTypingUsers[1]} are typing...`
    } else {
      return `${otherTypingUsers.length} people are typing...`
    }
  }

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground italic">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span>{getTypingText()}</span>
      </div>
    </div>
  )
}
