import React, { Component } from "react";
import Input from "./Input/Input";
import classes from "./Controls.module.css";

class Controls extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentNumberOfFrames !== this.props.currentNumberOfFrames ||
        nextProps.currentStartFrame !== this.props.currentStartFrame ||
        nextProps.currentSeed !== this.props.currentSeed;
    }

    render() {
        return (
        <div className={classes.Wrapper}>
            <Input title="Seed" changed={this.props.seedValidator} val={this.props.currentSeed}/>
            <Input title="Start Frame" val={this.props.currentStartFrame} changed={this.props.startValidator} />
            <Input title="Number of Frames" val={this.props.currentNumberOfFrames} changed={this.props.numberValidator} />
            <div>
                <button className={classes.Button} onClick={this.props.calculateResults}>Display Results</button>
                <button className={classes.Button} onClick={this.props.filter}>Filter Results</button>
                <button className={classes.Button} onClick={this.props.search}>Start Search</button>
            </div>
        </div>);
    }
}

export default Controls;