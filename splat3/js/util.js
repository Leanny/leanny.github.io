export function sleep(dutation) {
    return new Promise(resolve => setTimeout(resolve, dutation))
}

export function memoize(cb) {
    const cache = new Map()
    return (...args) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)
        const result = cb(...args)
        cache.set(key, result)
        return result
    }
}

export function addGlobalEventListener(type, selector, callback, options = {}, parent = document) {
    parent.addEventListener(
        type,
        e => {
            if (e.target.matches(selector)) callback(e)
        },
        options
    )
}

export function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

export function createElement(type, options = {}) {
    const element = document.createElement(type)
    Object.entries(options).forEach(([key, value]) => {
        if (key === "class") {
            element.classList.add(value)
            return
        }
        if (key === "dataset") {
            Object.entries(values).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue
            })
            return
        }
        if (key === "text") {
            element.textContent = value
            return
        }
        element.setAttribute(key, value)
    })
    return element
}
