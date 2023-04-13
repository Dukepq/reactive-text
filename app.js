import {splitWrap} from "./SplitAndWrap.js"

// setting up the distance function
function distance(x1, x2, y1, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

// splitting and wrapping html text into span
const title = document.querySelector('.title')
// const spans = splitWrap(title)

// building mouse object, initiating to (0, 0) and updating the mouse position from there
const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

window.addEventListener('touchmove', (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY
})

// building a virtual position that lags behind the actual mouse position
const virtualPos = {
    x: window.innerWidth,
    y: window.innerHeight,
}

let maxDistance = title.getBoundingClientRect().width / 2

window.addEventListener('resize', () => {
    maxDistance = title.getBoundingClientRect().width / 2
})


function Character(parent, character, reverse = false) {
    let span = document.createElement('span')
    span.textContent = character
    parent.appendChild(span)
    console.log(reverse)
    this.fetchDistance = () => {
        this.dimensions = span.getBoundingClientRect()
        return distance(this.dimensions.x, virtualPos.x, this.dimensions.y, virtualPos.y)
    }
    this.updateProperties = (args) => {
        // console.log(args)
        const d = this.fetchDistance()
        this.width = args.weight ? ~~this.CalculateProperties(125, 75, d) : 100
        this.weight = args.weight ? ~~this.CalculateProperties(900, 100, d) : 300
        this.ital = this.CalculateProperties(1, 0, d).toFixed(2)
        this.setProperties()
    }

    this.CalculateProperties = (maxVal, minVal, distance) => {
        if (!reverse) {
            let attr = maxVal - Math.abs(maxVal * distance / maxDistance)
            return Math.max(minVal, attr + minVal)
        } else {
            let attr = (maxVal - (maxVal - Math.abs(maxVal * distance / maxDistance))) * 0.5
            return attr
            
        }
    }

    this.setProperties = () => {
        span.style.fontStretch = `${this.width}%`
        span.style.fontWeight = `${this.weight}`
        span.style.fontVariationSettings = `'ital' ${this.ital}`
    }

    return this
}

function textAnimation(title, reverse = false) {
    const characterList = []
    const text = title.innerText
    const textArray = text.split("")
    title.innerHTML = ""
    for (let i = 0; i < textArray.length; i++) {
        const character = new Character(title, textArray[i], reverse) // add third argument for reverse or not reverse, adjust updateProperties accordingly.
        characterList.push(character)
    }
    return characterList
}
const chars = textAnimation(title)


function render(characterList) {
    for (let i = 0; i < characterList.length; i++) {
        characterList[i].updateProperties({
            weight: characterList[i].weight,
            width: characterList[i].width,
            ital: characterList[i].ital
        })
    }
}
function animate() {
    virtualPos.x += (mouse.x - virtualPos.x) / 20
    virtualPos.y += (mouse.y - virtualPos.y) / 20
    render(chars)
    requestAnimationFrame(animate)
}
animate()
