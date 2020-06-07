import React, { Component, Fragment } from "react";
import Den from "../Den/Den";
import Filter from "../Filter/Filter";
import Controls from "../Controls/Controls";
import ResultSet from "../ResultSet/ResultSet";
import nests from "../Den/DenContent/Nests";
import axios from "../../EventDownloader";
import nestContent from "../Den/DenContent/NestContent";
import pokemonNames from "../../Assets/Strings/Pokemon";
import seedCalculator from "./SeedCalculator/SeedCalculator";
import Modal from "../../components/UI/Modal/Modal";
import Info from "../../components/Info/Info";

class SeedChecker extends Component {
    state = {
        activeTab: 0,
        currentNest: 0,
        currentEventNest: 0,
        currentDen: 0,
        currentRarity: 0,
        currentGame: 0,
        eventData: [],
        currentSelectedPokemon: "",
        currentPokemonNest: [],
        eventError: false,
        currentPokemonList: [],
        currentEventData: ["", [], []],
        currentSeed: "0x0",
        currentStartFrame: 0,
        currentNumberOfFrames: 10,
        displayResults: [],
        toggleOpen: false,
        filteredIVs: [[0, 31], [0, 31], [0, 31], [0, 31], [0, 31], [0, 31]],
        filteredNature: -1,
        filteredAbility: -1,
        filteredGender: -1,
        filteredShiny: -1,
        backupResults: null,
        loading: true
    }

    componentDidMount() {
        this.calculateNest(this.state.currentNest, this.state.currentRarity);
        axios.get("/files.json").then(
            resp => {
                this.setState({eventData: resp.data, loading: false});
            }
        ).catch(error => {
            this.setState({eventError: true});
        });
    }

    // den related

    changeTabHandler = val => {
        this.setState({activeTab: val});
        if (val === 0) {
            this.calculateNest(this.state.currentDen, this.state.currentRarity);
        }
        if (val === 2) {
            this.updateNest(-this.state.currentEventNest-1, this.state.currentGame);
        }
    }

    denChangeHandler = event => {
        this.setState({currentDen: event.target.value});
        this.calculateNest(event.target.value, this.state.currentRarity);
    }

    rarityChangeHandler = event => {
        this.setState({currentRarity: event.target.value});
        this.calculateNest(this.state.currentDen, event.target.value);
    }

    nestChangeHandler = event => {
        const thisNest = event.target.value;
        this.setState({currentNest: thisNest});
        this.updateNest(thisNest, this.state.currentGame);
    }

    eventNestChangeHandler = event => {
        const thisNest = event.target.value;
        this.setState({currentEventNest: thisNest});
        this.updateNest(-thisNest-1, this.state.currentGame);
    }

    gameChangeHandler = event => {
        const game = parseInt(event.target.value)
        this.setState({currentGame: game});
        if (this.state.activeTab === 2) {
            this.updateNest(-this.state.currentEventNest-1, game);
        } else {
            this.updateNest(this.state.currentNest, game);
        }
    }

    calculateNest = (den, rarity) => {
        this.setState({currentNest: nests[den][rarity]-1});
        this.updateNest(nests[den][rarity]-1, this.state.currentGame);
    }

    generatePkmnString = nestData => {
        let ret = "";
        if (nestData.MinRank === nestData.MaxRank) {
            ret += (nestData.MinRank + 1);
        } else {
            ret += (nestData.MinRank + 1 ) + "-" + (nestData.MaxRank + 1);

        } 
        ret += String.fromCharCode(0x2605);
        ret += " " + pokemonNames[nestData.Species];
        if (nestData.IsGigantamax) {
            ret += " (G-Max)";
        }
        ret += "  (" + nestData.FlawlessIVs + " IV)";
        if (nestData.Ability === 0) {
            ret += " [Only Ability 1]";
        }
        if (nestData.Ability === 1) {
            ret += " [Only Ability 2]";
        }
        if (nestData.Ability === 2) {
            ret += " [Only HA]";
        }
        if (nestData.Ability === 3) {
            ret += " [No HA]";
        }
        return ret;
    }

    shrinkNest = nest => {
        const usedUp = new Set();
        return nest.reduce(((prev, cur) => {
            const tmp = cur.Species + "." + cur.MinRank + "." + cur.MaxRank + "." + cur.FlawlessIVs + "." + cur.Ability + "." + cur.AltForm + "." + cur.IsGigantamax;
            if(usedUp.has(tmp)) {
                return prev;
            } else {
                usedUp.add(tmp);
                return prev.concat(cur);
            }
        }), []);
    }

    generatePkmnDropdown = nest => {
        this.setState({currentSelectedPokemon: 0});
        return nest.map(
            (i, idx) => {
                return <option key={idx} value={idx}>{this.generatePkmnString(i)}</option>;
            });
    }

