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
    <li class="nav-item">
        <a class="nav-link" href="mission.html">Story Mode</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="fest.html">Splatfest</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="ability.html">Ability Index</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="medals.html">Medal Index</a>
    </li>
    
</ul>`)
}

export function generate_migration_info(elem) {
    elem.append(
        '<div style="background-color: white; padding:10px; border: 1px solid black; border-radius: 10px;"><h2>Note for developers</h2>If you are using the raw github JSON files from this repository, please consider changing the prefix <code>https://raw.githubusercontent.com/Leanny/leanny.github.io/master/splat3/</code> to either <code>https://raw.githubusercontent.com/Leanny/splat3/master/</code> or <code>https://leanny.github.io/splat3/</code>. The old URLs will become invalid on April 25th.</div>'
    )
}

export function generateFooter(elem) {
    elem.append(`<div class="container text-muted">
    <div class="footer-notice">
        <p>Webpage created by Lean. Framework used is <a href="https://getbootstrap.com/">Bootstrap</a>. <a href="https://github.com/OatmealDome/OatmealDome.NinLib.MessageStudio">Message Lib</a> by <a href="https://twitter.com/OatmealDome">OatmealDome<span class="fa fa-twitter"></span></a>. Salmon Run RNG Data in cooperation with <a href="https://twitter.com/WemI0">WemI0<span class="fa fa-twitter"></span></a></p>
        <p>
            Feedback or suggestions are welcome. Please contact me via Twitter
            <a href="https://twitter.com/LeanYoshi"><span class="fa fa-twitter"></span></a> or Github <a href="https://github.com/leanny/leanny.github.io"><span class="fa fa-github"></span></a>.
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

export function localize(dir, key) {
    return lang_dict[dir][key]
}

export function get_image_tag(img, alt, extra = "") {
    const new_img = img.replace(".png", ".webp")
    return `<picture>
        <source type="image/webp" srcset="${new_img}" ${extra}>
        <source type="image/png" srcset="${img}" ${extra}>
        <img src="${img}" alt="${alt}" ${extra}>
    </picture>`
} //

export function format_img(base_url, value, width) {
    return get_image_tag(`${base_url}${value}.png`, "", `width="${width}"`)
}

