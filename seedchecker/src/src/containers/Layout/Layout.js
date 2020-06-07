import React, { Fragment, Component } from "react";
import classes from "./Layout.module.css";

class Layout extends Component {
    render() {
        return (
            <Fragment>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
}

export default Layout;