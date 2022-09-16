import { useEffect, useState } from "react"
import { v4 } from 'uuid'
import WebsocketContex from "../../../context/websocket"

import {
    updateOpcuaConn as updateOpcuaConnSpindryer,
} from "../../../store/spindryer";
import {
    updateOpcuaConn as updateOpcuaConnPasteurizer,
} from "../../../store/pasteurizer";
import { useDispatch } from "react-redux";

const connectWs = () => {
    return new WebSocket(`ws://192.168.1.10:9000/v1/ws?id=${v4()}`)
}

const Websocket = ({ children }) => {
    const [websocket, setWebsocket] = useState(connectWs())
    const [ready, setReady] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        websocket.onopen = () => {
            setReady(true)
            console.log("open ws conn")
        }
        websocket.onclose = () => {
            console.log("close ws conn")
            setReady(false)
            dispatch(updateOpcuaConnSpindryer({ connected: false }));
            dispatch(updateOpcuaConnPasteurizer({ connected: false }));
            setTimeout(() => {
                setWebsocket(connectWs())
            }, 1000 * 5)
        }
    }, [websocket])

    return < WebsocketContex.Provider value={{
        websocket: websocket,
        ready: ready
    }} >
        {children}
    </WebsocketContex.Provider >
}

export default Websocket