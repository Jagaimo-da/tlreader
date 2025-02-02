function addCounterFunction() {
    const counterElem = document.querySelector(".overview__counter");
    const defaultValue = 0;
    const defaultValueStr = `${defaultValue}`;
    counterElem.setAttribute("count", defaultValueStr);
    counterElem.textContent = defaultValueStr;
    const btnElem = document.querySelector(".overview__btn");
    btnElem.addEventListener("click", () => {
        const currentCount = parseInt(counterElem.getAttribute("count"));
        const newCount = currentCount + 1;
        const newCountStr = `${newCount}`;
        counterElem.setAttribute("count", newCountStr);
        counterElem.textContent = newCountStr;
    });
}
addCounterFunction();
