import { splitWrap } from "./SplitAndWrap.js";

const title = document.querySelector('.title')


function distance(x1, x2, y1, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    return d
}

// throttle function that will always return the last known position.
function throttle(callback, timeout = 50) {
    let wait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            wait = false
        } else {
            callback(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, timeout)
        }
    }
    return (...args) => {
        if (wait) {
            waitingArgs = args
            return
        }
        callback(...args)
        wait = true;
        setTimeout(timeoutFunc, timeout)
    }
}


splitWrap(title) // stays outside of the function considering it only needs to be called once.
const animateTextOnMove = throttle((event, spanParent) => {
    const spanArray = Array.prototype.slice.call(spanParent.children) //element.children returns obj, converting to array here.
    const x = event.clientX
    const y = event.clientY  
    spanArray.forEach((el) => {
        const ElementDimensions = el.getBoundingClientRect()
        const elementX = (ElementDimensions.x + ElementDimensions.width / 2)
        const elementY = (ElementDimensions.y + ElementDimensions.height / 2)
        const d = distance(elementX, x, elementY, y)
        const relativePos = (elementX - d) / elementX
        el.animate([{
            fontWeight: `clamp(1, ${1000 * Math.pow(relativePos, 2)}, 1000)`,
            fontStretch: `${125 * Math.pow(relativePos, 2)}%`,
            fontVariationSettings: `'ital' ${Math.pow(relativePos, 2)}`
        }], {
            fill: "forwards",
            duration: 390,
            easing: "ease-out"
        })  
    })
}, 50)



title.onmousemove = (event) => {
    animateTextOnMove(event, title)
}

title.ontouchmove = event => animateTextOnMove(event.touches[0], title)