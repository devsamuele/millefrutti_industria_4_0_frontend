import { useCallback, useEffect } from "react";

const useOnClickOutside = (ref, triggerRef, handler) => {
    const handlerCallback = useCallback(handler, [handler])
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target) || triggerRef.current.contains(event.target)) {
                return;
            }

            handlerCallback(event);
        };
        document.addEventListener("pointerdown", listener);
        return () => {
            document.removeEventListener("pointerdown", listener);
        };
    }, [ref, triggerRef, handlerCallback]);
}

export default useOnClickOutside