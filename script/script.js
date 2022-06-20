'use strict';

void function () {

    const todoList = {
        selector: null,
        form: null,
        todoContainerSelector: null,
        todoContainer: null,

        loadFromStorage() {
            const todosArr = this.getTodo();

            todosArr.forEach(todoItem => {
                let todoItemHtml = this.createTodoItemTemplate(todoItem.title, todoItem.description, todoItem.id);
                this.todoContainer.append(todoItemHtml);
            })
        },

        init(formSelector, todoContainerSelector) {
            if (!this.isRightSelector(formSelector)) {
                console.warn('Provide a selector');
                return false;
            }

            if (!this.isRightSelector(todoContainerSelector)) {
                console.warn('Provide a selector');
                return false;
            }


            this.selector = formSelector;
            this.todoContainerSelector = todoContainerSelector;


            this.handleForm();
            this.handleTodosContainer();
            this.handleLoad();
        },

        handleLoad() {
            this.setEvents('DOMContentLoaded', document, this.loadFromStorage);
        },

        handleTodosContainer() {
            const todoContainer = document.querySelector(this.todoContainerSelector);
            if (!this.isHtmlElement(todoContainer)) throw new Error('not valid element');

            this.todoContainer = todoContainer;
        },

        formSubmitHandler() {
            const userData = {};
            this.form
                .querySelectorAll('input, textarea')
                .forEach(input => userData[input.name] = input.value);

            const savedData = this.saveUserData(userData);
            console.log(savedData);
            this.renderTodoItem(savedData);

            this.form.reset();

        },

        renderTodoItem(dataForRender) {
            const todoHtml = this.createTodoItemTemplate(dataForRender.title, dataForRender.description, dataForRender.id);
            console.log(todoHtml);
            this.todoContainer.append(todoHtml);
        },

        saveUserData(userData) {
            let userDataFromStorage = localStorage.getItem(this.selector);
            const localData = structuredClone(userData);


            if (!userDataFromStorage) {
                localData.id = 1;
                const userDataArray = [];
                userDataArray.push(localData);
                localStorage.setItem(this.selector, JSON.stringify(userDataArray));
            }

            if (userDataFromStorage) {
                userDataFromStorage = JSON.parse(userDataFromStorage);
                let lastTodoItemId = userDataFromStorage[userDataFromStorage.length - 1].id;
                localData.id = Number(lastTodoItemId) + 1;

                userDataFromStorage.push(localData);
                localStorage.setItem(this.selector, JSON.stringify(userDataFromStorage));
            }

            return localData;

        },

        handleForm() {
            const formElement = document.querySelector(this.selector);
            if (!this.isForm(formElement)) throw new Error('not valid element');
            this.form = formElement;

            this.setEvents('submit', this.form, this.formSubmitHandler);
        },

        setEvents(eventType, element, eventHandler) {
            element.addEventListener(eventType, event => {
                event.preventDefault();
                event.stopPropagation();
                eventHandler.call(this, event);
            }, {passive: false});

        },
        isRightSelector (selector) {
            if (typeof selector !== 'string') return false;
            if (selector.trim() === '') return false;

            return true;
        },
        isForm: element => element instanceof HTMLFormElement,
        isHtmlElement: element => element instanceof HTMLElement,
        createTodoItemTemplate(title, body, id) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('col-4');
            wrapper.setAttribute('data-todo-id', id);

            const template = `<div class="taskWrapper">
                <div class="taskHeading">${title}</div>
                <div class="taskDescription">${body}</div> 
             </div>`

            wrapper.innerHTML = template;
            return wrapper;
        },
        getTodo() {
            return JSON.parse(localStorage.getItem(this.selector));
        },


    }

    todoList.init('#todoForm', '#todoItems');
}()