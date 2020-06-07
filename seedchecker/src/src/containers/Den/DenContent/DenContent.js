import React, { Fragment } from "react";
import classes from "./DenContent.module.css";
import nests from "./Nests";
import locationNames from "../../../Assets/Strings/LocationNames";
import nestContent from "./NestContent";

const denContent = props => {
    let nestDropdown = null;
    if (props.active === 0) {
        nestDropdown = (
            <Fragment>
                <p>This selection is based on the game internal den representation. This is different from manual created lists, i.e. as you can find them on Serebii and Pokedens. Use "Nest" for Serebii notation.</p>
                <p><strong>Den:</strong></p>
                <select className={classes.Select} onChange={props.denchange} value={props.currentDen} >
                    {
                        nests.map((el, idx) => {
                            return idx === 16 ? null : <option key={"den_"+idx} value={idx}>{(idx + 1) + ": " + locationNames[el[2]]}</option>;
                        })
                    }
                </select>
                <p><strong>Rarity:</strong></p>
                <select className={classes.Select} value={props.currentRarity} onChange={props.raritychange}>
                    <option value="0" defaultValue>Normal</option>
                    <option value="1">Rare</option>
                </select>
            </Fragment>);
    } else if (props.active === 1) {
        nestDropdown = (
            <Fragment>
                <p>This selection is based on the game internal nest representation. Also known as "Serebii Notation".</p>
                <p><strong>Nest:</strong></p>
                <select className={classes.Select} onChange={props.nestchange} value={props.currentNest} >
                    {
                        nestContent[0].map((_, idx) => {
                            return <option key={"nest_"+idx} value={idx}>Nest {(idx + 1)}</option>;
                        })
                    }
                </select>
            </Fragment>);
    } else if (props.active === 2) {
        nestDropdown = (
            <Fragment>
                <p>This selection is for event/promo nests.</p>
                <p><strong>Event:</strong></p>
                <select className={classes.Select} onChange={props.eventnestchange} value={props.currentEventNest}>
                    {
                        props.eventData.map((evt, idx) => {
                            const tmp = evt.substring(0, evt.length - 5);
                            return <option key={evt} value={idx}>{tmp.substring(0, 2) + "-" + tmp.substring(2, 4) + "-" + tmp.substring(4)}</option>;
                        })
                    }
                </select>
            </Fragment>);
    }

    return (
        <div className={classes.DenContent}>
            {nestDropdown}
            <p><strong>Game:</strong></p>
            <select className={classes.Select} value={props.currentGame} onChange={props.gamechange}>
                <option value="0" defaultValue>Sword</option>
                <option value="1">Shield</option>
            </select>
            <p><strong>Pokémon:</strong></p>
            <select className={classes.Select} value={props.currentSelectedPokemon} onChange={props.pokemonChange}>
                {props.currentPkmn}
            </select>
        </div>
    );
}

export default denContent;