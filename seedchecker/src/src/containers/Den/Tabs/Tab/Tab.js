import React from "react";
import classes from "./Tab.module.css";

const tab = props => {
    let cls = [classes.Tab, classes.Inactive];
    if (props.active) {
        cls = [classes.Tab, classes.Active];
    }

    return (
        <li className={cls.join(" ")}>
            <button onClick={props.clicked.bind(props.clicked, props.num)}>{props.title}</button>
        </li>
    );
}

export default tab; 