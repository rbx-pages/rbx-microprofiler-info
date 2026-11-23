import { useMemo } from "react";
import { makeCSS_WidthHeight } from "../../../modules/Utils/Utilities";
import SVG_AssetUriMap from "../Other/SVG_AssetUriMap";
import SVG_Circle from "../Other/SVG_Circle";
import SVG_Inline from "../Utils/SVG_Inline";

type Props = {
    /**
     * Most likely just to open it.
     */
    onClick?: () => void;

    
    /**
     * Whether to show that filters are active or not.
     */
    showFilterIndicator?: boolean
}


export function TagSearchFilterButton(props: Props) {
    const filterIndicator = useMemo(function() {
        let radius = 8

        return (props.showFilterIndicator) &&
        <div
            style={{
                position: "absolute",
                top: `-0px`,
                right: `-0px`,
                //height: "0px",
                //width: "0px",
            }}
        >
            <SVG_Circle
                //b_svg_makeCenter={true}
                pointerEvents={"none"}
                style={{display: "block"}}
                {...makeCSS_WidthHeight(`${radius}px`)}
            />
        </div>
    }, [props.showFilterIndicator])


    return <button className="btn" aria-label="filter-button"
        title="Filter"
        onClick={props.onClick}
        style={{
            position: "relative"
        }}
    >
        <span className="icon">
            <SVG_Inline
                src={SVG_AssetUriMap.instant_mix}
                width="80%"
            />
        </span>

        {
            filterIndicator
        }
    </button>
    {/*<ButtonComponent aria-label="filter-button" onClick={onFilterClick}>
        <span className="icon">
            <SVG_Inline
                src={SVG_AssetUriMap.instant_mix}
                width="80%"
            />
        </span>
    </ButtonComponent>*/}
}


export default TagSearchFilterButton;