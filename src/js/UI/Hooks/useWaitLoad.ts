import { useEffect, useRef, useState } from "react"


/**
 * A hook
 * @param promiseToWaitFor
 * Input a Promise that we want to wait for.
 * @param showAfterMs
 * To prevent strange flickering when refreshing
 * in case of fast loads or things. This parameter can be provided that defines
 * how long should be waited from start, until it should show loading visuals, like loading spinners
 */
function useHookWaitLoad<T>(
    promiseToWaitFor: Promise<T>,
    showAfterMs: number = 500
) {
    if (promiseToWaitFor === undefined)
        new Error("Need a Promise!")


    let [bLoaded, setLoaded] = useState(false)
    let [bShowLoading, setShowLoading] = useState(false)

    // this has to be a ref, because something with variables in React is dank
    let haveWeHitLoaded = useRef(false)

    useEffect(function() {
        // In case of restarts
        if (bLoaded != false)
            setLoaded(false)

        ;(async function() {
            await promiseToWaitFor

            // And then...
            haveWeHitLoaded.current = true
            setLoaded(true)
            setShowLoading(false)
        })();
    }, [promiseToWaitFor])
    // useEffect only happens if anything in the dependency array changes

    useEffect(function() {
        const timerRace = setTimeout(() => {
            if (haveWeHitLoaded.current === false)
                setShowLoading(true)
        }, showAfterMs)
    }, [showAfterMs])


    return [
        bLoaded,
        bShowLoading
    ];
}


export default useHookWaitLoad