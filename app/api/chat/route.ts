const messages: Array<any> = []
const onlineUsers: Map<string, { username: string; joinedAt: string; lastSeen: string; isTyping: boolean }> = new Map()
const typingUsers: Set<string> = new Set()

// Clean up inactive users every minute
setInterval(() => {
  const now = Date.now()
  const timeout = 60000 // 1 minute timeout

  for (const [username, user] of onlineUsers.entries()) {
    if (now - new Date(user.lastSeen).getTime() > timeout) {
      onlineUsers.delete(username)
      typingUsers.delete(username)

      // Add leave message
      const leaveMessage = {
        id: crypto.randomUUID(),
        content: `${username} left the chat`,
        sender: username,
        timestamp: new Date().toISOString(),
        type: "leave",
      }
      messages.push(leaveMessage)
    }
  }
}, 60000)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const since = searchParams.get("since") || "0"

  if (!username) {
    return new Response("Username required", { status: 400 })
  }

  // Update user's last seen time
  const existingUser = onlineUsers.get(username)
  if (!existingUser) {
    // New user joining
    const user = {
      username,
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isTyping: false,
    }
    onlineUsers.set(username, user)

    // Add join message
    const joinMessage = {
      id: crypto.randomUUID(),
      content: `${username} joined the chat`,
      sender: username,
      timestamp: new Date().toISOString(),
      type: "join",
    }
    messages.push(joinMessage)
  } else {
    // Update existing user's last seen
    existingUser.lastSeen = new Date().toISOString()
  }

  // Get messages since the specified timestamp
  const sinceTime = new Date(Number.parseInt(since))
  const newMessages = messages.filter((msg) => new Date(msg.timestamp) > sinceTime)

  return Response.json({
    messages: newMessages,
    users: Array.from(onlineUsers.values()),
    typingUsers: Array.from(typingUsers),
    timestamp: Date.now(),
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (data.type === "typing") {
      // Handle typing indicator
      if (data.isTyping) {
        typingUsers.add(data.sender)
      } else {
        typingUsers.delete(data.sender)
      }

      // Update user typing status
      const user = onlineUsers.get(data.sender)
      if (user) {
        user.isTyping = data.isTyping
        user.lastSeen = new Date().toISOString()
      }

      return Response.json({ success: true })
    } else {
      // Handle regular message
      const message = {
        id: data.id || crypto.randomUUID(),
        content: data.content,
        sender: data.sender,
        timestamp: new Date().toISOString(),
        type: data.type || "message",
      }

      messages.push(message)

      // Update sender's last seen time
      const user = onlineUsers.get(data.sender)
      if (user) {
        user.lastSeen = new Date().toISOString()
      }

      return Response.json(message)
    }
  } catch (error) {
    console.error("Error handling POST request:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
