/*
* @Author: dmyang
* @Date:   2015-07-31 13:47:50
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-18 21:46:52
*/

'use strict';

import React from 'react';

import Input from './input';
import ListView from './listview';
import Stats from './stats';

let undos = 0;

let App = React.createClass({
    getInitialState() {
        return {
            todos: {},
            filter: -1
        };
    },

    componentWillMount() {
        this.fetch();
    },

    fetch() {
        let self = this;

        if(!('fetch' in window)) require('whatwg-fetch');

        fetch('/api/list')
            .then((response) => response.text())
            .then((response) => {
                let list = response ? JSON.parse(response) : [];
                let todos = {};

                list.forEach(function(item) {
                    if(item.status === 0) ++undos;
                    todos[item.id] = item;
                });

                self.setState({todos: todos});
            })
            .catch(function(err) {
                console.error(err);
            });
    },

    render() {
        let state = this.state;
        let filter = state.filter;
        let todos = state.todos;
        let left = undos;

        if(!Object.keys(todos).length) return null;

        return (
            <div className="app">
                <h1>Todo list(React)</h1>
                <section className="main">
                    <Input addItem={this.addItem} />
                    <ListView todos={todos}
                        filter={filter}
                        removeItem={this.removeItem}
                        updateItem={this.updateItem} />
                    <Stats left={left}
                        filter={filter}
                        setFilter={this.setFilter}
                        clean={this.cleanDones} />
                </section>
                <footer>
                    <a href="https://github.com/webpack/webpack" target="_blank" className="logo-webpack"></a>
                    <a href="http://facebook.github.io/react/index.html" target="_blank" className="logo-react"></a>
                </footer>
            </div>
        );
    },

    addItem(content) {
        let todos = this.state.todos;
        let id = Date.now();

        todos[id] = {
            id: id,
            content: content,
            status: 0
        };
        ++undos;

        this.setState({todos: todos});
    },

    updateItem(id, key, value) {
        let todos = this.state.todos;

        if(!(id in todos)) return;

        if('status' === key) {
            if(value === 1) --undos;
            if(value === 0) ++undos;
        };

        todos[id][key] = value;
        this.setState({todos: todos});
    },

    removeItem(id) {
        let todos = this.state.todos;

        if(!(id in todos)) return;

        let status = todos[id].status;

        if(delete todos[id]) {
            if(status === 0) --undos;
            this.setState({todos: todos});
        }
    },

    setFilter(flag) {
        this.setState({filter: flag});
    },

    cleanDones() {
        let todos = this.state.todos;
        let self = this;

        Object.keys(todos).map((id) => {
            let item = todos[id];
            if(item.status === 1) self.removeItem(item.id);
        });
    }
});

export default App;
