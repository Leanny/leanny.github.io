import { createElement, qs } from "./util.js"

const loadData = url => {
    const tbody = qs(".weapon-body")
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }
    $.get({
        url: url,
        success: data => {
            data.forEach((weapon, i) => {
                const row = createElement("tr", { class: `row${i % 2}` })
                const rowData = ({
                    Id: weapon["Id"],
                    NameClean: weapon["Name"],
                    InternalName: weapon["Name"],
                    Name: weapon["Name"],
                    Price: weapon["Price"],
                    Sub: [weapon["Sub"], weapon["Sub"]],
                    Special: [weapon["Special"], weapon["Special"]],
                    Rank: weapon["Rank"],
                    SpecialCost: weapon["SpecialCost"],
                    Price: weapon["Price"],
                    Range: weapon["Range"],
                    StealthMoveAccLv: weapon["StealthMoveAccLv"],
                    MainUpGearPowerType: [weapon["MainUpGearPowerType"], "MPU_" + weapon["MainUpGearPowerType"]],
                    InkSaverLv: weapon["InkSaverLv"],
                    MoveVelLv: weapon["MoveVelLv"]
                })
                
                tbody.appendChild(row)
            })
        },
    })
}

$(document).ready(function () {
    loadData("https://raw.githubusercontent.com/Leanny/leanny.github.io/master/data/Mush/latest/WeaponInfo_Main.json")
})
