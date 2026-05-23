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
      this.listDomElt.append(todo.render()));
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
    this.listDomElt.append(newTodo.render());
    //Relancer le Compteur
    this.renderItemsLeftCount();
  }

  async deleteOneById(id) {
    //Supprimer de le DB
    const resp = await DB.deleteOneById(id);
    //Supprimer des todos
    this.todos.splice(this.todos.findIndex((todo) => (todo.id == id)), 1);
    //Supprimer du DOM
    this.domElt.querySelector(`[data-id = '${id}']`).remove();
    //Relancer le compteur
    this.renderItemsLeftCount();
  }

  initEvents () {
    this.domElt.querySelector('.new-todo').addEventListener("change", (e) => {
      this.addTodo(e.target.value);
      e.target.value = "";
    });
  }
}