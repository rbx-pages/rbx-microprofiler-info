import React from "react"

type Props = React.SVGAttributes<SVGElement> & {
    b_svg_makeCenter?: boolean
}

/**
 * Because CSS can't get it right.
 */
export default function SVG_Circle(props: Props) {
    let w = parseInt(props.width as string)
    let h = parseInt(props.height as string)

    // Use memo?

    return <svg
        {...props}

        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${w} ${h}`}
        className="svgCircle"
    >
        <circle
            /*{... !props.b_svg_makeCenter && {
                cx: (w / 2),
                cy: (h / 2),
            }}*/

            cx={props.b_svg_makeCenter ? 0 : (w / 2)}
            cy={props.b_svg_makeCenter ? 0 : (h / 2)}

            r={h / 2}

            fill="currentColor"
        />
    </svg>
}