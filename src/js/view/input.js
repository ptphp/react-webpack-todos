/*
* @Author: dmyang
* @Date:   2015-07-31 14:10:02
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 18:13:00
*/

'use strict';

import React from 'react';

/*export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <form className="input-form" onSubmit={this.submitHandler.bind(this)}>
                <input ref="content" placeholder="What needs to be done?" />
            </form>
        );
    }

    submitHandler(e) {
        e.preventDefault();
        console.log(this)

        var content = e.target['content'];

        if(content) this.props.addItem(content);
    }
}*/

let Input = React.createClass({
    render() {
        return (
            <form className="input-form" onSubmit={this.submitHandler}>
                <input ref="content" placeholder="What needs to be done?" />
            </form>
        );
    },

    submitHandler(e) {
        e.preventDefault();

        let node = this.refs.content.getDOMNode();
        let content = node.value;

        if(content) this.props.addItem(content);
        node.value = '';
    }
});

export default Input;
