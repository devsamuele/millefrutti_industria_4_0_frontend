import { useState } from "react"
import useBreakpoints from "../../../hooks/useBreakpoints"
import { isMobile } from "../../../utils/utils"
import ThemeContex from "../../../context/theme"
import Notification, { addNotification } from '../Notification/Notification'

const ThemeProvider = ({ children, breakpoints }) => {
    const currentBreakpoint = useBreakpoints(breakpoints)
    const [headerHeight, setHeaderHeight] = useState(0)
    const [showDrawer, setShowDrawer] = useState(!isMobile(currentBreakpoint))
    const [notificationList, setNotificationList] = useState([])

    return (
        <ThemeContex.Provider value={{
            currentBreakpoint,
            setHeaderHeight,
            headerHeight,
            setShowDrawer,
            showDrawer,
            notificationList,
            addNotification: addNotification(setNotificationList),
        }}>
            <div className="flex w-full h-screen relative">
                {children}
            </div>
            <Notification></Notification>

        </ThemeContex.Provider>
    )
}

export default ThemeProvider