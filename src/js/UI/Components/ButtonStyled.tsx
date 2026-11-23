import React from "react";
import ButtonComponent from "./Base/ButtonComponent"

type Props = {
    recolorAs?: string;
    className?: string;

    children?: React.ReactNode

    title?: string

    onClick?: React.MouseEventHandler
}




/**
 * A styled button with pre-set styles.
 */
function ButtonStyled(props: Props) {

    return <>
        <ButtonComponent
            className={
                ["btn", "modalBtn", props.className]
                .filter(Boolean) // prevent unnecessary space at the end
                .join(" ")
            }

            title={props.title}

            style={{
                //backgroundColor: props?.bgColor
                ["--modalBtn-bg-color" as any]: props?.recolorAs,
                
                ...(props?.recolorAs && {
                    ["--modalBtn-border-color" as any]: `color-mix(in srgb, var(--modalBtn-bg-color), black 25%)`,
                })
            }}

            onClick={props?.onClick}
        >
            {props?.children}
        </ButtonComponent>
    </>
}


export default ButtonStyled