import React from "react";
import classes from "./Info.module.css";

const info = props => {
    return <div className={classes.Wrapper}>
        <p>This webpage was created by Lean. If you have any questions, bugreports, or similar, feel free to contact me. You can find me on <a href="https://twitter.com/LeanYoshi">Twitter</a> or Discord (Lean#3146). You can find the old version of this tool <a href="https://leanny.github.io/seedchecker/index_old.html">here</a>.</p>
        <p>If you like my work, feel free to help me out by donating via <a href="https://paypal.me/cflean">Paypal</a>.</p>
        <p>Please note that "Start Search" will search until it finds a Pokémon that fits the filter criterias starting from "Start Frame". This can take a long while, in this case just wait or cancel the search by reloading the page.</p>
    </div>
}

export default info;