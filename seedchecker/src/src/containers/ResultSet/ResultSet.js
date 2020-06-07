import React, { Component } from "react";
import classes from "./ResultSet.module.css";

const headlines = ["Frame Advances", "Shiny", "Date", "HP", "ATK", "DEF", "SPA", "SPD", "SPE", "Nature", "Ability", "Gender", "Seed", "EC", "PID"];
const fieldnames = ["Idx", "Shiny", "Date", "HP", "ATK", "DEF", "SPA", "SPD", "SPE", "Nature", "Ability", "Gender", "Seed", "EC", "PID"];

class ResultSet extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.results !== this.props.results;
    }

    render() {
        const header = headlines.map((v, idx) => <th key={idx} className={classes.TableHead}>{v}</th>);
        let body = <tr className={classes.ContentNotFound}><td colSpan={headlines.length}>No Results to display.</td></tr>
        if(this.props.results.length > 0) {
            body = this.props.results.map(
                (entry, idx) => {
                    return <tr key={idx} className={(idx&1)===0?classes.TDEven:classes.TDOdd}>
                        {fieldnames.map((v, i) => {
                            return <td key={idx+"."+i}>{this.props.results[idx][v]}</td>
                        })}
                    </tr>
                }
            )
        }
        return (
            <div className={classes.Wrapper}>
                <table className={classes.Table}>
                    <thead>
                        <tr>
                            {header}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResultSet;