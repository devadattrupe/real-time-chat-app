"use client"

import type { OnlineUser } from "@/lib/websocket"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserSidebarProps {
  users: OnlineUser[]
  currentUser: string
  className?: string
}

export function UserSidebar({ users, currentUser, className }: UserSidebarProps) {
  const formatJoinTime = (joinedAt: string) => {
    const date = new Date(joinedAt)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Online Users
          <Badge variant="secondary" className="ml-auto">
            {users.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No users online</p>
        ) : (
          users.map((user) => (
            <div
              key={user.username}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                user.username === currentUser ? "bg-primary/10" : "hover:bg-muted/50",
              )}
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {user.username}
                    {user.username === currentUser && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                  </p>
                  {user.isTyping && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Joined {formatJoinTime(user.joinedAt)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
