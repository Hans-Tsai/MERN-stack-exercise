# MERN-stack-exercise
This is a practice for MERN full stack. I'll create a to-do exercise tracker website using the MERN stack.


### Introduction
- The `MERN` stack consists of `MongoDB`, `Express`, `React/Redux`, and `Node.js`. The MERN stack is one of the most popular JavaScript stacks for building modern single-page web applications.
- In this tutorial, you will build a todo application that uses a **RESTful API**, which you will also build later in this tutorial.


### Prerequisites
- Install `node`
- Execute $ `npm init` to create a package.json file


### Node Server Setup
- To run our javascript code on the backend we need to spin up a server that will compile our code. The server can be created in two ways: first is to use the built in http module in node; second is to make use of the expressjs framework.
- Execute $ `npm install express`
  + [Express.js](https://expressjs.com/) is a nodejs HTTP framework that handles a lot of things out of the box and requires very little code to create fully functional RESTful APIs.
- Execute $ `npm install dotenv`
  + [dotenv.js](https://www.npmjs.com/package/dotenv) allows you to load environment variables from a `.env` file into `process.env`.
- Create a file `index.js` as a Node.js server's entry point.
- This snipped from the code above helps handle CORS related issues that you might face when trying to access the api from different domains during development and testing.
  + ```javascript 
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    ```
- It’s time to start our server to see if it works. If every thing goes well, you should see **Server running on port 5000** in your terminal.
  + Execute $ `node index.js`


### Routes
- There are three things that the app needs to do. For each task, we need to create routes that will define various endpoints that the todo app will depend on.
  + create a task
  + view all tasks
  + delete a completed task.
- Create a folder `routes/`
  + $ `mkdir routes/`
  + $ `cd routes/`
  + then create an file `api.js`
- Reference to Express.js's Router object
  + [express.Router([options])](https://expressjs.com/en/5x/api.html#express.router)
  + [Express Router object](https://expressjs.com/en/5x/api.html#router)


### Models
- Use [MongoDB](https://www.mongodb.com/) to create a model and a schema.
  + Models are defined using the Schema interface.
  + The Schema allows you to define the fields stored in each document along with their validation requirements and default values.
    + In essence the Schema is a blueprint of how the database will be constructed. In addition, you can define static and instance helper methods to make it easier to work with your data types, and also virtual properties that you can use like any other field, but which aren’t actually stored in the database.
- Use [Mongoose.js](https://mongoosejs.com/) to create Schema and a model easier.
  + $ `npm install mongoose`
- Create a new folder in your root directory and name it `models/`.
  + $ `mkdir models/`
- Inside it create a file and name it `todo.js`.
  + $ `cd models/`
  + $ `touch todo.js`
  + Edit `todo.js`
  + ```javascript
      const mongoose = require('mongoose');
      const Schema = mongoose.Schema;

      //create schema for todo
      const TodoSchema = new Schema({
        action: {
          type: String,
          required: [true, 'The todo text field is required']
        }
      })

      //create model for todo
      const Todo = mongoose.model('todo', TodoSchema);

      module.exports = Todo;
    ```
- After that, we need to update our routes to make use of the new model.
  + Edit `../routes/api.js`
  + ```javascript
      const express = require ('express');
      const router = express.Router();
      const Todo = require('../models/todo');

      router.get('/todos', (req, res, next) => {

        //this will return all the data, exposing only the id and action field to the client
        Todo.find({}, 'action')
          .then(data => res.json(data))
          .catch(next)
      });

      router.post('/todos', (req, res, next) => {
        if(req.body.action){
          Todo.create(req.body)
            .then(data => res.json(data))
            .catch(next)
        }else {
          res.json({
            error: "The input field is empty"
          })
        }
      });

      router.delete('/todos/:id', (req, res, next) => {
        Todo.findOneAndDelete({"_id": req.params.id})
          .then(data => res.json(data))
          .catch(next)
      })

      module.exports = router;
    ```


### Database
- We need a database where we will store our data.For this we will make use of [mlab](https://mlab.com/). Follow this [doc](https://docs.mlab.com/connecting/) to get started with mlab. After setting up your database you need to update `index.js` file with the following code:
  + ```javascript 
      const express = require('express');
      const bodyParser = require('body-parser');
      const mongoose = require('mongoose');
      const routes = require('./routes/api');
      const path = require('path');
      require('dotenv').config();

      const app = express();

      const port = process.env.PORT || 5000;

      //connect to the database
      mongoose.connect(process.env.DB, { useNewUrlParser: true , useUnifiedTopology: true })
        .then(() => console.log(`Database connected successfully`))
        .catch(err => console.log(err));

      //since mongoose promise is depreciated, we overide it with node's promise
      mongoose.Promise = global.Promise;

      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

      app.use(bodyParser.json());

      app.use('/api', routes);

      app.use((err, req, res, next) => {
        console.log(err);
        next();
      });

      app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      });
      ```
  + Use `process.env` to access environment variables, which need to be created. Create a file in your root directory with name `.env` and edit:
    * `DB = mongodb+srv://hans:<password>@todo-exercise-db.qjosq.mongodb.net/<dbname>?retryWrites=true&w=majority`
- Reminder: $ `npm install dotenv`
  + Then require and configure it in `index.js`
    * `require('dotenv').config();`
  + Using environment variables instead of writing credentials to the application code directly can hide sensitive information from our versioning system. It is considered a best practice to separate configuration and secret data from application code in this manner.


### Testing Api
- Make sure our RESTful api is working. Since our frontend is not ready yet, we can make use of some api development clients to test our code. We can use of [Postman](https://www.getpostman.com/) or [Insomnia](https://insomnia.rest/).
- First, start your server
  + $ `node index.js`
- Second, open your client, create a `get` method and navigate to `http://localhost:5000/api/todos`
  + ![Test RESTful APIs](./pics/Test%20RESTful%20APIs.gif)
- You should test all the api endpoints and make sure they are working. For the endpoints that require body, you should send json back with the necessary fields since it’s what we setup in our code.


### Creating the Frontend
- Since we are done with the functionality we want from our api, it is time to create an interface for the client to interact with the api.
  + In the same root directory as your backend code, use [create-react-app](https://create-react-app.dev/docs/getting-started) command to scaffold our app.
    * $ `create-react-app client`
    * This will create a new folder in your todo directory called client, where you will add all the react code.


### Running the React App
- Before testing the react app, there are a number od dependencies that need to be installed.
  + Install [concurrently](https://www.npmjs.com/package/concurrently) as a **dev dependency**
    * $ `npm install concurrently --save-dev`
  + Install [nodemon](https://www.npmjs.com/package/nodemon) as a **dev dependency**
    * $ `npm install nodemon --save-dev`
- Enter into `./client/` folder, then locate the package.json file and add the key value pair below inside it. This proxy setup in our package.json file will enable us make api calls without having to type the full url, just /api/todos will get all our todos.
  + `"proxy": "http://localhost:5000"`
- Go back to the root directory, and make sure we're not in the `./client/` directory.
  + Run $ `npm run dev`, and our app should be open and running on [localhost:3000](http://localhost:3000/)


### Creating your React Components
- One of the advantages of react is that it makes use of components, which are reusable and also makes code modular.
- For our todo app, there will be **two state components** and **one stateless component**. Inside your `./client/src/` folder create another folder called `./client/src/components/` and inside it create three files: 
  + `Input.js`
  + `ListTodo.js`
  + `Todo.js`
- `./client/src/components/Input.js` is used to set a input text box on the page for adding a new todo event.
  + ```javascript
      import React, { Component } from 'react';
      import axios from 'axios';


      class Input extends Component {

        state = {
          action: ""
        }

        addTodo = () => {
          const task = {action: this.state.action}

          if(task.action && task.action.length > 0){
            axios.post('/api/todos', task)
              .then(res => {
                if(res.data){
                  this.props.getTodos();
                  this.setState({action: ""})
                }
              })
              .catch(err => console.log(err))
          }else {
            console.log('input field required')
          }
        }

        handleChange = (e) => {
          this.setState({
            action: e.target.value
          })
        }

        render() {
          let { action } = this.state;
          return (
            <div>
              <input type="text" onChange={this.handleChange} value={action} />
              <button onClick={this.addTodo}>add todo</button>
            </div>
          )
        }
      }

      export default Input
    ```
- To make use of [axios](https://www.npmjs.com/package/axios), which is a Promise based HTTP client for the browser and node.js.
  + cd to `./client/` folder
  + Then, run $ `npm install axios` **in the `./client/` folder**.
- After that, let's open our `./client/src/components/ListTodo.js` and paste the following code
  + ```javascript
      import React from 'react';

      const ListTodo = ({ todos, deleteTodo }) => {

        return (
          <ul>
            {
              todos &&
                todos.length > 0 ?
                  (
                    todos.map(todo => {
                      return (
                        <li key={todo._id} onClick={() => deleteTodo(todo._id)}>{todo.action}</li>
                      )
                    })
                  )
                  :
                  (
                    <li>No todo(s) left</li>
                  )
            }
          </ul>
        )
      }

      export default ListTodo
    ```
- Then, we can open our `./client/src/components/Todo.js` file and write the following code
  + ```javascript
      import React, {Component} from 'react';
      import axios from 'axios';

      import Input from './Input';
      import ListTodo from './ListTodo';

      class Todo extends Component {

        state = {
          todos: []
        }

        componentDidMount(){
          this.getTodos();
        }

        getTodos = () => {
          axios.get('/api/todos')
            .then(res => {
              if(res.data){
                this.setState({
                  todos: res.data
                })
              }
            })
            .catch(err => console.log(err))
        }

        deleteTodo = (id) => {

          axios.delete(`/api/todos/${id}`)
            .then(res => {
              if(res.data){
                this.getTodos()
              }
            })
            .catch(err => console.log(err))
        }

        render() {
          let { todos } = this.state;

          return(
            <div>
              <h1>My Todo(s)</h1>
              <Input getTodos={this.getTodos}/>
              <ListTodo todos={todos} deleteTodo={this.deleteTodo}/>
            </div>
          )
        }
      }

      export default Todo;
    ```
- We need to make little adjustment to our react code. Delete the logo and adjust our `./client/App.js` to look like this.
  + ```javascript
      import React from 'react';

      import Todo from './components/Todo';
      import './App.css';

      const App = () => {
        return (
          <div className="App">
            <Todo />
          </div>
        );
      }

      export default App;
    ```
- Then paste the following code into `./client/src/App.css`
  + ```javascript
      .App {
        text-align: center;
        font-size: calc(10px + 2vmin);
        width: 60%;
        margin-left: auto;
        margin-right: auto;
      }

      input {
        height: 40px;
        width: 50%;
        border: none;
        border-bottom: 2px #101113 solid;
        background: none;
        font-size: 1.5rem;
        color: #787a80;
      }

      input:focus {
        outline: none;
      }

      button {
        width: 25%;
        height: 45px;
        border: none;
        margin-left: 10px;
        font-size: 25px;
        background: #101113;
        border-radius: 5px;
        color: #787a80;
        cursor: pointer;
      }

      button:focus {
        outline: none;
      }

      ul {
        list-style: none;
        text-align: left;
        padding: 15px;
        background: #171a1f;
        border-radius: 5px;
      }

      li {
        padding: 15px;
        font-size: 1.5rem;
        margin-bottom: 15px;
        background: #282c34;
        border-radius: 5px;
        overflow-wrap: break-word;
        cursor: pointer;
      }

      @media only screen and (min-width: 300px) {
        .App {
          width: 80%;
        }

        input {
          width: 100%
        }

        button {
          width: 100%;
          margin-top: 15px;
          margin-left: 0;
        }
      }

      @media only screen and (min-width: 640px) {
        .App {
          width: 60%;
        }

        input {
          width: 50%;
        }

        button {
          width: 30%;
          margin-left: 10px;
          margin-top: 0;
        }
      }
    ```
- Also in `./client/src/index.css` add the following rules
  + ```javascript
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
        background-color: #282c34;
        color: #787a80;
      }

      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
          monospace;
      }
    ```
- **Assuming no errors when saving** all these files, the todo app should be ready and fully functional with the functionality discussed earlier
  + creating a task
  + deleting a task
  + viewing all your tasks


### Reference
- [Digital Ocean-How To Get Started with the MERN Stack](https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack)
