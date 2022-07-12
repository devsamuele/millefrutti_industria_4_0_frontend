import { useCallback, useEffect, useState } from "react"


const useBreakpoints = (breakpoints) => {
    const [breakpoint, setBreakpoint] = useState(calc(breakpoints, window.innerWidth))
    const resizeHandler = useCallback(() => {
        const bk = calc(breakpoints, window.innerWidth)
        if (breakpoint !== bk) {
            setBreakpoint(bk)
        }
    }, [breakpoint, breakpoints])

    useEffect(() => {
        window.addEventListener("resize", resizeHandler)
        return () => {
            window.removeEventListener("resize", resizeHandler)
        }
    }, [resizeHandler])

    return breakpoint
}

const calc = (breakpoints, currentWidth) => {
    if (currentWidth < breakpoints.sm) {
        return "sm"
    } else if (currentWidth < breakpoints.md) {
        return "md"
    } else if (currentWidth < breakpoints.lg) {
        return "lg"
    } else if (currentWidth < breakpoints.xl) {
        return "xl"
    }
    return "2xl"
}

export default useBreakpoints