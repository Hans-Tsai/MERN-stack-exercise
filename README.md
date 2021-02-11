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


### Reference
- [Digital Ocean-How To Get Started with the MERN Stack](https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack)