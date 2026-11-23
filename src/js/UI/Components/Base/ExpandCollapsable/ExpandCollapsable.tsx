import React, { createContext, isValidElement, useCallback, useContext, useMemo, useState } from "react"

type Props = {
    children?: React.ReactNode

    startExpanded?: boolean

    //width?: number

    extraClassName?: string
}

function hasChild(children: React.ReactNode, type: unknown): boolean {
  return React.Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === type
  );
}

type ContextValue = {
    expanded: boolean,
    toggle: () => void;
}

const ExpandCollapseContext = createContext<ContextValue>(null !as ContextValue)


/**
 * Component for Expand/Collapse
 * This is the main one.
 */
function ExpandCollapsable(props: Props) {
    let [expanded, setExpanded] = useState(props.startExpanded ?? false)

    let funcToggle = useCallback(function() {
        return setExpanded(!expanded)
    }, [expanded])
    // If we don't give a dependency, it looks like "expanded" is baked


    let hasHeader = hasChild(props.children, ExpandCollapsable.Header)
    let hasContentProvided = hasChild(props.children, ExpandCollapsable.Content)

    /*const { hasHeader, hasContentProvided } = useMemo(() => ({
        hasHeader: hasChild(props.children, ExpandCollapsable.Header),
        hasContentProvided: hasChild(props.children, ExpandCollapsable.Content)
    }), [props.children]);*/


    let extraClass = expanded ? "expandCollapse-expanded expanded" : "expandCollapse-collapsed collapsed" 

    // More organized function
    let contentRender = useMemo(function() {
        if (hasHeader && hasContentProvided)
            return props.children
        else 
            return <ExpandCollapsable.Content>
                {props.children}
            </ExpandCollapsable.Content>
    }, [hasContentProvided, props.children])


    // Return render
    return <ExpandCollapseContext.Provider
        value={{
            expanded,
            toggle: funcToggle
        }}
    >
        <div 
            className={`expandCollapsable ${extraClass} ${props.extraClassName ?? ""}`}
        >
            {!hasHeader && <ExpandCollapsable.Header>
                { expanded ? "Collapse" : "Expand"}
            </ExpandCollapsable.Header>}
            {contentRender}
        </div>
    </ExpandCollapseContext.Provider>
}


type InnerProps = {
    children?: React.ReactNode
}

ExpandCollapsable.Header = function({children}: InnerProps) {
    let context = useContext(ExpandCollapseContext)
    let expanded = context.expanded

    let displayText = "▶"
    let transformVal = expanded ? "rotate(90deg)" : ""

    return <button
        className={`expandCollapse-btn`}
        onClick={context.toggle}
        aria-expanded={expanded}
    >
        <span>{children}</span>
        <span style={{
            marginLeft:"auto", transform: transformVal
        }}>
            {displayText}
        </span>
    </button>
}

ExpandCollapsable.Content = function({children}: InnerProps) {
    let context = useContext(ExpandCollapseContext)

    // Use "hidden" instead to keep child content
    return <div 
        className="display-contents"

        // the "hidden" HTML attribute was too weak
        //hidden={!(context.expanded)}
        style={{
            display: (!context.expanded ? "none" : undefined),
            
        }}
    >
        {children}
    </div>
}


//ExpandCollapsable.Header = Header
//ExpandCollapsable.Content = Content

export default ExpandCollapsable;