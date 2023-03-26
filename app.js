import { splitWrap } from "./SplitAndWrap.js"

const title = document.querySelector('.title')
const spans = splitWrap(title)


const cursor = {
    x: 0,
    y: 0,
}

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

const animateText = throttle((event) => {
    //offsetX, offsetY
    const rect = title.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.offsetY - rect.top
    spans.forEach((el) => {
        const relativePos = 1 - Math.abs((el.offsetLeft + (el.getBoundingClientRect().width / 2) - x) / title.getBoundingClientRect().width)
        el.animate([{
            fontWeight: `${1000 * Math.pow(relativePos, 2)}`,
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
    animateText(event)
}
