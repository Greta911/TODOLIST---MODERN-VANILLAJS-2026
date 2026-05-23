//Model de la base de données ou API
import './styles.css';
import TodoList from "./components/todoList/TodoList";


//Instancier un nouveau model Todolist
new TodoList({
  el: "#app",
  apiURL: "https://6a118ab73e35d0f37ee3650e.mockapi.io/"
});