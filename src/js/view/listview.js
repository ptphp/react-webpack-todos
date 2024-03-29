/*
* @Author: dmyang
* @Date:   2015-07-31 14:25:50
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-18 21:48:54
*/

'use strict';

import React from 'react';

let Raw = React.createClass({
    render() {
        let props = this.props;
        let status = props.status ? 'done' : 'undo';

        return (
            <li onDoubleClick={this.editContent} ref="todo" data-status={status}>
                <div className="view">
                    <span className="checkbox" onClick={this.toggle}></span>
                    <input readOnly className="content" value={props.content} />
                    <button onClick={this.destroy} className="destroy"></button>
                </div>
                <input className="edit" ref="editInput" onBlur={this.editBlur}
                    defaultValue={props.content} />
            </li>
        );
    },

    toggle(status) {
        let props = this.props;
        var status = this.refs.todo.getDOMNode().getAttribute('data-status');

        if(status === 'done') status = 0;
        else status = 1;

        props.updateItem && props.updateItem(props.id, 'status', status);
    },

    editContent(e) {
        let dom = this.refs.todo.getDOMNode();

        dom.classList.add('editing');

        let self = this;

        setTimeout(() => {
            React.findDOMNode(self.refs.editInput).focus();
        }, 0);

        // React.findDOMNode(this.refs.editInput).focus();
    },

    destroy(e) {
        let props = this.props;

        props.removeItem && props.removeItem(props.id);
    },

    editBlur(e) {
        let props = this.props;
        let val = e.target.value;

        // this.setState({editing: false});
        this.refs.todo.getDOMNode().classList.remove('editing');

        props.updateItem && props.updateItem(props.id, 'content', val);
    }
});

let ListView = React.createClass({
    render() {
        let raws = [];
        let props = this.props;
        let todos = props.todos;
        let filter = props.filter;
        let removeItem = props.removeItem;
        let updateItem = props.updateItem;

        Object.keys(todos).map((id) => {
            let item = todos[id];
            if(filter === -1 || item.status === filter) {
                raws.push(
                    <Raw
                    key={item.id}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    {...item}/>
                );
            }
        });

        return (
            <ul className="todo-list">{raws}</ul>
        );
    }
});

export default ListView;
