// import { useContext } from "react"
// import LayoutContex from "../../context/layout"
import { motion } from "framer-motion"

const Toolbar = ({ children, className }) => {

    return <div className={`w-full top-0 z-10 sticky ${className !== undefined ? className : ""}`}>
        {children}
    </div>
}

const Content = ({ children, className }) => {
    return <div className={`w-full h-full ${className !== undefined ? className : ""}`} >
        {children}
    </div >
}

const Page = ({ children }) => {
    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}>{children}</motion.div>
}

Page.Toolbar = Toolbar
Page.Content = Content

export default Page