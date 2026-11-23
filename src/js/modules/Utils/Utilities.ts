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



export default {
    randomIntFromInterval,
}