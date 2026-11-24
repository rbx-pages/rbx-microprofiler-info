/**
 * Freely input multiline string in `` and have it normalize
 * Although you might won't be able to use \n or other characters
 * Use HTML instead, or don't use this function method.
 */
/*function MultiLineStrNormalize(str: string) {
    return str.replace(/\s+/g, " ").trim();
}*/

export function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function makeCSS_WidthHeight(value: string) {
    return {
        height: value,
        width: value
    }
}

/**
 * Get whether the text should be black or white.
 * This is in MicroProfiler Style from Invert Color
 */
export function getContrastingTextColorFromBg_RGB(rgbArr: [number, number, number]) {
    var R = rgbArr[0] / 255.0
    var G = rgbArr[1] / 255.0
    var B = rgbArr[2] / 255.0

    var lum = (0.2126 * R + 0.7152 * G + 0.0722 * B);
    if (lum < 0.7) {
        return "white";
    }
    else {
        return "black";
    }
}



export default {
    randomIntFromInterval,
}