import React, { Fragment, Component } from "react";
import classes from "./Filter.module.css";
import AbilityNames from "../../Assets/Strings/Abilities";
import natures from "../../Assets/Strings/Natures";
import Pokedex from "../Den/DenContent/Pokedex";

const STATS = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];
const ToxtricityAmplifiedNatures = [0x03, 0x04, 0x02, 0x08, 0x09, 0x13, 0x16, 0x0B, 0x0D, 0x0E, 0x18];
const ToxtricityLowKeyNatures = [0x01, 0x05, 0x07, 0x0A, 0x0C, 0x0F, 0x10, 0x11, 0x12, 0x14, 0x15, 0x17];
const Gender = ["Male", "Female", "Genderless"];

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

function compare(a, b) {
    return a.props.label > b.props.label ? 1 : b.props.label > a.props.label ? -1 : 0;
  }

class Filter extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentSelectedPokemon !== this.props.currentSelectedPokemon ||
        nextProps.open !== this.props.open ||
        nextProps.filteredIVs !== this.props.filteredIVs ||
        nextProps.nature !== this.props.nature ||
        nextProps.ability !== this.props.ability ||
        nextProps.gender !== this.props.gender ||
        nextProps.shiny !== this.props.shiny;
    }


    render() {
        const filterSign = this.props.open ? "-" : "+";
        let filterOptions = null;
        let natureList = null;
        let abilityList = null;
        let genderList = null;
        if (this.props.open && this.props.currentSelectedPokemon) {
            const pkmn = this.props.currentSelectedPokemon;
            let natureWorkList = natures;
            if (pkmn.Species === 849) {
                if (pkmn.AltForm === 0) {
                    natureWorkList = ToxtricityAmplifiedNatures.map(num => natures[num]);
                } else {
                    natureWorkList = ToxtricityLowKeyNatures.map(num => natures[num]);
                }
            }
            natureList = [<option key={"nany"} value="-1">Any</option>].concat((natureWorkList.map((n, i) => {
                return <option key={"n"+i} value={i} label={n}>{n}</option>
            }).sort(compare)));

            const pkmnData = getPkmn(pkmn.Species, pkmn.AltForm);
            const abilities = pkmnData.Abilities.map(num => AbilityNames[num]);
            if(pkmn.Ability < 3) {
                abilityList = <option key={"a"+pkmn.Ability} value={pkmn.Ability}>{abilities[pkmn.Ability]}</option>
            } else if(pkmn.Ability === 3) {
                if(pkmnData.Abilities[0] === pkmnData.Abilities[1]) {
                    abilityList = <option key="a-2" value="-2">{abilities[0]}</option>
                } else {
                    abilityList = <Fragment>
                            <option key="a-1" value="-1">Any</option>
                            <option key="a0" value="0">{abilities[0]}</option>
                            <option key="a1" value="1">{abilities[1]}</option>
                        </Fragment>
                }
            } else {
                if(pkmnData.Abilities[0] === pkmnData.Abilities[1] && pkmnData.Abilities[1] === pkmnData.Abilities[2]) {
                    abilityList = <option key="a-1" value="-1">{abilities[0]}</option>
                } else if(pkmnData.Abilities[0] === pkmnData.Abilities[1]) {
                    abilityList = <Fragment>
                        <option key="a-1" value="-1">Any</option>
                        <option key="a-2" value="-2">{abilities[0]}</option>
                        <option key="a2" value="2">{abilities[2]}</option>
                    </Fragment>
                } else {
                    abilityList = <Fragment>
                        <option key="a-1" value="-1">Any</option>
                        <option key="a-2" value="-2">Normal</option>
                        <option key="a0" value="0">{abilities[0]}</option>
                        <option key="a1" value="1">{abilities[1]}</option>
                        <option key="a2" value="2">{abilities[2]}</option>
                    </Fragment>
                }
            }

            if (pkmnData.Gender === 255) {
                genderList = <option key="2" value="2">{Gender[2]}</option>
            } else if (pkmnData.Gender === 254) {
                genderList = <option key="1" value="1">{Gender[1]}</option>
            } else if (pkmnData.Gender === 0) {
                genderList = <option key="0" value="0">{Gender[0]}</option>
            } else {
                genderList = <Fragment>
                    genderList = <option key="-1" value="-1">Any</option>
                    genderList = <option key="0" value="0">{Gender[0]}</option>
                    genderList = <option key="1" value="1">{Gender[1]}</option>
                </Fragment>
            }

            filterOptions = (
                <Fragment>
                <div className={classes.IVBox}>
                    <strong>IV Filter</strong>
                    {
                        STATS.map((val, idx) => {
                            return <div key={val+idx} className={classes.InputRow}>
                                <span className={classes.Title}>{val}</span>
                                <input type="number" max="31" min="0" className={classes.InputField} size="3" value={this.props.filteredIVs[idx][0]} onChange={e => this.props.minIV(e, idx)}/> <span className={classes.InBetween}>-</span> 
                                <input type="number" max="31" min="0" className={classes.InputField} size="3" value={this.props.filteredIVs[idx][1]} onChange={e => this.props.maxIV(e, idx)}/>
                                <button className={classes.Button} onClick={e => this.props.setMin(idx)}>0-1 IV</button>
                                <button className={classes.Button} onClick={e => this.props.setMax(idx)}>30-31 IV</button>
                                <button className={classes.Button} onClick={e => this.props.setDefault(idx)}>0-31 IV</button>
                            </div>
                        })
                    }
                </div>
                <div className={classes.OtherBox}>
                    <div className={classes.SelectElement}>
                        <span className={classes.OtherTitle}>Nature</span>
                        <select className={classes.Select} value={this.props.nature} onChange={this.props.natureChange}>
                            {natureList}
                        </select>
                    </div>
                    <div className={classes.SelectElement}>
                        <span className={classes.OtherTitle}>Ability</span>
                        <select className={classes.Select}  value={this.props.ability} onChange={this.props.abilityChange}>
                            {abilityList}
                        </select>
                    </div>
                    <div className={classes.SelectElement}>
                        <span className={classes.OtherTitle}>Gender</span>
                        <select className={classes.Select}  value={this.props.gender} onChange={this.props.genderChange}>
                            {genderList}
                        </select>
                    </div>
                    <div className={classes.SelectElement}>
                        <span className={classes.OtherTitle}>Shinyness</span>
                        <select className={classes.Select}  value={this.props.shiny} onChange={this.props.shinyChange}>
                            <option value="-1">Any</option>
                            <option value="-2">Shiny</option>
                            <option value="0">None</option>
                            <option value="1">☆</option>
                            <option value="2">◇</option>
                        </select>
                    </div>
                </div>
                </Fragment>
            )
        }
        return <div className={classes.Wrapper}>
            <div className={classes.Box} onClick={this.props.openFilter}>{filterSign}</div><strong>Filter</strong>
            <div>
                {filterOptions}
            </div>
        </div>;
    };
}

export default Filter;