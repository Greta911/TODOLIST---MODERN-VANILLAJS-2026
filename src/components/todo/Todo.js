//Objets de type Todo
import DB from "../../DB";
import getTemplate from "./template";

export default class Todo {
  constructor (data) {
    this.id = data.id;
    this.content = data.content;
    this.completed = data.completed;
    this.createdAt = data.createdAt;
    this.domElt = null;
  }
  render (el) {
    const template = document.createElement('template');
    template.innerHTML = getTemplate(this);
    this.domElt = template.content.firstElementChild;
    this.initEvents();
    el.append(this.domElt);
  }

  //Modifier un élément
  async toggleCompleted() {
    //Modifier dans le tableau
    this.completed = !this.completed;
    //Changer dan le DOM
    this.domElt.classList.toggle('completed');
    window.TodoList.renderItemsLeftCount();
    //Changer dans la DB
    return await DB.updateOne(this);
  }

  async update(data) {
    this.content = data;
    this.domElt.querySelector('label').innerText = this.content;
    this.domElt.classList.remove("editing");
    return await DB.updateOne(this);
  }

  initEvents() {
    this.domElt.querySelector('.toggle').addEventListener('change', (e) => {
      this.toggleCompleted();
    });

    this.domElt.querySelector('.destroy').addEventListener('click', (e) => {
      window.TodoList.deleteOneById(this.id);
    });

    this.domElt.querySelector('label').addEventListener('dblclick', (e) => {
      this.domElt.classList.add("editing");
    });

    this.domElt.querySelector('.edit').addEventListener('change', (e) => {
      this.update(e.target.value);
    });
  }
}