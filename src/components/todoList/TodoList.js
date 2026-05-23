import DB from "../../DB";
import Todo from "../todo/Todo";
import getTemplate from "./template";
//Contient les objets de type Todo
export default class TodoList {
  constructor(data) {
    this.domElt= document.querySelector(data.el);
    this.listDomElt = null;
    DB.setApiURL(data.apiURL);
    this.todos = [];
    this.loadTodos();
    }
  async loadTodos () {
    const todos = await DB.findAll();
    this.todos = todos.map(todo => new Todo(todo));
    this.render();
  }

  getItemsLeftCount() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  renderItemsLeftCount() {
    this.domElt.querySelector(".todo-count strong").innerText =
    this.getItemsLeftCount();
  }
  render () {
    this.domElt.innerHTML = getTemplate();
    this.listDomElt = this.domElt.querySelector(".todo-list");
    this.todos.forEach((todo) => 
      todo.render(this.listDomElt));
    this.renderItemsLeftCount();
    this.initEvents();
  }
  //Ajouter un élément dans la liste
  async addTodo(data) {
    //Ajout dans la DB
    const todo= await DB.create(data);
    //Ajouter à this.todos
    const newTodo = new Todo(todo);
    this.todos.push(newTodo);
    //Ajouter dans le DOM
    newTodo.render(this.listDomElt);
    //Relancer le Compteur
    this.renderItemsLeftCount();
  }

  initEvents () {
    this.domElt.querySelector('.new-todo').addEventListener("change", (e) => {
      this.addTodo(e.target.value);
      e.target.value = "";
    });
  }
}