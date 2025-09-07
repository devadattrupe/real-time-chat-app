export interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: string
  type: "message" | "join" | "leave"
  status?: "sending" | "sent" | "failed"
}

export interface TypingIndicator {
  sender: string
  isTyping: boolean
}

export interface OnlineUser {
  username: string
  joinedAt: string
  isTyping: boolean
}

export class WebSocketManager {
  private pollInterval: NodeJS.Timeout | null = null
  private lastTimestamp = 0
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private typingTimeout: NodeJS.Timeout | null = null
  private isCurrentlyTyping = false
  private username = ""
  private isConnected = false

  constructor(
    private onMessage: (message: ChatMessage) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onTypingChange: (typingUsers: string[]) => void,
    private onUsersChange: (users: OnlineUser[]) => void,
  ) {}

  connect(username: string) {
    this.username = username
    this.lastTimestamp = Date.now()

    console.log("[v0] Connecting to chat server with polling")

    // Start polling for messages
    this.startPolling()
  }

  private startPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }

    // Poll every 1 second for new messages
    this.pollInterval = setInterval(() => {
      this.pollForUpdates()
    }, 1000)

    // Initial poll
    this.pollForUpdates()
  }

  private async pollForUpdates() {
    try {
      const response = await fetch(
        `/api/chat?username=${encodeURIComponent(this.username)}&since=${this.lastTimestamp}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!this.isConnected) {
        this.isConnected = true
        this.reconnectAttempts = 0
        this.onConnectionChange(true)
        console.log("[v0] Connected to chat server")
      }

      // Process new messages
      if (data.messages && data.messages.length > 0) {
        data.messages.forEach((message: ChatMessage) => {
          this.onMessage(message)
        })
      }

      // Update users and typing status
      if (data.users) {
        this.onUsersChange(data.users)
      }

      if (data.typingUsers) {
        this.onTypingChange(data.typingUsers)
      }

      // Update timestamp for next poll
      if (data.timestamp) {
        this.lastTimestamp = data.timestamp
      }
    } catch (error) {
      console.error("[v0] Polling error:", error)

      if (this.isConnected) {
        this.isConnected = false
        this.onConnectionChange(false)
      }

      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[v0] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.startPolling()
      }, 1000 * this.reconnectAttempts)
    }
  }

  sendMessage(message: Omit<ChatMessage, "id" | "timestamp">, trackDelivery = false): string | boolean {
    const messageId = crypto.randomUUID()
    const messageWithId = {
      ...message,
      id: messageId,
    }

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageWithId),
    }).catch((error) => {
      console.error("[v0] Error sending message:", error)
    })

    return trackDelivery ? messageId : true
  }

  startTyping(username: string) {
    if (!this.isCurrentlyTyping) {
      this.isCurrentlyTyping = true
      this.sendTypingIndicator(username, true)
    }

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      this.stopTyping(username)
    }, 3000)
  }

  stopTyping(username: string) {
    if (this.isCurrentlyTyping) {
      this.isCurrentlyTyping = false
      this.sendTypingIndicator(username, false)
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
      this.typingTimeout = null
    }
  }

  private sendTypingIndicator(username: string, isTyping: boolean) {
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "typing",
        sender: username,
        isTyping,
      }),
    }).catch((error) => {
      console.error("[v0] Error sending typing indicator:", error)
    })
  }

  disconnect(username: string) {
    if (this.pollInterval) {
      this.stopTyping(username)
      clearInterval(this.pollInterval)
      this.pollInterval = null
      this.isConnected = false
    }
  }

  isConnected(): boolean {
    return this.isConnected
  }
}
