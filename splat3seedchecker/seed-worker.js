var Module = typeof createModule != "undefined" ? createModule : {}
Module["locateFile"] = (path, scriptDirectory_unused) => {
    return path
}
var moduleOverrides = Object.assign({}, Module)
var arguments_ = []
var thisProgram = "./this.program"
var quit_ = (status, toThrow) => {
    throw toThrow
}
var ENVIRONMENT_IS_WEB = true
var ENVIRONMENT_IS_WORKER = false
var scriptDirectory = ""
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    {
        read_ = url => {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", url, false)
            xhr.send(null)
            return xhr.responseText
        }
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
                var xhr = new XMLHttpRequest()
                xhr.open("GET", url, false)
                xhr.responseType = "arraybuffer"
                xhr.send(null)
                return new Uint8Array(xhr.response)
            }
        }
        readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", url, true)
            xhr.responseType = "arraybuffer"
            xhr.onload = () => {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                    onload(xhr.response)
                    return
                }
                onerror()
            }
            xhr.onerror = onerror
            xhr.send(null)
        }
    }
    setWindowTitle = title => (document.title = title)
} else {
}
var out = Module["print"] || console.log.bind(console)
var err = Module["printErr"] || console.warn.bind(console)
Object.assign(Module, moduleOverrides)
moduleOverrides = null
if (Module["arguments"]) arguments_ = Module["arguments"]
if (Module["thisProgram"]) thisProgram = Module["thisProgram"]
if (Module["quit"]) quit_ = Module["quit"]
var wasmBinary
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"]
var noExitRuntime = Module["noExitRuntime"] || true
if (typeof WebAssembly != "object") {
    abort("no native wasm support detected")
}
var wasmMemory
var ABORT = false
var EXITSTATUS
var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined
function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead
    var endPtr = idx
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
    }
    var str = ""
    while (idx < endPtr) {
        var u0 = heapOrArray[idx++]
        if (!(u0 & 128)) {
            str += String.fromCharCode(u0)
            continue
        }
        var u1 = heapOrArray[idx++] & 63
        if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1)
            continue
        }
        var u2 = heapOrArray[idx++] & 63
        if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2
        } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63)
        }
        if (u0 < 65536) {
            str += String.fromCharCode(u0)
        } else {
            var ch = u0 - 65536
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
        }
    }
    return str
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0
    var startIdx = outIdx
    var endIdx = outIdx + maxBytesToWrite - 1
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i)
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i)
            u = (65536 + ((u & 1023) << 10)) | (u1 & 1023)
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break
            heap[outIdx++] = 192 | (u >> 6)
            heap[outIdx++] = 128 | (u & 63)
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break
            heap[outIdx++] = 224 | (u >> 12)
            heap[outIdx++] = 128 | ((u >> 6) & 63)
            heap[outIdx++] = 128 | (u & 63)
        } else {
            if (outIdx + 3 >= endIdx) break
            heap[outIdx++] = 240 | (u >> 18)
            heap[outIdx++] = 128 | ((u >> 12) & 63)
            heap[outIdx++] = 128 | ((u >> 6) & 63)
            heap[outIdx++] = 128 | (u & 63)
        }
    }
    heap[outIdx] = 0
    return outIdx - startIdx
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64
function updateGlobalBufferAndViews(buf) {
    buffer = buf
    Module["HEAP8"] = HEAP8 = new Int8Array(buf)
    Module["HEAP16"] = HEAP16 = new Int16Array(buf)
    Module["HEAP32"] = HEAP32 = new Int32Array(buf)
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf)
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf)
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf)
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf)
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216
var wasmTable
var __ATPRERUN__ = []
var __ATINIT__ = []
var __ATPOSTRUN__ = []
var runtimeInitialized = false
function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]]
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}
function initRuntime() {
    runtimeInitialized = true
    callRuntimeCallbacks(__ATINIT__)
}
function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]]
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}
function addOnInit(cb) {
    __ATINIT__.unshift(cb)
}
function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var runDependencies = 0
var runDependencyWatcher = null
var dependenciesFulfilled = null
function addRunDependency(id) {
    runDependencies++
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}
function removeRunDependency(id) {
    runDependencies--
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher)
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled
            dependenciesFulfilled = null
            callback()
        }
    }
}
function abort(what) {
    {
        if (Module["onAbort"]) {
            Module["onAbort"](what)
        }
    }
    what = "Aborted(" + what + ")"
    err(what)
    ABORT = true
    EXITSTATUS = 1
    what += ". Build with -sASSERTIONS for more info."
    var e = new WebAssembly.RuntimeError(what)
    throw e
}
var dataURIPrefix = "data:application/octet-stream;base64,"
function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix)
}
var wasmBinaryFile
wasmBinaryFile = "gearSeed.wasm"
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}
function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(file)
        }
        throw "both async and sync fetching of the wasm failed"
    } catch (err) {
        abort(err)
    }
}
function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" })
                .then(function (response) {
                    if (!response["ok"]) {
                        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                    }
                    return response["arrayBuffer"]()
                })
                .catch(function () {
                    return getBinary(wasmBinaryFile)
                })
        }
    }
    return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile)
    })
}
function createWasm() {
    var info = { a: asmLibraryArg }
    function receiveInstance(instance, module) {
        var exports = instance.exports
        Module["asm"] = exports
        wasmMemory = Module["asm"]["b"]
        updateGlobalBufferAndViews(wasmMemory.buffer)
        wasmTable = Module["asm"]["g"]
        addOnInit(Module["asm"]["c"])
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate")
    function receiveInstantiationResult(result) {
        receiveInstance(result["instance"])
    }
    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
            .then(function (binary) {
                return WebAssembly.instantiate(binary, info)
            })
            .then(function (instance) {
                return instance
            })
            .then(receiver, function (reason) {
                err("failed to asynchronously prepare wasm: " + reason)
                abort(reason)
            })
    }
    function instantiateAsync() {
        if (
            !wasmBinary &&
            typeof WebAssembly.instantiateStreaming == "function" &&
            !isDataURI(wasmBinaryFile) &&
            typeof fetch == "function"
        ) {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function (response) {
                var result = WebAssembly.instantiateStreaming(response, info)
                return result.then(receiveInstantiationResult, function (reason) {
                    err("wasm streaming compile failed: " + reason)
                    err("falling back to ArrayBuffer instantiation")
                    return instantiateArrayBuffer(receiveInstantiationResult)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiationResult)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance)
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e)
            return false
        }
    }
    instantiateAsync()
    return {}
}
function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        callbacks.shift()(Module)
    }
}
function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}
function getHeapMax() {
    return 2147483648
}
function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16)
        updateGlobalBufferAndViews(wasmMemory.buffer)
        return 1
    } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length
    requestedSize = requestedSize >>> 0
    var maxHeapSize = getHeapMax()
    if (requestedSize > maxHeapSize) {
        return false
    }
    let alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple)
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296)
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536))
        var replacement = emscripten_realloc_buffer(newSize)
        if (replacement) {
            return true
        }
    }
    return false
}
function getCFunc(ident) {
    var func = Module["_" + ident]
    return func
}
function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        string: str => {
            var ret = 0
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1
                ret = stackAlloc(len)
                stringToUTF8(str, ret, len)
            }
            return ret
        },
        array: arr => {
            var ret = stackAlloc(arr.length)
            writeArrayToMemory(arr, ret)
            return ret
        },
    }
    function convertReturnValue(ret) {
        if (returnType === "string") {
            return UTF8ToString(ret)
        }
        if (returnType === "boolean") return Boolean(ret)
        return ret
    }
    var func = getCFunc(ident)
    var cArgs = []
    var stack = 0
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]]
            if (converter) {
                if (stack === 0) stack = stackSave()
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var ret = func.apply(null, cArgs)
    function onDone(ret) {
        if (stack !== 0) stackRestore(stack)
        return convertReturnValue(ret)
    }
    ret = onDone(ret)
    return ret
}
function cwrap(ident, returnType, argTypes, opts) {
    argTypes = argTypes || []
    var numericArgs = argTypes.every(type => type === "number" || type === "boolean")
    var numericRet = returnType !== "string"
    if (numericRet && numericArgs && !opts) {
        return getCFunc(ident)
    }
    return function () {
        return ccall(ident, returnType, argTypes, arguments, opts)
    }
}
var asmLibraryArg = { a: _emscripten_resize_heap }
var asm = createWasm()
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["c"]).apply(null, arguments)
})
var _get_seed_after_roll = (Module["_get_seed_after_roll"] = function () {
    return (_get_seed_after_roll = Module["_get_seed_after_roll"] = Module["asm"]["d"]).apply(null, arguments)
})
var _get_seed = (Module["_get_seed"] = function () {
    return (_get_seed = Module["_get_seed"] = Module["asm"]["e"]).apply(null, arguments)
})
var _refine_seed = (Module["_refine_seed"] = function () {
    return (_refine_seed = Module["_refine_seed"] = Module["asm"]["f"]).apply(null, arguments)
})
var _malloc = (Module["_malloc"] = function () {
    return (_malloc = Module["_malloc"] = Module["asm"]["h"]).apply(null, arguments)
})
var _free = (Module["_free"] = function () {
    return (_free = Module["_free"] = Module["asm"]["i"]).apply(null, arguments)
})
var stackSave = (Module["stackSave"] = function () {
    return (stackSave = Module["stackSave"] = Module["asm"]["j"]).apply(null, arguments)
})
var stackRestore = (Module["stackRestore"] = function () {
    return (stackRestore = Module["stackRestore"] = Module["asm"]["k"]).apply(null, arguments)
})
var stackAlloc = (Module["stackAlloc"] = function () {
    return (stackAlloc = Module["stackAlloc"] = Module["asm"]["l"]).apply(null, arguments)
})
Module["ccall"] = ccall
Module["cwrap"] = cwrap
var calledRun
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run()
    if (!calledRun) dependenciesFulfilled = runCaller
}
function run(args) {
    args = args || arguments_
    if (runDependencies > 0) {
        return
    }
    preRun()
    if (runDependencies > 0) {
        return
    }
    function doRun() {
        if (calledRun) return
        calledRun = true
        Module["calledRun"] = true
        if (ABORT) return
        initRuntime()
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]()
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...")
        setTimeout(function () {
            setTimeout(function () {
                Module["setStatus"]("")
            }, 1)
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]]
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
run()

function wrapSeedAfterRoll(Module) {
    // JS-friendly wrapper around the WASM call
    return function (seed, sequence, drinks, brand) {
        const length_sequence = sequence.length
        const length_drinks = drinks.length

        const b1 = new Uint32Array(sequence)
        const b2 = new Uint32Array(drinks)

        // set up input arrays with the input data
        const buffer1 = Module._malloc(b1.length * b1.BYTES_PER_ELEMENT)
        const buffer2 = Module._malloc(b2.length * b2.BYTES_PER_ELEMENT)
        Module.HEAPU32.set(b1, buffer1 >> 2)
        Module.HEAPU32.set(b2, buffer2 >> 2)

        // make the call
        const result = Module.ccall(
            "get_seed_after_roll",
            "number",
            ["number", "number", "number", "number", "number", "number"],
            [seed, buffer1, length_sequence, buffer2, length_drinks, brand]
        )

        Module._free(buffer)
        return result
    }
}

function wrapSeed(Module) {
    // JS-friendly wrapper around the WASM call
    return function (sequence, drinks, brand, max_results) {
        const length_sequence = sequence.length
        const length_drinks = drinks.length

        const b1 = new Uint32Array(sequence)
        const b2 = new Uint32Array(drinks)

        // set up input arrays with the input data
        const buffer1 = Module._malloc(b1.length * b1.BYTES_PER_ELEMENT)
        const buffer2 = Module._malloc(b2.length * b2.BYTES_PER_ELEMENT)
        Module.HEAPU32.set(b1, buffer1 >> 2)
        Module.HEAPU32.set(b2, buffer2 >> 2)

        // allocate memory for the result array
        const resultBuffer = Module._malloc(max_results * b1.BYTES_PER_ELEMENT)
        // make the call
        const resultPointer = Module.ccall(
            "get_seed",
            "number",
            ["number", "number", "number", "number", "number", "number", "number"],
            [buffer1, length_sequence, buffer2, length_drinks, resultBuffer, max_results, brand]
        )
        // get the data from the returned pointer into an flat array
        const resultFlatArray = []
        for (let i = 0; i < max_results; i++) {
            const r = Module.HEAPU32[resultPointer / Uint32Array.BYTES_PER_ELEMENT + i]
            if (r === 0) {
                break
            } else {
                resultFlatArray.push(r)
            }
        }
        Module._free(buffer1)
        Module._free(buffer2)
        Module._free(resultBuffer)
        return resultFlatArray
    }
}

function wrapSeedRefine(Module) {
    // JS-friendly wrapper around the WASM call
    return function (sequence, seed_refine_list, drinks, brand) {
        const length_sequence = sequence.length
        const length_drinks = drinks.length
        const length_refine = seed_refine_list.length
        const max_results = length_refine

        const b1 = new Uint32Array(sequence)
        const b2 = new Uint32Array(drinks)
        const b3 = new Uint32Array(seed_refine_list)

        // set up input arrays with the input data
        const buffer1 = Module._malloc(b1.length * b1.BYTES_PER_ELEMENT)
        const buffer2 = Module._malloc(b2.length * b2.BYTES_PER_ELEMENT)
        const buffer3 = Module._malloc(b3.length * b3.BYTES_PER_ELEMENT)
        Module.HEAPU32.set(b1, buffer1 >> 2)
        Module.HEAPU32.set(b2, buffer2 >> 2)
        Module.HEAPU32.set(b3, buffer3 >> 2)

        // allocate memory for the result array
        const resultBuffer = Module._malloc(max_results * b1.BYTES_PER_ELEMENT)
        // make the call
        const resultPointer = Module.ccall(
            "refine_seed",
            "number",
            ["number", "number", "number", "number", "number", "number", "number", "number", "number"],
            [buffer1, length_sequence, buffer2, length_drinks, resultBuffer, max_results, buffer3, length_refine, brand]
        )
        // get the data from the returned pointer into an flat array
        const resultFlatArray = []
        for (let i = 0; i < max_results; i++) {
            const r = Module.HEAPU32[resultPointer / Uint32Array.BYTES_PER_ELEMENT + i]
            if (r === 0) {
                break
            } else {
                resultFlatArray.push(r)
            }
        }
        Module._free(buffer1)
        Module._free(buffer2)
        Module._free(buffer3)
        Module._free(resultBuffer)
        return resultFlatArray
    }
}

onmessage = e => {
    const sequence = e.data.sequence
    const drinks = e.data.drinks
    const brand = e.data.brand
    const refine_max = e.data.refine_max
    const get_seed_after_roll = wrapSeedAfterRoll(Module)
    const gear_seed = wrapSeed(Module)
    const seed_refine = wrapSeedRefine(Module)
    let res
    if (e.data.displaySequence === undefined) {
        res = gear_seed(sequence, drinks, brand, refine_max).map(elem => {
            return { Start: elem, Seed: `0x${(get_seed_after_roll(elem, sequence, drinks, brand) >>> 0).toString(16)}` }
        })
    } else {
        res = seed_refine(
            sequence,
            e.data.displaySequence.map(elem => elem.Start),
            drinks,
            brand
        ).map(elem => {
            return { Start: elem, Seed: `0x${(get_seed_after_roll(elem, sequence, drinks, brand) >>> 0).toString(16)}` }
        })
    }
    postMessage({
        res,
    })
}
