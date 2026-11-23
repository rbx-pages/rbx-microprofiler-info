type Props = React.HTMLAttributes<HTMLElement> & {
    
}

function ButtonComponent(props?: Props) {
    return <>
        <button
            className="btn"
            aria-label="button"
            {...props}
        >
            {props?.children}
        </button>
    </>
}


export default ButtonComponent;