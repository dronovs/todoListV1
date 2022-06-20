'use strict';

void function () {
    const todoList = {
        todoForm: document.querySelector('#todoForm'),
        inputsData: null,
        savedData: null,
        todosWrapper: document.querySelector('.col-8'),

        initialize() {
            document.addEventListener('DOMContentLoaded', () => {
                if (localStorage.getItem('todos')) {
                    const todoItems = document.querySelector('#todoItems');
                    let dataFromStorage = localStorage.getItem('todos');
                    dataFromStorage = JSON.parse(dataFromStorage);
                    dataFromStorage.forEach(item => {
                        const todoItem = document.createElement('div');
                        todoItem.classList.add('col-4');
                        todoItem.setAttribute('data-todo-id', 'id');
                        todoItem.innerHTML = `<div class="taskWrapper">
                                <div class="taskHeading">${item.title}</div>
                                <div class="taskDescription">${item.body}</div>
                            </div>`
                        todoItems.append(todoItem);
                    })
                }
            })

            this.todoForm.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();
                this.inputsDataSubmit();
                this.saveDataToStorage();
                this.renderTodo();
                this.todoForm.reset();
            });

            this.todosWrapper.addEventListener('click', event => {
                const taskWrapper = document.querySelector('.taskWrapper');
                const doneBtn = document.querySelector('.data-done');
                if (event.target === doneBtn) {
                    taskWrapper.classList.toggle('done');
                }
            })

        },

        renderTodo() {
            const todoList = document.querySelector('#todoItems');
            const todo = document.createElement('div');
            todo.classList.add('col-4');
            todo.setAttribute('data-todo-id', 'id');
            todo.innerHTML = `<div class="taskWrapper">
                                <div class="taskHeading">${this.inputsData.title}</div>
                                <div class="taskDescription">${this.inputsData.body}</div>
                            </div>`
            todoList.append(todo);
            return todo;
        },

        saveDataToStorage() {
            if (!localStorage.getItem('todos')) {
                let savedData = [];
                savedData.push(this.inputsData);
                savedData = JSON.stringify(savedData);
                localStorage.setItem('todos', savedData);
                this.savedData = localStorage.getItem('todos');
                return;
            }

            if (localStorage.getItem('todos')) {
                let savedData = localStorage.getItem('todos');
                savedData = JSON.parse(savedData);
                savedData.push(this.inputsData);
                savedData = JSON.stringify(savedData);
                localStorage.setItem('todos', savedData);
                this.savedData = localStorage.getItem('todos');
            }
        },

        validateInputsData() {
            let inputs = document.querySelectorAll('input, textarea');
            inputs = Array.from(inputs);
            let inputsValues = inputs.map(element => {
                if(!element.value) throw new Error('Enter your todo');
                return element.value;
            })

            return {
                title: inputsValues[0],
                body: inputsValues[1],
            };
        },

        inputsDataSubmit() {
            this.inputsData = this.validateInputsData();
        },

    }

    todoList.initialize();
}()