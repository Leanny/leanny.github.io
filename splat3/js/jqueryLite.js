class ElementCollection extends Array {
    ready(cb) {
        const isReady = this.some(e => {
            return e.readyState != null && e.readyState != "loading"
        })
        if (isReady) {
            cb()
        } else {
            this.on("DOMContentLoaded", cb)
        }
        return this
    }

    on(event, cbOrSelector, cb) {
        if (typeof cbOrSelector === "function") {
            this.forEach(e => e.addEventListener(event, cbOrSelector))
        } else {
            this.forEach(elem => {
                elem.addEventListener(event, e => {
                    if (e.target.matches(cbOrSelector)) cb(e)
                })
            })
        }
        return this
    }

    removeClass(className) {
        this.forEach(e => e.classList.remove(className))
        return this
    }

    addClass(className) {
        this.forEach(e => e.classList.add(className))
        return this
    }

    css(property, value) {
        const camelProp = property.replace(/(-[a-z])/, g => {
            return g.replace("-", "").toUpperCase()
        })
        this.forEach(e => (e.style[camelProp] = value))
        return this
    }
}

class AjaxPromise {
    constructor(promise) {
        this.promise = promise
    }

    done(cb) {
        this.promise = this.promise.then(data => {
            cb(data)
            return data
        })
        return this
    }

    fail(cb) {
        this.promise = this.promise.catch(cb)
        return this
    }

    always(cb) {
        this.promise = this.promise.finally(cb)
        return this
    }
}

function $(param) {
    if (typeof param === "string" || param instanceof String) {
        return new ElementCollection(...document.querySelectorAll(param))
    } else {
        return new ElementCollection(param)
    }
}

$.get = function ({ url, data = {}, success = () => {}, dataType = "text/plain" }) {
    const queryString = Object.entries(data)
        .map(([key, value]) => {
            return `${key}=${value}`
        })
        .join("&")
    const fetchUrl = queryString.length > 0 ? `${url}?${queryString}` : url
    return new AjaxPromise(
        fetch(fetchUrl, {
            method: "GET",
            headers: {
                "Content-Type": dataType,
            },
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(res.status)
                }
            })
            .then(data => {
                success(data)
                return data
            })
    )
}
