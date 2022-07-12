import React, { useContext, useEffect, useRef, useState } from "react"
import useOnClickOutside from "../../../hooks/useClickOutside"
import { motion, AnimatePresence } from "framer-motion"

const MenuContext = React.createContext({ show: "", setShow: "" })

const Dropdown = React.forwardRef(({ children, onOpen, onClose, onMouseOver, onMouseLeave }, ref) => {
    const [show, setShow] = useState(false)
    const triggerRef = useRef()

    const showHandler = () => {
        setShow((prevState) => {
            return !prevState
        })
    }

    useEffect(() => {
        if (show) {
            if (onOpen) {
                onOpen()
            }
        } else {
            if (onClose) {
                onClose()
            }
        }
    }, [show, onClose, onOpen])

    let trigger
    let content
    React.Children.map(children, (child) => {
        const name = child.type?.displayName
        if (name !== undefined) {
            if (name.toLowerCase() === "trigger") {
                trigger = <div ref={ref}>
                    <button onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} ref={triggerRef} onClick={showHandler} className={child.props.className !== undefined ? child.props.className : ""}>{child}</button>
                </div>
            } else if (name.toLowerCase() === "content") {
                content = <AnimatePresence>
                    {show && <motion.div
                        initial={{ opacity: 0, scale: .75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        exit={{ opacity: 0, scale: .75 }}
                    >
                        {React.cloneElement(child, { ...child.props, ref: triggerRef })}
                    </motion.div>}
                </AnimatePresence>
            }
        }
    })

    return <div className="relative">
        <MenuContext.Provider value={{ show, showHandler, triggerRef }}>
            {trigger}
            {content}
        </MenuContext.Provider>
    </div>
})

const Trigger = ({ children }) => {
    return children
}

Trigger.displayName = "Trigger"

const Content = React.forwardRef(({ children, className }, triggerRef) => {
    const { showHandler } = useContext(MenuContext)
    const contentRef = useRef()

    useOnClickOutside(contentRef, triggerRef, () => {
        showHandler()
    })
    return <div ref={contentRef} className={`absolute z-20 overflow-hidden ${className !== undefined ? className : ""}`}>{children}</div>
})

Content.displayName = "Content"

const Item = ({ children, className, closeOnClick, onClick }) => {
    const { showHandler } = useContext(MenuContext)
    const clickHandler = () => {
        if (closeOnClick !== undefined) {
            showHandler()
        }
        if (onClick !== undefined) {
            onClick()
        }
    }

    return <button onClick={clickHandler} className={`${className !== undefined ? className : ""}`}>{children}</button>
}

Dropdown.Trigger = Trigger
Dropdown.Content = Content
Dropdown.Item = Item

export default Dropdown