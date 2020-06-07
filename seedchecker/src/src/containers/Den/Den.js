import React, { Fragment, Component } from "react";
import Tabs from "./Tabs/Tabs";
import DenContent from "./DenContent/DenContent";


class Den extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.activeTab !== this.props.activeTab ||
        nextProps.currentSelectedPokemon !== this.props.currentSelectedPokemon ||
        nextProps.currentPkmn !== this.props.currentPkmn ||
        nextProps.eventData !== this.props.eventData ||
        nextProps.currentEventNest !== this.props.currentEventNest ||
        nextProps.currentDen !== this.props.currentDen ||
        nextProps.currentGame !== this.props.currentGame;
    }

    render () {
        return (<Fragment>
            <Tabs clicked={this.props.tabchange} active={this.props.activeTab} />
            <DenContent 
                active={this.props.activeTab} 
                denchange={this.props.denchange} 
                raritychange={this.props.raritychange}
                nestchange={this.props.nestchange}
                gamechange={this.props.gamechange}
                eventnestchange={this.props.eventnestchange}
                currentDen={this.props.currentDen} 
                currentRarity={this.props.currentRarity}
                currentNest={this.props.currentNest}
                currentGame={this.props.currentGame}
                currentEventNest={this.props.currentEventNest}
                eventData={this.props.eventData}
                currentPkmn={this.props.currentPkmn}
                currentSelectedPokemon={this.props.currentSelectedPokemon}
                pokemonChange={this.props.pokemonChange}
            />
        </Fragment>);
    }
}

export default Den;