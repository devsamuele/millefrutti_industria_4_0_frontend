import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Backdrop from '../backdrop/Backdrop';
import { motion } from "framer-motion"

const Dialog = ({ className, children, show, onBackdropClick, timeout }) => {

    const onBackdropClickHandler = () => {
        if (onBackdropClick !== undefined) {
            onBackdropClick()
        }
    }

    return ReactDOM.createPortal(<Fragment>
        <Backdrop
            show={show}
            timeout={timeout}
            onClick={onBackdropClickHandler} >
            <motion.div
                initial={{ opacity: 0, scale: .75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: timeout, ease: "easeInOut" }}
                onClick={(e) => { e.stopPropagation() }}
                className={`${className !== undefined ? className : ""} relative`}>
                {children}
            </motion.div>
            {/* </CSSTransition> */}
        </Backdrop>
    </Fragment >, document.getElementById("portal-root"))

}

export default Dialog