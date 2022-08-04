import { useEffect, useState } from "react"
import { v4 } from 'uuid'
import WebsocketContex from "../../../context/websocket"

const connectWs = () => {
    return new WebSocket(`ws://192.168.1.10:9000/v1/ws?id=${v4()}`)
}

const Websocket = ({ children }) => {
    const [websocket, setWebsocket] = useState(connectWs)

    useEffect(() => {
        websocket.onopen = () => {
            console.log("open ws conn")
        }
        websocket.onclose = () => {
            console.log("close ws conn")
            setTimeout(() => {
                setWebsocket(connectWs())
            }, 1000 * 10)
        }
    }, [websocket])

    return < WebsocketContex.Provider value={{
        websocket: websocket,
    }} >
        {children}
    </WebsocketContex.Provider >
}

export default Websocket