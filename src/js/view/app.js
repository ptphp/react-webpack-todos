/*
* @Author: dmyang
* @Date:   2015-07-31 13:47:50
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-01 00:22:07
*/

'use strict';

import React from 'react';

import Input from './input';
import ListView from './listview';
import Stats from './stats';

var undos = 0;
var filterTodos = function(todos, flag) {
    var keys = flag < 0 ? Object.keys(todos) : (flag ? dones : undos);

    keys = Object.keys(todos).sort((a, b) => {
        return b - a;
    });

    return keys.map((key) => {
        return todos[key];
    });
};

let App = React.createClass({
    getInitialState() {
        return {
            todos: {},
            filter: -1
        };
    },

    componentDidMount() {
        this.fetch();
    },

    render() {
        let state = this.state;
        let filter = state.filter;
        let todos = state.todos;
        // let idList = state.idList.sort((a, b) {return b - a;});
        // let list = filterAndSortTodos(filter);
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

    fetch() {
        var self = this;

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
        console.log(id, key, value)

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