export function add_tab(tab_name, tab_label) {
    const first = $("#modes").children().length == 0
    $("#modes").append(`
    <li class="nav-item">
    <a
        class="nav-link${first ? " active" : ""}"
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

export function add_table(tab_name, tabale_name, table_configuration, header_name) {
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
            data-page-size="10"
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

// formatter
export function uroko_array_formatter(value) {
    return `<p>Bronze: ${value.BronzeUrokoNum}<br />Silver: ${value.SilverUrokoNum}<br />Gold ${value.GoldUrokoNum}`
}

export function evaluate_string(value) {
    if (value === undefined) return value
    return value.replace(/\[group.*\]/, "").replaceAll(/\[ruby="(.*?)"\](.*?)\[\/ruby\]/g, "<ruby>$2<rt>$1</ruby>")
}

export function byname_adjective_formatter(value) {
    return evaluate_string(localize("CommonMsg/Byname/BynameAdjective", value))
}

export function byname_subject_formatter(value) {
    const s1 = evaluate_string(localize("CommonMsg/Byname/BynameSubject", value + "_0"))
    let s2 = localize("CommonMsg/Byname/BynameSubject", value + "_1")
    if (s2 !== undefined) {
        s2 = evaluate_string(s2)
    }
    return `${s1}${s2 === undefined || s2.length === 0 ? "" : " | " + s2}`
}

export function byname_subject_simple_formatter(value) {
    return evaluate_string(localize("CommonMsg/Byname/BynameSubject", value))
}

export function nameplate_formatter(value) {
    return `<center>${format_img(`${get_prefix()}images/npl/`, value)}</center>`
}

export function emote_complete_formatter(value) {
    return `<center>${emoji_image_formatter(value)}<br />${emoji_name_formatter(value)}</center>`
}
export function emote_name_formatter(value) {
    return localize("CommonMsg/EmoteName", value)
}
export function emote_image_formatter(value) {
    return format_img(`${get_prefix()}images/emote/`, value)
}

export function food_ticket_formatter(value) {
    const translation = {
        Money50: ["IconShopFood", "BattleMoney_Up_01"],
        Money100: ["IconShopFoodL", "BattleMoney_Up_02"],
        Exp50: ["IconShopFoodRank", "BattleExp_Up_01"],
        Exp100: ["IconShopFoodRankL", "BattleExp_Up_02"],
        MoneyParty: ["IconShopParty_00", "PartyMoney_Up"],
        ExpParty: ["IconShopParty_01", "PartyExp_Up"],
    }
    if (value === "None") {
        return "<p><center>Default</center></p>"
    }
    if (value === "GearPower") {
        const img = format_img(`${get_prefix()}images/food/`, "GearPowerTicketBase", 64)
        return `<p><center>${img}<br />Gear Ticket</center></p>`
    }
    const img = format_img(`${get_prefix()}images/food/`, translation[value][0], 64)
    return `<p><center>${img}<br />${localize("CommonMsg/Lobby/LobbyFoodName", translation[value][1])}</center></p>`
}

export const colorTagFormat = value => {
    return value.replace("[color=0001]", `<font color="orange">`).replace("[color=ffff]", "</font>")
}

export function food_desc_formatter(value) {
    let img
    switch (value) {
        case "None":
            return "<p>Default</p>"
        case "Exp100":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "BattleExp_Up_02_Overwrite"))}</p>`
        case "Exp50":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "BattleExp_Up_01_Overwrite"))}</p>`
        case "ExpParty":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "PartyExp_Up_Overwrite"))}</p>`
        case "GearPower":
            return "<p>Gear will gain XP more quickly and is more likely to receive a specific ability when it levels up.</p>"
        case "Money100":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "BattleMoney_Up_02_Overwrite"))}</p>`
        case "Money50":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "BattleMoney_Up_01_Overwrite"))}</p>`
        case "MoneyParty":
            return `<p>${colorTagFormat(localize("CommonMsg/Lobby/LobbyFoodExp", "PartyMoney_Up_Overwrite"))}</p>`
    }
}

export function gear_image_formatter(value) {
    return format_img(`${get_prefix()}images/gear/`, value, 96)
}

export function gear_name_formatter(type, value) {
    return localize(`CommonMsg/Gear/${type}`, value)
}

export function gear_name_head_formatter(value) {
    return gear_name_formatter("GearName_Head", value)
}

export function gear_name_clothes_formatter(value) {
    return gear_name_formatter("GearName_Clothes", value)
}

export function gear_name_shoes_formatter(value) {
    return gear_name_formatter("GearName_Shoes", value)
}

export function weapon_image_formatter(value) {
    return format_img(`${get_prefix()}images/weapon/`, "Wst_" + value, 96)
}

export function weapon_name_formatter(value) {
    return localize("CommonMsg/Weapon/WeaponName_Main", value)
}

