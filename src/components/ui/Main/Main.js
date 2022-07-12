import { useContext } from "react"
import ThemeContex from "../../../context/theme"

const Main = ({ className, children }) => {
    const { headerHeight } = useContext(ThemeContex)
    return <main
        style={
            {
                marginTop: `${headerHeight}px`,
                height: `calc(100% - ${headerHeight}px)`
            }}
        className={`relative w-full overflow-auto ${className === undefined ? "" : className}`}>
        {children}
    </main>
}

export default Main