import React from "react";
import classes from "./Tabs.module.css";
import Tab from "./Tab/Tab";

const TABS = ["Den", "Nest", "Event"];

const tabs = props => {
    return (
        <ul className={classes.Nav}>
            {
                TABS.map((v, idx) => {
                    return <Tab title={v} key={idx} clicked={props.clicked} active={props.active === idx} num={idx} />
                })
            }
        </ul>
    );
}

export default tabs;