export function reward_formatter(value) {
    if (value.Type === "NamePlateBg") {
        const img_name = value.NamePlateBgInfo.replace("Work/Gyml/NamePlateBgInfo/", "").replace(
            ".spl__NamePlateBgInfo.gyml",
            ""
        )
        return nameplate_formatter(img_name)
    } else if (value.Type === "Byname") {
        const byname_adjective = value.Byname_Adjective.replace("Work/Gyml/Byname/", "").replace(
            ".spl__BynameAdjectiveInfo.gyml",
            ""
        )
        const byname_subject = value.Byname_Subject.replace("Work/Gyml/Byname/", "").replace(
            ".spl__BynameSubjectInfo.gyml",
            ""
        )
        const adj = byname_adjective_formatter(byname_adjective)
        const subj = byname_subject_formatter(byname_subject)
        return `<center>${format_img(
            get_prefix() + "images/catalog/",
            "IconNameplate_00"
        )}<br />${adj}<br />${subj}</center>`
    } else if (value.Type === "Emote") {
        const emoteName = value.EmoteInfo.replace("Work/Gyml/", "").replace(".spl__EmoteInfo.gyml", "")
        return emoji_complete_formatter(emoteName)
    } else if (value.Type === "FoodTicket") {
        return food_ticket_formatter(value.BoostType)
    } else if (value.Type === "Gear_Head") {
        const image_name = value.GearInfo.replace("Work/Gyml/", "").replace(".spl__GearInfo.gyml", "")
        return `<center>${gear_image_formatter(image_name)}<br />${gear_name_head_formatter(
            image_name.substring(4)
        )}</center>`
    } else if (value.Type === "Gear_Clothes") {
        const image_name = value.GearInfo.replace("Work/Gyml/", "").replace(".spl__GearInfo.gyml", "")
        return `<center>${gear_image_formatter(image_name)}<br />${gear_name_clothes_formatter(
            image_name.substring(4)
        )}</center>`
    } else if (value.Type === "Gear_Shoes") {
        const image_name = value.GearInfo.replace("Work/Gyml/", "").replace(".spl__GearInfo.gyml", "")
        return `<center>${gear_image_formatter(image_name)}<br />${gear_name_shoes_formatter(
            image_name.substring(4)
        )}</center>`
    } else if (value.Type === "Weapon") {
        const image_name = value.WeaponInfo.replace("Work/Gyml/", "").replace(".spl__WeaponInfoMain.gyml", "")
        return `<center>${weapon_image_formatter(image_name)}<br />${weapon_name_formatter(image_name)}</center>`
    } else if (value.Type === "MiniGameCardPack") {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconCardPack_00")}</center>`
    } else if (value.Type === "MiniGameCardPackFresh") {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconCardPack_01")}</center>`
    } else if (value.Type === "LockerSticker") {
        const image_name = value.LockerGoodsStickerInfo.replace("Work/Gyml/", "").replace(
            ".spl__LockerGoodsStickerInfo.gyml",
            ""
        )
        return `<center>${format_img(get_prefix() + "images/zakka/", image_name)}<br />Locker Sticker</center>`
    } else if (value.Type === "LockerFigure") {
        const image_name = value.LockerGoodsFigureInfo.replace("Work/Gyml/", "").replace(
            ".spl__LockerGoodsFigureInfo.gyml",
            ""
        )
        return `<center>${format_img(get_prefix() + "images/zakka/", image_name)}<br />Locker Figure</center>`
    } else if (value.Type === "RandomFoodTicket") {
        return "<center>Random Food Ticket</center>"
    } else if (value.Type === "RandomDrinkTicket") {
        return "<center>Random Drink Ticket</center>"
    } else if (value.Type === "RandomNamePlateBg") {
        return `<center>${format_img(
            get_prefix() + "images/catalog/",
            "IconNameplate_02"
        )}<br />Random Nameplate</center>`
    } else if (value.Type === "RandomByname") {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconNameplate_03")}<br />Random Title</center>`
    } else if (value.Type === "MysteryBoxA") {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconCatalogBox_00")}</center>`
    } else if (value.Type === "MysteryBoxB") {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconCatalogBox_01")}</center>`
    } else if (value.Type === undefined) {
        return "-"
    } else {
        console.error(value)
    }
}

export function locker_figure_image_formatter(value) {
    return `<center>${format_img(get_prefix() + "images/zakka/", value, 96)}</center>`
}

export function locker_figure_name_formatter(value) {
    return localize("CommonMsg/Goods/GoodsName", value)
}

// thanks to kjhf https://github.com/Leanny/leanny.github.io/issues/171
function rgbaToVal(redF, greenF, blueF, alphaF = 1.0) {
    let redInt = 255.0 * redF
    let greenInt = 255.0 * greenF
    let blueInt = 255.0 * blueF
    let alphaInt = 255.0 * alphaF
    let colorVal = ((alphaInt & 0xff) << 24) | ((redInt & 0xff) << 16) | ((greenInt & 0xff) << 8) | (blueInt & 0xff)
    colorVal = colorVal >>> 0 // Make uint
    return colorVal
}

