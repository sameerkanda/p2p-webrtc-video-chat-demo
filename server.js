const WebSocket = require('ws') // npm install ws

const wss = new WebSocket.Server({
  port: 8080
})

const sendToPeer = (ws, message) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

wss.on('connection', (ws) => {
  // When the second peer connects, let's notify the first peer (and only the first peer) that a peer has connected.
  if (wss.clients.size === 2) {
    sendToPeer(ws, JSON.stringify({
      type: 'peerConnected',
    }))
  }

  // Send any messages received from a peer to the other peer.
  ws.on('message', (message) => {
    sendToPeer(ws, message)
  })

  // NOTE: this is just a demo; it will break if more than 2 users connect.
})
