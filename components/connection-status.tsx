"use client"

import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
      <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
    </div>
  )
}