function rgbaToHex(redF, greenF, blueF, alphaF = 1.0) {
    let colorVal = rgbaToVal(redF, greenF, blueF, alphaF)
    // console.log("ARGB: 0x" + colorVal.toString(16).toUpperCase());
    return "#" + colorVal.toString(16) // e.g. #ff112233
}

export function color_formatter(value) {
    return `<p style="background-color: rgba(${value.R * 255}, ${value.G * 255}, ${value.B * 255}, ${value.A});">R: ${
        value.R
    }<br />G: ${value.G}<br />B: ${value.B}<br />A: ${value.A}</p><p>${rgbaToHex(
        value.R,
        value.G,
        value.B,
        value.A
    )}</p>`
}

export function badge_image_format(value) {
    const v = value.replace("Work/Gyml/BadgeInfo", "Badge").replace(".spl__BadgeInfo.gyml", "")
    return `<center>${format_img(`${get_prefix()}images/badge/`, v)}</center>`
}

export function badge_description_formatter(value) {
    let res = localize("CommonMsg/Badge/BadgeMsg", value.MsgLabelEx)
    if (res !== undefined) {
        if (res.includes("[group=0004 type=0007 params=00 00 00 00]")) {
            res = res.replace(
                "[group=0004 type=0007 params=00 00 00 00]",
                localize("CommonMsg/Coop/CoopEnemy", value.Sub1_Str)
            )
        }
        if (res.includes("[group=0004 type=000e params=00 00 00 00]")) {
            res = res.replace(
                "[group=0004 type=000e params=00 00 00 00]",
                localize("CommonMsg/Coop/CoopStageName", value.Sub1_Str)
            )
        }
        if (res.includes("[group=0004 type=000f params=00 00 00 00]")) {
            res = res.replace(
                "[group=0004 type=000f params=00 00 00 00]",
                localize("CommonMsg/Gear/GearBrandName", `B${("" + value.Sub1_Int).padStart(2, "0")}`)
            )
        }
        if (res.includes("[group=0004 type=0001 params=00 00 00 00]")) {
            if (value.Category === "WeaponLevel") {
                res = res.replace(
                    "[group=0004 type=0001 params=00 00 00 00]",
                    localize("CommonMsg/Weapon/WeaponName_Main", weapon_dict[value.Sub1_Int].__RowId)
                )
            } else if (value.Category === "WinCount_WeaponSp") {
                res = res.replace(
                    "[group=0004 type=0001 params=00 00 00 00]",
                    localize("CommonMsg/Weapon/WeaponName_Special", special_dict[value.Sub1_Int].__RowId)
                )
            } else {
                console.error(value)
            }
        }
    } else {
        res = localize("CommonMsg/Badge/BadgeMsg", value.Name)
    }
    return res
}

export function enemy_name_formatter(value) {
    return localize("CommonMsg/Coop/CoopEnemy", value)
}

export function enemy_image_formatter(value) {
    return `<center>${format_img(get_prefix() + "images/coopEnemy/", value, 96)}</center>`
}

export function coop_skin_name_formatter(value) {
    return localize("CommonMsg/Coop/CoopSkinName", value)
}

export function coop_skin_image_formatter(value) {
    return `<center>${format_img(get_prefix() + "images/coopSkin/", value, 96)}</center>`
}

export function reward_type_formatter(value) {
    if (value === "Byname") return "Title"
    if (value === "NamePlateBg") return "Banner"
    if (value === "AllGearSkillChip") return "All Chunks"
    if (value === "GearSkillChip") return "Random Chunk"
    if (value === "MiniGameCardPack") return "Pack of Cards"
    if (value === "LockerSticker") return "Locker Sticker"
    if (value === "LockerFigure") return "Locker Figure"
    if (value === "FoodTicket") return "Food Ticket"
    if (value === "DrinkTicket") return "Drink Ticket"
    if (value === "MiniGameCardPackFresh") return "Fresh Card Pack"
    return value
}

