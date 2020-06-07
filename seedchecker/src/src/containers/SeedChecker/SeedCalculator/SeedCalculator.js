import bigInt from "big-integer";
import Pokedex from "../../Den/DenContent/Pokedex";
import AbilityNames from "../../../Assets/Strings/Abilities";
import NatureNames from "../../../Assets/Strings/Natures";

const getPkmn = (pkmn, form) => {
    let base = Pokedex[pkmn];
    if(form <= 0) {
        return base;
    }
    if(base.FormStatsIndex <= 0) {
        return base;
    }
    if(form >= base.FormeCount) {
        return base;
    }
    return Pokedex[base.FormStatsIndex + form - 1];
}

const XC = new bigInt("82A2B175229D6A5B", 16);
const ToxtricityAmplifiedNatures = [0x03, 0x04, 0x02, 0x08, 0x09, 0x13, 0x16, 0x0B, 0x0D, 0x0E, 0x18];
const ToxtricityLowKeyNatures = [0x01, 0x05, 0x07, 0x0A, 0x0C, 0x0F, 0x10, 0x11, 0x12, 0x14, 0x15, 0x17];
const Gender = ["Male", "Female", "Genderless"];
const ShinyType = ["-", "☆", "◇"];
const MASK = bigInt("FFFFFFFFFFFFFFFF", 16)
const SMASK = bigInt("FFFFFFFF", 16)
let s0 = 0;
let s1 = 0;

function rotl(x, k) {
    var a = x.shiftLeft(k);
    a = a.and(MASK);
    var b = x.shiftRight(bigInt("64").minus(k));
    return a.or(b);
}

function next() {
    var res = s0.plus(s1);
    res = res.and(MASK);
    s1 = s0.xor(s1);
    s0 = rotl(s0, bigInt("24")).xor(s1).xor((s1.shiftLeft(bigInt("16"))).and(MASK));
    s1 = rotl(s1, bigInt("37"));
    return res;
}

function setSeed(x) {
    s0 = x;
    s1 = XC;
}

function nextInt(num, mask) {
    var s = next().and(mask);
    while (s.compare(num) >= 0) {
        s = next().and(mask);
    }
    return Number(s);
}

function GetShinyXor(n) {
    return (n >>> 16) ^ (n & 0xFFFF);
}

function GetShinyType(pid, tidsid) {
    var p = GetShinyXor(pid);
    var t = GetShinyXor(tidsid);
    if (p === t) {
        return 2; // square;
    }
    if ((p ^ t) < 0x10) {
        return 1; // star
    }
    return 0;
} 

function getData(seed, pkmn, pkmnData, idx) {
    setSeed(seed);
    var ec = nextInt(SMASK, SMASK);
    var sidtid = nextInt(SMASK, SMASK);
    var pid = nextInt(SMASK, SMASK);
    var shiny = GetShinyType(pid, sidtid);

    if ("ShinyForced" in pkmn && pkmn.ShinyForced === 2) {
        shiny = 2;
    }

    var iv = [-1, -1, -1, -1, -1, -1];
    var i = 0;

    while (i < pkmn.FlawlessIVs) {
        var s = nextInt(bigInt("6"), bigInt("7"));
        if (iv[s] === -1) {
            i += 1;
            iv[s] = 31;
        }
    }

    for (i = 0; i < 6; i++) {
        if (iv[i] === -1) {
            iv[i] = nextInt(bigInt("32"), bigInt("31"));
        }
    }

    var ability = 0;
    var suffix = ["1", "2", "H"];
    var abilities = pkmnData.Abilities.map(
        (num, i) => AbilityNames[num] + " (" + suffix[i] + ")"
    );

    if (pkmn.Ability < 3) {
        ability = pkmn.Ability;
    } else {
        if (pkmn.Ability === 3) {
            ability = nextInt(bigInt("2"), bigInt("1"));
        } else {
            ability = nextInt(bigInt("3"), bigInt("3"));
        }
    }

    var gt = pkmnData.Gender;
    var gender = 0;
    if (gt === 255) {
        gender = 2
    } else if (gt === 254) {
        gender = 1;
    } else if (gt === 0) {
        gender = 0;
    } else {
        gender = nextInt(bigInt("253"), bigInt("255")) + 1 < gt ? 1 : 0;
    }

    var nature;
    if (pkmn.Species === 849) {
        if (pkmn.AltForm === 0) {
            nature = ToxtricityAmplifiedNatures[nextInt(bigInt(ToxtricityAmplifiedNatures.length), bigInt("31"))]
        } else {
            nature = ToxtricityLowKeyNatures[nextInt(bigInt(ToxtricityLowKeyNatures.length), bigInt("31"))]
        }
    } else {
        nature = nextInt(bigInt("25"), bigInt("31"));
    }
    var res = {
        "EC": ec.toString(16),
        "PID": pid.toString(16),
        "Shiny": ShinyType[shiny],
        "Date": new Date(Date.now() + 1000 * 3600 * 24 * idx).toISOString().split("T")[0],
        "HP": iv[0],
        "ATK": iv[1],
        "DEF": iv[2],
        "SPA": iv[3],
        "SPD": iv[4],
        "SPE": iv[5],
        "Nature": NatureNames[nature],
        "Gender": Gender[gender],
        "Ability": abilities[ability],
        "Seed": seed.toString(16),
        "Idx": idx,
        "NatureIdx": nature,
        "GenderIdx": gender,
        "AbilityIdx": ability,
        "ShinyIdx": shiny
    }
    return res
}

function advanceFrame(seed, frame) {
    seed = (XC.multiply(frame)).plus(seed);
    seed = seed.and(MASK);
    return seed;
}

const res = (seed, startFrame, numOfFrames, pkmn, filter) => {
    let startSeed = bigInt(seed.substring(2), 16);
    startSeed = advanceFrame(startSeed, startFrame);
    let res = [];
    const pkmnData = getPkmn(pkmn.Species, pkmn.AltForm);
    var counter;
    if(filter) {
        for(counter = startFrame;; counter++) {
            var data = getData(startSeed, pkmn, pkmnData, counter);
            if(filter(data)) {
                res.push(data);
                break;
            }
            startSeed = startSeed.plus(XC);
            startSeed = startSeed.and(MASK);
        }
    } else {
        for(counter = startFrame; counter < startFrame + numOfFrames; counter++) {
            res.push(getData(startSeed, pkmn, pkmnData, counter));
            startSeed = startSeed.plus(XC);
            startSeed = startSeed.and(MASK);
        }
    }
    return res;
}

export default res;
