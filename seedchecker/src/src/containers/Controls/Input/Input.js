import React from "react";
import classes from "./Input.module.css";

const input = props => {
    return (
    <div className={classes.Wrapper}>
        <span className={classes.Title}>{props.title}</span>
        <input className={classes.Input} value={props.val} onChange={props.changed} />
    </div>
    );
}

export default input;