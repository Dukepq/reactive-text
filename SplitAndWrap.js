function splitWrapCount() {
    let j = 0;
    return (htmlTextEl) => {
        j++;
        const spanArray = []
        const letterArray = htmlTextEl.innerText.split('');
        htmlTextEl.textContent = "";
        letterArray.forEach((el, i) => {
            const newSpan = document.createElement("span");
            newSpan.textContent = el;
            htmlTextEl.appendChild(newSpan);
            newSpan.classList.add(`${j}th-spanWrap`, `${j}th-spanWrap-${i + 1}`);
            spanArray.push(newSpan)
        })
        return spanArray
    }
}

export const splitWrap = splitWrapCount();