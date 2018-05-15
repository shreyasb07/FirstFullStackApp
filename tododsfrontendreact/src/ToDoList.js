import React, {Component} from 'react';
import ToDoItem from './ToDoItem';
import ToDoForm from './ToDoForm';
const APIURL = '/api/todos/';

class ToDoList extends Component{
	constructor(props){
    super(props);
    this.state = {
      todos: []
    }
    this.addToDos = this.addToDos.bind(this);
  }

  componentWillMount(){
    this.loadToDos();
  }

  loadToDos(){
    fetch(APIURL)
    .then(resp => {
      if (!resp.ok){
        if(resp.status >= 400 && resp.status <500){
          return resp.json().then (data => {
            let err = {errorMessage: data.message};
            throw err;
          })
      }else{
        let err = {errorMessage: 'Please try again later, server not responding!'};
        throw err;
      }
    }
      return resp.json();
    }) 
    .then(todos => this.setState({todos}));
  }

  addToDos(val){
  	fetch(APIURL, {
  		method: 'POST',
  		headers: new Headers({
  			'Content-Type': 'application/json',
  		}),
  		body: JSON.stringify({name: val})
  	})
    .then(resp => {
      if (!resp.ok){
        if(resp.status >= 400 && resp.status <500){
          return resp.json().then (data => {
            let err = {errorMessage: data.message};
            throw err;
          })
      }else{
        let err = {errorMessage: 'Please try again later, server not responding!'};
        throw err;
      }
    }
      return resp.json();
    }) 
    .then(newToDo => {
    	this.setState({todos:[...this.state.todos, newToDo]
    	});
    })
  }

  deleteToDos(id){
  	const deleteURL = APIURL + id;

  	fetch(deleteURL, {
  		method: 'DELETE',
   	})
    .then(resp => 
    {
      if (!resp.ok)
      {
        if(resp.status >= 400 && resp.status <500)
        {
          return resp.json().then (data => 
          {
            let err = {errorMessage: data.message};
            throw err;
          })
     	}else
     	{
	        let err = {errorMessage: 'Please try again later, server not responding!'};
	        throw err;
    	}
    }
      return resp.json();
    }) 
    .then(() => {
    	const todos = this.state.todos.filter(todo => todo._id !== id);
    	this.setState({todos:todos});
    	});
    }

  toggleToDos(todo){
  	const updateURL = APIURL + todo._id;

  	fetch(updateURL, {
  		method: 'PUT',
  		headers: new Headers({
  			'Content-Type': 'application/json',
  		}),
  		body: JSON.stringify({completed: !todo.completed})
   	})
    .then(resp => 
    {
      if (!resp.ok)
      {
        if(resp.status >= 400 && resp.status <500)
        {
          return resp.json().then (data => 
          {
            let err = {errorMessage: data.message};
            throw err;
          })
     	}else
     	{
	        let err = {errorMessage: 'Please try again later, server not responding!'};
	        throw err;
    	}
    }
      return resp.json();
    }) 
    .then(updatedToDo => {
    	const todos = this.state.todos.map(t =>
    		(t._id === updatedToDo._id)
    		? {...t, completed: !t.completed}
    		:t
    		)
    	this.setState({todos:todos});
    	});

  }




	render(){
		const todos = this.state.todos.map((t) => (
			<ToDoItem
				key = {t._id}
				{...t}
				onDelete = {this.deleteToDos.bind(this, t._id)}
				onToggle = {this.toggleToDos.bind(this,t)}
			 />
			));
		return(
			<div>
			<h1>ToDo List!</h1>
			<ToDoForm addToDos = {this.addToDos}/>
			<ul>
			{todos}
			</ul>
			</div>
		)
	}
}

export default ToDoList;