/*jshint browser: true, devel: true*/
/* global m, APP */

APP.todo = (function () {
	var todo = {};

	// The Todo class has two properties.
	todo.Todo = function (data) {
		this.description = m.prop(data.description);
		this.done = m.prop(false);
	};

	// The TodoList class is a list of Todo's.
	todo.TodoList = Array;

	return todo;
}());


// DEFINE THE VIEW-MODEL
(function (doc, todo) {
    todo.vm = {
        init: function () {
            // A running list of todos.
            todo.vm.list = new todo.TodoList();

            // A slot to store the name of a new todo before it is created.
            todo.vm.description = m.prop('Write some wicked code');

            /**
             * Adds a todo to the list, and clears the description field for user convenience.
             */
            todo.vm.add = function () {
                if (todo.vm.description()) {
                    todo.vm.list.push(new todo.Todo({
                        description: todo.vm.description()
                    }));

                    todo.vm.description('');
                }
            };

            /**
             * Removes a todo from the list, based on index.
             * @param {number} index The index of the todo item in list.
             */
            todo.vm.remove = function (index) {
                todo.vm.list.splice(index, 1);
            };
        }
    };


    // DEFINE THE CONTROLLER
    todo.controller = function () {
        todo.vm.init();
    };


    // DEFINE THE VIEW
    todo.view = function () {
        return m('div', [
            m('input.searchbox[type="text"]', {
                onchange: m.withAttr('value', todo.vm.description),
                value: todo.vm.description()
            }),
            m('button.button]', {onclick: todo.vm.add}, 'Add'),
            m('table', [
                todo.vm.list.map(function (task, idx) {
                    return m('tr', [
                        m('td', [
                            m('input.checkbox[type="checkbox"]#check-' + idx, {
                                onclick: m.withAttr('checked', task.done),
                                checked: task.done()
                            }),
                            m('label.desc-label[for="check-' + idx + '"]', {
                                style: {
                                    textDecoration: task.done() ? 'line-through' : 'none',
                                color: task.done() ? '#d45252' : '#333',
                                }
                            }, task.description()),
                            m('button.remove-btn', {
                                onclick: todo.vm.remove.bind(this, idx)
                            }, m.trust('&times;'))
                        ])
                    ]);
                })
            ])
        ]);
    };


    // INITIALIZE
    // Render to #ui-view.
    m.module(doc.getElementById('ui-view'), {
        controller: todo.controller,
        view: todo.view
    });
}(document, APP.todo));














