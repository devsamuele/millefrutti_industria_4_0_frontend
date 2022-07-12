import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { usePopper, } from 'react-popper'
import tooltipStyles from "./Tooltip.module.css"

const modifiers = [
    {
        name: 'offset',
        options: {
            offset: ({ placement, reference, popper }) => {
                return [0, 8]
            }
        },
    },
]

const Tooltip = ({ children, placement }) => {
    if (placement === undefined) {
        placement = "top"
    }

    const [showTooltip, setShowTooltip] = useState(false)
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: placement,
        modifiers: modifiers
    })

    let trigger
    let content
    React.Children.map(children, (child) => {
        const name = child.type?.name
        if (name !== undefined) {
            if (name.toLowerCase() === "trigger") {
                trigger = React.cloneElement(child, { ...child.props, ref: setReferenceElement, setShowTooltip: setShowTooltip })
            } else if (name.toLowerCase() === "content") {
                content = child
            }
        }
    });


    const portal = ReactDOM.createPortal(
        <CSSTransition in={showTooltip} classNames={
            {
                enter: tooltipStyles["fade-enter"],
                enterActive: tooltipStyles["fade-enter-active"],
                exit: tooltipStyles["fade-exit"],
                exitActive: tooltipStyles["fade-exit-active"]
            }
        } timeout={200} unmountOnExit
        >
            <div className="transition-opacity duration-200" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
                {content}
            </div>
        </CSSTransition>, document.getElementById('portal-root'))

    return <>
        {trigger}
        {portal}
    </>

}

const Trigger = React.forwardRef(({ children, setShowTooltip }, ref) => {

    const mouseOverHandler = () => {
        setShowTooltip(true)
    }

    const mouseLeaveHandler = () => {
        setShowTooltip(false)
    }


    let trigger
    React.Children.map(children, (child) => {
        trigger = React.cloneElement(child, { ...child.props, ref: ref, onMouseOver: mouseOverHandler, onMouseLeave: mouseLeaveHandler })
    })
    return trigger
})
Trigger.name = "Trigger"

const Content = ({ children }) => {
    return <>{children}</>
}


Tooltip.Trigger = Trigger
Tooltip.Content = Content

export default Tooltip

