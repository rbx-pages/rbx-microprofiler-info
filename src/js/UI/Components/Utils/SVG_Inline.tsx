/*
    Can't use outerHTML as that will break unmounting.

    This is meant to return an <svg> directly. No wrapper or container, just the <svg>
    Without breaking React's mount and unmounting.

    
    This here has its own cache for loading SVG.
*/


import React, { useEffect, useRef, useState } from "react"


type Props = React.SVGAttributes<SVGElement> & {
    /**
     * Path to the SVG, should base from "src/" and not include it.
     * Public path
     */
    src: string
}




/**
 * A cache...
 * The cache goes away on refresh, which is good.
 * This is to prevent fetch from being spammed for the same thing twice for no reason.
 */
const SVG_Cache = new Map<string, SvgCacheItem>()

enum CacheStatus {
    NONE,
    PENDING,
    FAILED,
    FULFILLED,
}


class SvgCacheItem {
    public content?: SVGElement = undefined

    public pendingPromise?: Promise<SVGElement> = undefined

    public AddStartPromiseResolver(callbackAsync: () => Promise<SVGElement>) {
        //this.pendingPromise = callback()

        let _this = this
        this.pendingPromise = new Promise(async function(resolve, reject) {
            let cbResult = await callbackAsync()
            
            if (cbResult instanceof SVGElement) {
                _this.content = cbResult
                // We don't need the Promise anymore
                delete _this.pendingPromise
                resolve(cbResult)
            } else {
                console.error("Failed", cbResult)
                reject()
            }
        })

        return this.pendingPromise
    }

    public async IsPendingAsync() {
        // If this is there, then we might be pending.
        if (this.pendingPromise) {
            let state = await promiseState(this.pendingPromise)
            if (state == CacheStatus.PENDING) {
                return true;
            }
        }

        return false;
    }
}


function getFromCache(svg_src: string) {
    let result = SVG_Cache.get(svg_src)
    if (result !== undefined) {
        return result
    }

    return undefined
}


/**
 * Retrieves the state of a Promise.
 */
function promiseState(p: Promise<any>) {
  const t = {};
  return Promise.race([p, t])
    .then(v => (v === t)? CacheStatus.PENDING : CacheStatus.FULFILLED, () => CacheStatus.FAILED);
}


/**
 * background-color to backgroundColor for example
 */
function reactifyHtmlAttribute(input: string) {
    if (input == "class")
        return "className"

    let newString = input.replace(/\-([A-z])/g, function(match, letter) {
        // Capture Group 1
        if (letter)
            return letter.toUpperCase()
    })

    return newString
}




/**
 * Pass in a path to lazy inline an SVG path through fetch.
 * - Set ``src``
 */
function SVG_Inline(props: Props) {
    let svgPath = props.src

    let [svgElement, setSvgElement] = useState<SVGElement|undefined>(undefined)

    useEffect(function() {
        //console.log("useEffect called!")
        
        ;(async function() {
            let docElement = undefined

            // Check cache first
            let svgCacheItem = getFromCache(svgPath);

            if (svgCacheItem === undefined) {
                // Create new cache entry
                let newCacheEntry = new SvgCacheItem();
                SVG_Cache.set(svgPath, newCacheEntry)

                // Define the task
                let taskFunc = async function() {
                    let iconContent = await (await fetch(svgPath)).text()

                    const parser = new DOMParser()
                    const elem = parser.parseFromString(iconContent, "image/svg+xml")
                    docElement = elem.documentElement
                    
                    if (docElement instanceof SVGElement)
                        return docElement
                    else
                        throw new Error("Not an SVGElement")
                }

                // Then start it
                await newCacheEntry.AddStartPromiseResolver(taskFunc)
                svgCacheItem = newCacheEntry

                // Cache should auto-update through Promise
            }
            else
            {
                if (await svgCacheItem.IsPendingAsync()) {
                    await svgCacheItem.pendingPromise
                }
            }

            // Update state, re-trigger render?
            setSvgElement(
                svgCacheItem?.content
            )
        })()
    }, [svgPath])

    
    // Once ready through React state
    if (svgElement) {
        let existingAttributes = Object.fromEntries(
            [...svgElement.attributes].map(attr => [reactifyHtmlAttribute(attr.name), attr.value])
        )

        // Return as a React Element.
        return React.createElement(svgElement.nodeName, {
            ...existingAttributes,
            ...props,
            dangerouslySetInnerHTML: {__html: svgElement.innerHTML}
        })
    }


    // Fallback
    //return <span {...props}></span>
    //return undefined
    return null
}

export default SVG_Inline;