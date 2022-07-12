import { useContext, useEffect, useRef } from "react"
import ThemeContex from "../../../context/theme";


const AppBar = ({ children, className }) => {
    const headerRef = useRef(null)
    const { setHeaderHeight } = useContext(ThemeContex)

    useEffect(() => {
        setHeaderHeight(headerRef.current.offsetHeight)
    }, [setHeaderHeight])

    return (
        <div
            ref={headerRef}
            className={`w-screen fixed z-20 top-0 left-0 ${className === undefined ? "" : className}`}>
            {children}
        </div>
    )
}

export default AppBar