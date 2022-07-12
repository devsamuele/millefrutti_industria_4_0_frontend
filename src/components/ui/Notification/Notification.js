import { AnimatePresence, motion } from 'framer-motion';
import { useContext } from 'react';
import ReactDOM from 'react-dom';
import ThemeContex from '../../../context/theme';
import { v4 as uuid } from 'uuid'


const addNotification = (setNotificationList) => {
    return (notification) => {
        setNotificationList((prevState) => {
            const newNotification = {
                id: uuid(),
                duration: notification.duration,
                component: notification.component,
                position: notification.position ? notification.position : "top"
            }

            if (newNotification.duration !== null && newNotification.duration !== undefined) {
                setTimeout(() => {
                    removeNotification(setNotificationList, newNotification.id)
                }, newNotification.duration)
            }

            if (newNotification.position.startsWith("top")) {
                return [newNotification, ...prevState]
            } else {
                return [...prevState, newNotification]
            }
        })
    }
}

const removeNotification = (setNotificationList, id) => {
    setNotificationList((prevState) => {
        const updatedNotificationList = prevState.filter((notification) => {
            return notification.id !== id
        })
        return [...updatedNotificationList]
    })
}


const Notification = () => {
    const getStyle = (notification) => {
        const style = {}
        switch (notification.position) {
            case "top":
                style["initial"] = {
                    y: -100,
                    x: 0,
                    justifyContent: "center"
                };
                style["animate"] = {
                    y: 0,
                    x: 0,
                    justifyContent: "center"
                };
                break;
            case "top-right":

                break;
            case "bottom":
                style["initial"] = {
                    y: 100,
                    x: 0,
                    justifyContent: "center"
                };
                style["animate"] = {
                    y: 0,
                    x: 0,
                    justifyContent: "center"
                };
                break;
            default:
                style["initial"] = {
                    y: -100,
                    x: 0,
                    justifyContent: "center"
                };
                style["animate"] = {
                    y: 0,
                    x: 0,
                    justifyContent: "center"
                };

                break;
        }
    }

    const { notificationList } = useContext(ThemeContex)

    const buildNotification = (position, justifyContent, startX, startY, endX, endY) => {
        return <AnimatePresence>
            {notificationList?.filter((notification) => {
                return notification.position === position
            }).map((notification) => {
                return <motion.div
                    layout
                    key={notification.id}
                    initial={{ opacity: 0, x: startX, y: startY }}
                    animate={{ opacity: 1, x: endX, y: endY }}
                    exit={{ opacity: 0, }}
                    transition={{ duration: .2, ease: "easeInOut" }}
                    style={{ justifyContent: justifyContent }}
                    className="flex">
                    <div className='pointer-events-auto'>
                        {notification.component()}
                    </div>
                </motion.div>
            })}
        </AnimatePresence>

    }

    return ReactDOM.createPortal(
        <>
            <div className="fixed w-screen top-0 z-20 pointer-events-none">
                {buildNotification("top", "center", 0, -100, 0, 0)}
            </div >
            <div className="fixed w-screen top-0 right-0 z-20 pointer-events-none">
                {buildNotification("top-right", "end", 100, 0, 0, 0)}
            </div >
            <div className="fixed w-screen top-0 left-0 z-20 pointer-events-none">
                {buildNotification("top-left", "start", -100, 0, 0, 0)}
            </div >

            <div className="fixed w-screen bottom-0 z-20 pointer-events-none">
                {buildNotification("bottom", "center", 0, 100, 0, 0)}
            </div >
            <div className="fixed w-screen bottom-0 right-0 z-20 pointer-events-none">
                {buildNotification("bottom-right", "end", 100, 0, 0, 0)}
            </div >
            <div className="fixed w-screen bottom-0 left-0 z-20 pointer-events-none">
                {buildNotification("bottom-left", "start", -100, 0, 0, 0)}
            </div >
        </>,
        document.getElementById("notification")
    )
}

export { addNotification, removeNotification }
export default Notification