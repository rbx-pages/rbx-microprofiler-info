import { useEffect, useState } from "react"
import LoadingSpinner from "./Other/LoadingSpinner"

type Props = {
    show: boolean
}

function LoadingOverlay(props: Props) {
    if (props.show == true) {
        return <>
            <div className="loadingOverlay">
                <LoadingSpinner/>
            </div>
        </>
    }
}



export default LoadingOverlay