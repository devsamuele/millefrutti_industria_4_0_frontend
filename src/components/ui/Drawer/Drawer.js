import React, { useState, useContext, useEffect, Fragment } from "react"
import ThemeContex from "../../../context/theme";
import ReactDOM from 'react-dom';
import Backdrop from "../backdrop/Backdrop"
import { isMobile } from "../../../utils/utils"
import { motion, AnimatePresence } from "framer-motion"

const Drawer = ({ show, setShow, children, className }) => {
    const { currentBreakpoint, headerHeight } = useContext(ThemeContex)
    const [screen, setScreen] = useState(isMobile(currentBreakpoint) ? "mobile" : "desktop")
    const [showMobileDrawer, setShowMobileDrawer] = useState(isMobile(currentBreakpoint) ? false : true)
    const [showDesktopDrawer, setShowDesktopDrawer] = useState(isMobile(currentBreakpoint) ? true : false)

    let desktopDrawerContent
    let mobileDrawerContent
    React.Children.map(children, (child) => {
        const name = child.type?.displayName
        if (name !== undefined) {
            if (name.toLowerCase() === "desktop") {
                desktopDrawerContent = child
            } else if (name.toLowerCase() === "mobile") {
                mobileDrawerContent = child
            }
        }
    })

    useEffect(() => {
        if (screen === "desktop") {
            setShow(true)
            setShowDesktopDrawer(true)
            setShowMobileDrawer(false)

        } else if (screen === "mobile") {
            setShow(false)
            setShowMobileDrawer(true)
            setShowDesktopDrawer(false)
        }
    }, [screen, setShow])

    useEffect(() => {
        if (!isMobile(currentBreakpoint)) {
            setScreen("desktop")
        } else if (isMobile(currentBreakpoint)) {
            setScreen("mobile")
        }
    }, [currentBreakpoint, setScreen])

    const desktopDrawer =
        <Fragment>
            <motion.div
                animate={show ? { marginLeft: 0 } : { marginLeft: -250 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={
                    {
                        top: `${headerHeight}px`,
                        height: `calc(100vh - ${headerHeight}px)`,
                    }}
                className={`relative w-drawer shrink-0 ${className !== undefined ? className : ""}`}>
                {desktopDrawerContent}
            </motion.div>

        </Fragment>

    const mobileDrawer = ReactDOM.createPortal(
        <Fragment>
            <Backdrop show={show} onClick={() => { setShow(false) }}></Backdrop>
            <AnimatePresence>
                {show && <motion.div
                    initial={{ left: -250 }}
                    animate={{ left: 0 }}
                    exit={{ left: -250 }}
                    transition={{ duration: .2, ease: "easeInOut" }}
                    className={`fixed top-0 w-drawer h-screen z-30 ${className !== undefined ? className : ""}`}>
                    {mobileDrawerContent}
                </motion.div>}
            </AnimatePresence>
        </Fragment >, document.getElementById("portal-root"))


    const drawer = () => {
        if (showDesktopDrawer) {
            return desktopDrawer
        } else if (showMobileDrawer) {
            return mobileDrawer
        }
        return ""
    }

    return drawer()
}

const Desktop = ({ children }) => {
    return children
}
Desktop.displayName = "Desktop"

const Mobile = ({ children }) => {
    return children
}

Mobile.displayName = "Mobile"

Drawer.Desktop = Desktop
Drawer.Mobile = Mobile

export default Drawer