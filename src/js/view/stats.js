/*
* @Author: dmyang
* @Date:   2015-07-31 18:39:12
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-01 01:56:44
*/

'use strict';

import React from 'react';

let Stats = React.createClass({
    render() {
        let props = this.props;
        let filter = props.filter;

        return (
            <section className="stats">
                <div className="todo-count">
                    <strong>{props.left}</strong> left
                </div>
                <div className="filters" onClick={this.onSelect}>
                    <a className={filter === -1 ? 'selected' : ''} data-filter="-1">All</a>
                    <a className={filter === 1 ? 'selected' : ''} data-filter="1">Done</a>
                    <a className={filter === 0 ? 'selected' : ''} data-filter="0">Undo</a>
                </div>
                <a className="clean" href="javascript:void(0);" onClick={props.clean}>Clear completed</a>
            </section>
        );
    },

    onSelect(e) {
        var flag = e.target.getAttribute('data-filter');

        this.props.setFilter(flag - 0);
    }
});

function getClassName(value) {
    return this.props.filter === value ? 'selected' : '';
};

export default Stats;
