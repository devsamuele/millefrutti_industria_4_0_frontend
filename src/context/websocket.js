import React from "react"
const WebsocketContex = React.createContext({
    websocket: null,
    ready: true
})

export default WebsocketContex