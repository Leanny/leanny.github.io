import React, { Fragment, Component } from "react";
import classes from "./Modal.module.css";
import Spinner from "../Spinner/Spinner";

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }
    
    render() {
        return (
            <Fragment>
                {this.props.children} 
                {this.props.show? <div className={classes.Modal} ><Spinner /></div> : null}
            </Fragment>
        );
    }
}

export default Modal;