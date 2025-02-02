function addCounterFunction() {
    const counterElem: Element = document.querySelector(".overview__counter");

    const defaultValue: number = 0;
    const defaultValueStr: string = `${defaultValue}`;
    counterElem.setAttribute("count", defaultValueStr);
    counterElem.textContent = defaultValueStr

    const btnElem: Element = document.querySelector(".overview__btn");
    
    btnElem.addEventListener(
        "click",
        () => {
            const currentCount: number = parseInt(counterElem.getAttribute("count"));
            const newCount: number = currentCount + 1;
            const newCountStr: string = `${newCount}`;
            counterElem.setAttribute("count", newCountStr);
            counterElem.textContent = newCountStr;
        }
    );
}

addCounterFunction();