export function nameplate_full_formatter(value) {
    const stem = value.replace("Work/Gyml/NamePlateBgInfo/", "").replace(".spl__NamePlateBgInfo.gyml", "")
    return nameplate_formatter(stem)
}

export function byname_full_formatter(value) {
    const byname_adjective = value[0].replace("Work/Gyml/Byname/", "").replace(".spl__BynameAdjectiveInfo.gyml", "")
    const byname_subject = value[1].replace("Work/Gyml/Byname/", "").replace(".spl__BynameSubjectInfo.gyml", "")
    const adj = byname_adjective_formatter(byname_adjective)
    if (adj === undefined) {
        return "-"
    }
    const subj = byname_subject_formatter(byname_subject)
    return `${adj}<br />${subj}`
}

export function misc_url(version, value) {
    return `${get_prefix()}/data/parameter/${version}/misc/${value}.json`
}

export function mush_url(version, value) {
    return `${get_prefix()}/data/mush/${version}/${value}.json`
}

export function card_image_formatter(value) {
    return `<center>${format_img(`${get_prefix()}images/minigame/card/`, value, 96)}</center>`
}
export function card_sleeve_formatter(value) {
    return `<div class="card-sleeve">${format_img(
        `${get_prefix()}images/minigame/sleeveL/`,
        "MngCardSleeve_" + value,
        96
    )}</div>`
}

export function card_name_formatter(value) {
    return localize("CommonMsg/MiniGame/MiniGameCardName", value)
}

export function card_rarity_formatter(value) {
    return localize("CommonMsg/MiniGame/MiniGame", "CardRarity" + value)
}

export function card_square_counter(value) {
    return value.filter(val => val !== "Empty").length
}

export function card_square_formatter(value) {
    const res = []
    for (let i = 0; i < value.length; i += 8) {
        for (let j = 7; j >= 0; j--) {
            res.push(`<div class="cardgame-slot" data-grid="${value[63 - (i + j)]}"></div>`)
        }
        res.push('<div class="break"></div>')
    }
    return `<div class="cardgame-grid">${res.join("")}</div>`
}

export function check_defined(value) {
    return value !== undefined && value !== "None" && value !== ""
}

export function card_reward_formatter(value) {
    if (value.RewardCardPack === true) {
        return `<center>${format_img(get_prefix() + "images/catalog/", "IconCardPack_00")}</center>`
    }
    if (check_defined(value.RewardChara)) {
        const name = value.RewardChara.replace("Work/Gyml/MiniGame_", "").replace(".spl__MiniGameGameNpcData.gyml", "")
        return `<center>${format_img(get_prefix() + "images/npc/", "IconNPC" + name, 96)}<br />Opponent</center>`

        // IconNPCMiniGameKurage1
    }
    if (check_defined(value.RewardMap)) {
        return `<center>${format_img(get_prefix() + "images/minigame/stage/", value.RewardMap)}<br />Map</center>`
    }
    if (check_defined(value.RewardBynameAdjective)) {
        return `<center>Title: <br />${byname_full_formatter([
            value.RewardBynameAdjective,
            value.RewardBynameSubject,
        ])}</center>`
    }
    if (check_defined(value.RewardNamePlateBG)) {
        const plate = value.RewardNamePlateBG.replace("Work/Gyml/NamePlateBgInfo/", "").replace(
            ".spl__NamePlateBgInfo.gyml",
            ""
        )
        return nameplate_formatter(plate)
    }
    if (check_defined(value.RewardLockerSticker)) {
        const item = value.RewardLockerSticker.replace("Work/Gyml/", "").replace(
            ".spl__LockerGoodsStickerInfo.gyml",
            ""
        )
        return `<center>${format_img(get_prefix() + "images/zakka/", item, 96)}<br />${locker_figure_name_formatter(
            item
        )}</center>`
    }
    if (check_defined(value.RewardLockerFigure)) {
        const item = value.RewardLockerFigure.replace("Work/Gyml/", "").replace(".spl__LockerGoodsFigureInfo.gyml", "")
        return `<center>${format_img(get_prefix() + "images/zakka/", item, 96)}<br />${locker_figure_name_formatter(
            item
        )}</center>`
    }
    if (check_defined(value.RewardSleeve)) {
        const item = value.RewardSleeve.replace("Work/Gyml/MiniGameCardSleeve", "MngCardSleeve").replace(
            ".spl__MiniGameCardSleeve.gyml",
            ""
        )
        return `<center>${format_img(get_prefix() + "images/minigame/sleeveL/", item, 96)}</center>`
    }
    if (check_defined(value.RewardEmote)) {
        const item = value.RewardEmote.replace("Work/Gyml/", "").replace(".spl__EmoteInfo.gyml", "")
        return `<center>${format_img(get_prefix() + "images/emote/", item, 96)}<br />Emote</center>`
    }
    console.log(value)
}

