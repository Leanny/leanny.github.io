export function generateHeader(elem) {
    elem.append(`
<ul class="navbar-nav mr-auto">
    <li class="nav-item">
        <a class="nav-link" href="database.html">Weapon and Gear Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="damagetable.html">Damage Multipliers</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="misc.html">Misc Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="manuals.html">Manual Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="parameters.html">Parameter Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="tableturf.html">Tableturf Battle Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="collectibles.html">Collectibles Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="catalog.html">Catalogue Database</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="coop.html">Salmon Run Database</a>
    </li>
    
</ul>`)
}

export function generateFooter(elem) {
    elem.append(`<div class="container text-muted">
    <div class="footer-notice">
        <p>Webpage created by Lean. Framework used is <a href="https://getbootstrap.com/">Bootstrap</a>. <a href="https://github.com/OatmealDome/OatmealDome.NinLib.MessageStudio">Message Lib</a> by <a href="https://twitter.com/OatmealDome">OatmealDome<span class="fa fa-twitter"></span></a></p>
        <p>
            Feedback or suggestions are welcome. Please contact me via Twitter.
            <a href="https://twitter.com/LeanYoshi"><span class="fa fa-twitter"></span></a>
        </p>
    </div>
</div>`)
}

export function get_prefix() {
    if (window.location.href.includes("leanny.github.io")) {
        return "https://leanny.github.io/splat3/"
    } else {
        return "http://127.0.0.1:5500/"
    }
}

export const localize = (dir, key) => lang_dict[dir][key]

export const get_image_tag = (img, alt, extra = "") => {
    const new_img = img.replace(".png", ".webp")
    return `<picture>
        <source type="image/webp" srcset="${new_img}" ${extra}>
        <source type="image/png" srcset="${img}" ${extra}>
        <img src="${img}" alt="${alt}" ${extra}>
    </picture>`
}

export const format_img = (base_url, value, width) => get_image_tag(`${base_url}${value}.png`, "", `width="${width}"`)

export const add_tab = (tab_name, tab_label) => {
    const first = $("#modes").children().length == 0
    $("#modes").append(`
    <li class="nav-item">
    <a
        class="nav-link${first ? " active" : ""}
        id="${tab_name}-tab"
        data-toggle="tab"
        href="#${tab_name}"
        role="tab"
        aria-controls="${tab_name}"
        aria-selected="true"
        >${tab_label}</a
    >
</li>`)
    $("#modeTabControl").append(`
    <div class="tab-pane fade show${
        first ? " active" : ""
    }" id="${tab_name}" role="tabpanel" aria-labelledby="${tab_name}-tab"></div>    
    `)
}

export const add_table = (tab_name, tabale_name, table_configuration, header_name) => {
    const header = header_name !== undefined ? `<h2>${header_name}</h2>` : ""
    let ths = ""
    table_configuration.forEach(entry => {
        const fields = []
        for (const [elem_key, elem_value] of Object.entries(entry)) {
            if (elem_key !== "Label") {
                fields.push(`data-${elem_key}="${elem_value}"`)
            }
        }
        ths += `<th scope="col" ${fields.join(" ")}>
            ${entry.Label}
        </th>`
    })
    $(`#${tab_name}`).append(`${header}
    <div class="table-responsive">
        <table
            class="table table-striped table-hover"
            id="${tabale_name}"
            data-sortable="true"
            data-search="true"
            data-show-columns="true"
            data-show-pagination-switch="true"
            data-show-fullscreen="true"
        >
            <thead>
                <tr>
                    ${ths}
                </tr>
            </thead>
        </table>
    </div>
</div>`)
    $(`#${tabale_name}`).bootstrapTable({})
    //$(`#${tab_name}`).append(table_configuration)
}
