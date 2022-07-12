import React from "react"
const ThemeContex = React.createContext({
    currentBreakpoint: "",
    setHeaderHeight: "",
    headerHeight: "",
    setShowDrawer: "",
    showDrawer: "",
    addNotification: "",
    notificationList: [],
    websocket: null,
})

export default ThemeContex