export const languages = [
    {
        ext: "USen",
        region: "NA",
        language: "en",
        name: "English",
    },
    {
        ext: "EUen",
        region: "EU",
        language: "en",
        name: "English (UK)",
    },
    {
        ext: "EUes",
        region: "EU",
        language: "es",
        name: "Español",
    },
    {
        ext: "USes",
        region: "NA",
        language: "es-MX",
        name: "Español (MX)",
    },
    {
        ext: "EUfr",
        region: "EU",
        language: "fr",
        name: "Français",
    },
    {
        ext: "USfr",
        region: "NA",
        language: "fr-CA",
        name: "Français (CA)",
    },
    {
        ext: "EUde",
        region: "EU",
        language: "de",
        name: "Deutsch",
    },
    {
        ext: "EUnl",
        region: "EU",
        language: "nl",
        name: "Nederlands",
    },
    {
        ext: "EUit",
        region: "EU",
        language: "it",
        name: "Italiano",
    },
    {
        ext: "EUru",
        region: "EU",
        language: "ru",
        name: "Pусский",
    },
    {
        ext: "JPja",
        region: "JP",
        language: "ja",
        name: "日本語",
    },
    {
        ext: "CNzh",
        region: "AP",
        language: "cn",
        name: "中文（简体）",
    },
    {
        ext: "KRko",
        region: "AP",
        language: "kr",
        name: "한국어",
    },
    {
        ext: "TWzh",
        region: "AP",
        language: "tw",
        name: "中文（繁體）",
    },
]

export function detectSplatoonLanguage() {
    let browserLanguages = window.navigator.languages.map(l => l.toLowerCase())
    let availableLanguages = languages.map(l => l.language.toLowerCase())
    let resultLanguages = {}
    for (const lang of Object.values(languages)) {
        resultLanguages[lang["language"]] = lang["ext"]
    }

    // Try to find a match based on the first part of the available languages (i.e., match "es" for "es-ES")
    for (let language of browserLanguages) {
        for (let availableLanguage of availableLanguages) {
            if (language.startsWith(availableLanguage)) {
                return resultLanguages[availableLanguage]
            }
        }
    }
}

export function convert_to_dict(elem, key) {
    const all_elems = {}
    elem.forEach(entry => {
        all_elems[entry[key]] = entry
    })
    return all_elems
}

export function add_to_dict(elem, key) {
    elem.forEach(entry => {
        entry[key] = { ...entry }
    })
}

export function skill_full_formatter(value) {
    if (value === "None") return "-"
    const tmp = format_img(`${get_prefix()}images/skill/`, value, 96)
    return `<center><p>${tmp}<br />${localize("CommonMsg/Gear/GearPowerName", value)}</p></center>`
}

export function brand_full_formatter(value) {
    const tmp = format_img(`${get_prefix()}images/brand/`, value, 64)
    return `<center><p>${tmp}<br />${localize("CommonMsg/Gear/GearBrandName", value)}</p></center>`
}

export function skill_array_formatter(value) {
    const res = []
    value.forEach(v => res.push(format_img(`${get_prefix()}images/skill/`, v, 48)))
    return res.join(" ")
}

export const percent_formatter = value => value + "%"
