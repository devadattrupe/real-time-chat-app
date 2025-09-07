"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserJoinFormProps {
  onJoin: (username: string) => void
}

export function UserJoinForm({ onJoin }: UserJoinFormProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onJoin(username.trim())
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Join Chat</CardTitle>
        <CardDescription>Enter your name to start chatting with others</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              maxLength={20}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!username.trim()}>
            Join Chat
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
