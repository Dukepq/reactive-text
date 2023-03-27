import { splitWrap } from "./SplitAndWrap.js";

const title = document.querySelector('.title')


// throttle function that will always return the last known position.
function throttle(callback, timeout = 1000) {
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
    const rect = spanParent.getBoundingClientRect()
    const spanArray = Array.prototype.slice.call(spanParent.children) //element.children returns obj, converting to array here.
    const x = event.clientX - rect.left
    const y = event.offsetY - rect.top
    spanArray.forEach((el) => {
        const relativePos = 1 - Math.abs((el.offsetLeft + (el.getBoundingClientRect().width / 2) - x) / title.getBoundingClientRect().width)
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