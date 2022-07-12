import { motion, AnimatePresence } from "framer-motion"

const Backdrop = ({ onClick, className, style, children, show, timeout }) => {
    return <AnimatePresence>
        {show && <motion.div
            key={"backdrop"}
            animate={{ backgroundColor: "#00000080" }}
            exit={{ backgroundColor: "#00000000" }}
            transition={{ duration: timeout, ease: "easeInOut" }}
            onClick={onClick}
            className={`${className !== undefined ? className : "fixed z-30 top-0 left-0 w-screen h-screen overflow-auto"}`} style={style}>
            {children}
        </motion.div>}
    </AnimatePresence>

}

export default Backdrop