    updateNest = (thisNest, game) => {
        if(thisNest >= 0) {
            const nest = this.shrinkNest(nestContent[game][thisNest]["Entries"]);
            const pokemonDropdown = this.generatePkmnDropdown(nest);
            this.setState({currentPokemonList: pokemonDropdown, currentPokemonNest: nest});
        } else {
            const filename = this.state.eventData[-thisNest-1]
            if (filename !== this.state.currentEventData[0]) {
                this.setState({loading: true});
                axios.get(filename).then(
                    resp => {
                        const nest = this.shrinkNest(resp.data["Tables"][game]["Entries"]);
                        const pokemonDropdown = this.generatePkmnDropdown(nest);
                        this.setState({loading: false, currentEventData: [filename, resp.data["Tables"][0], resp.data["Tables"][1]], currentPokemonList: pokemonDropdown, currentPokemonNest: nest});
                    }
                ).catch(error => {
                    this.setState({eventError: true});
                });
            } else {
                const nest = this.shrinkNest(this.state.currentEventData[game + 1]["Entries"]);
                const pokemonDropdown = this.generatePkmnDropdown(nest);
                this.setState({currentPokemonList: pokemonDropdown, currentPokemonNest: nest});
            }
        }
    }

    pokemonChangeHandler = event => {
        if(this.state.currentPokemonNest.length > 0) {
            this.setState({currentSelectedPokemon: event.target.value, filteredAbility: -1, filteredGender: -1, filteredNature: -1, displayResults: [], backupResults: null});
        }
    }

    // control related

    checkSeedHandler = event => {
        let inputstr = event.target.value.toUpperCase();
        if (inputstr.substring(0, 2) === "0X") {
            inputstr = inputstr.substring(2);
        }
        inputstr = inputstr.substring(0, 16); // cut off too many characters
        inputstr = inputstr.replace(/[^0-9A-F]/g, "");
        while(inputstr.length > 0 && inputstr.substring(0, 1) === "0") {
            inputstr = inputstr.slice(1);
        }
        if (inputstr.length === 0) {
            inputstr = "0";
        }
        inputstr = "0x" + inputstr;
        this.setState({currentSeed: inputstr});
    }

    checkStartFrameHandler = event => {
        let inputstr = event.target.value;
        let negative = inputstr.substring(0, 1) === "-";
        inputstr = inputstr.replace(/[^0-9]/g, "");
        while(inputstr.length > 0 && inputstr.substring(0, 1) === "0") {
            inputstr = inputstr.slice(1);
        }
        if (inputstr.length === 0) {
            inputstr = "0";
        } else {
            if (negative) {
                inputstr = "-" + inputstr;
            }
        }
        inputstr = inputstr.substring(0, 10); // cut off too many characters
        this.setState({currentStartFrame: inputstr});
    }

    checkNumberOfFrameHandler = event => {
        let inputstr = event.target.value;
        inputstr = inputstr.replace(/[^0-9]/g, "");
        while(inputstr.length > 0 && inputstr.substring(0, 1) === "0") {
            inputstr = inputstr.slice(1);
        }
        if (inputstr.length === 0) {
            inputstr = "0";
        }
        inputstr = inputstr.substring(0, 5); // cut off too many characters
        this.setState({currentNumberOfFrames: inputstr});
    }

    calculateResultHandler = () => {
        this.setState({loading: false, backupResults: null, displayResults: seedCalculator(this.state.currentSeed, parseInt(this.state.currentStartFrame), parseInt(this.state.currentNumberOfFrames), this.state.currentPokemonNest[this.state.currentSelectedPokemon], null)});
    }

    searchHandler = () => {
        this.setState({loading: false, backupResults: null, displayResults: seedCalculator(this.state.currentSeed, parseInt(this.state.currentStartFrame), parseInt(this.state.currentNumberOfFrames), this.state.currentPokemonNest[this.state.currentSelectedPokemon], this.fullfilsConditions)});
        
    }

    fullfilsConditions = cur => {
        return cur.HP >= this.state.filteredIVs[0][0] &&
        cur.HP <= this.state.filteredIVs[0][1] &&
        cur.ATK >= this.state.filteredIVs[1][0] &&
        cur.ATK <= this.state.filteredIVs[1][1] &&
        cur.DEF >= this.state.filteredIVs[2][0] &&
        cur.DEF <= this.state.filteredIVs[2][1] &&
        cur.SPA >= this.state.filteredIVs[3][0] &&
        cur.SPA <= this.state.filteredIVs[3][1] &&
        cur.SPD >= this.state.filteredIVs[4][0] &&
        cur.SPD <= this.state.filteredIVs[4][1] &&
        cur.SPE >= this.state.filteredIVs[5][0] &&
        cur.SPE <= this.state.filteredIVs[5][1] &&
        (this.state.filteredNature === -1 || this.state.filteredNature === cur.NatureIdx) &&
        (this.state.filteredAbility === -1 || (this.state.filteredAbility === -2 && (cur.AbilityIdx < 2)) || this.state.filteredAbility === cur.AbilityIdx) &&
        (this.state.filteredGender === -1 || this.state.filteredGender === cur.GenderIdx) &&
        (this.state.filteredShiny === -1 || (this.state.filteredShiny === -2 && (cur.ShinyIdx > 0)) || this.state.filteredShiny === cur.ShinyIdx)
        ;
    }

    filterHandler = () => {
        let workset = null;
        if(!this.state.backupResults) {
            this.setState({backupResults: [...this.state.displayResults]});
            workset = this.state.displayResults;
        } else {
            // restore backup first 
            workset = this.state.backupResults;
        }
        this.setState({displayResults: workset.reduce((prev, cur) => {
            if(this.fullfilsConditions(cur)) {
                    prev.push(cur);
                }
            return prev;
        }, [])});
    }

    // filter related

    openFilterHandler = () => {
        this.setState({toggleOpen: !this.state.toggleOpen});
    }

    minIVHandler = (event, idx) => {
        const IVs = [...this.state.filteredIVs];
        IVs[idx][0] = event.target.value;
        const num = parseInt(IVs[idx][0])
        if(num >= 0 && num <= 31 && num <= parseInt(IVs[idx][1])) {
            this.setState({filteredIVs: IVs});
        }
    }

    maxIVHandler = (event, idx) => {
        const IVs = [...this.state.filteredIVs];
        IVs[idx][1] = event.target.value;
        const num = parseInt(IVs[idx][1])
        if(num >= 0 && num <= 31 && num >= parseInt(IVs[idx][0])) {
            this.setState({filteredIVs: IVs});
        }
    }

    setMinHandler = idx => {
        const IVs = [...this.state.filteredIVs];
        IVs[idx] = [0, 1];
        this.setState({filteredIVs: IVs});
    }

    setMaxHandler = idx => {
        const IVs = [...this.state.filteredIVs];
        IVs[idx] = [30, 31];
        this.setState({filteredIVs: IVs});
    }

    setDefaultHandler = idx => {
        const IVs = [...this.state.filteredIVs];
        IVs[idx] = [0, 31];
        this.setState({filteredIVs: IVs});
    }

    setNatureHandler = event => {
        this.setState({filteredNature: parseInt(event.target.value)});
    }

    setAbilityHandler = event => {
        this.setState({filteredAbility: parseInt(event.target.value)});
    }

    setGenderHandler = event => {
        this.setState({filteredGender: parseInt(event.target.value)});
    }

    setShinyHandler = event => {
        this.setState({filteredShiny: parseInt(event.target.value)});
    }



    render() {
        return (<Fragment>
            <Modal show={this.state.loading} />
            <h1>Pokémon Sword & Shield - Seed Checker</h1>
            <Info />
            <Den 
                activeTab={this.state.activeTab} 
                currentDen={this.state.currentDen} 
                currentGame={this.state.currentGame}
                currentNest={this.state.currentNest}
                currentRarity={this.state.currentRarity}
                currentEventNest={this.state.currentEventNest}
                currentPkmn={this.state.currentPokemonList}
                nestchange={this.nestChangeHandler}
                eventnestchange={this.eventNestChangeHandler}
                gamechange={this.gameChangeHandler}
                raritychange={this.rarityChangeHandler}
                denchange={this.denChangeHandler}
                tabchange={this.changeTabHandler}
                eventData={this.state.eventData}
                currentSelectedPokemon={this.state.currentSelectedPokemon}
                pokemonChange={this.pokemonChangeHandler}
            />
            <Filter
                open={this.state.toggleOpen}
                openFilter={this.openFilterHandler}
                filteredIVs={this.state.filteredIVs}
                minIV={this.minIVHandler}
                maxIV={this.maxIVHandler}
                setMin={this.setMinHandler}
                setMax={this.setMaxHandler}
                setDefault={this.setDefaultHandler}
                currentSelectedPokemon={this.state.currentPokemonNest[this.state.currentSelectedPokemon]}
                nature={this.state.filteredNature}
                ability={this.state.filteredAbility}
                gender={this.state.filteredGender}
                shiny={this.state.filteredShiny}
                natureChange={this.setNatureHandler}
                genderChange={this.setGenderHandler}
                shinyChange={this.setShinyHandler}
                abilityChange={this.setAbilityHandler}
            />
            <Controls
                seedValidator={this.checkSeedHandler}
                currentSeed={this.state.currentSeed}
                currentStartFrame={this.state.currentStartFrame}
                currentNumberOfFrames={this.state.currentNumberOfFrames}
                startValidator={this.checkStartFrameHandler}
                numberValidator={this.checkNumberOfFrameHandler}
                calculateResults={this.calculateResultHandler}
                filter={this.filterHandler}
                search={this.searchHandler}
            />
            <ResultSet 
                results={this.state.displayResults}
            />
        </Fragment>);
    }
}

export default SeedChecker;