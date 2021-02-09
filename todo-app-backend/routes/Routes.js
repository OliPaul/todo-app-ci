const express = require('express');

const app = express.Router();
//For Cloudant auth
const cloudantAuth = require("../cloudant/auth");
//For Text 2 Speech
const t2sAuth = require("../text_to_speech/auth");
//For bugsnag
const bugsnag = require("../bugsnag/bugsnag");

// get all todo items in the db
app.get('/', (req, res) => {

  //Auth cloudant
  const service = cloudantAuth.authenticate();
  
  service.postAllDocs({
    db: 'todo_database',
    includeDocs: true
  }).then(response => {
    res.send(response.result);
  });
});

// add a todo item
app.post('/', (req, res) => {
  const { name, where, when, done } = req.body;

  //Auth cloudant
  const service = cloudantAuth.authenticate();

  const id = Math.random().toString(36).substring(7);

  const taskDocument = {
    _id: `task:${id}`,
    type: 'task',
    taskID: id,
    name: name,
    where: where,
    when: when,
    done: done
  };
  
  service.postDocument({
    db: 'todo_database',
    document: taskDocument
  }).then(response => {
    //Send audio message to user
    t2sAuth.voiceSynthetization(`Vous venez d'ajouter la tâche ${name} qui aura lieu ${where} à la date du ${when}. L'opération a été un succès !`).then(buffer => {
      res.send({message: "Task saved !", messageBuffer: buffer});
    });
  }).catch(error => {
    //Report error
    const bugError = bugsnag.init();
    bugError.notify(error);
  });

});

// delete a todo item
app.delete('/:id/:rev/:name', (req, res) => {
  const { id, rev, name } = req.params;
  //Auth cloudant
  const service = cloudantAuth.authenticate();
  
  service.deleteDocument({
    db: 'todo_database',
    docId: id,
    rev: rev
  }).then(response => {
    //Send audio message to user
    t2sAuth.voiceSynthetization(`Tâche ${name} supprimée avec succès !`).then(buffer => {
      res.send({message: "Task deleted !", messageBuffer: buffer});
    });
  }).catch(error => {
    //Report error
    const bugError = bugsnag.init();
    bugError.notify(error);
  });
});

// update a todo item
app.put('/', (req, res) => {
  const id  = req.body._id;
  const todo = { 
    _rev: req.body._rev,
    type: 'task',
    taskID: id,
    name: req.body.name,
    where: req.body.where,
    when: req.body.when,
    done: req.body.done };

  //Auth cloudant
  const service = cloudantAuth.authenticate();

  
  service.putDocument({
    db: 'todo_database',
    docId: id,
    document: todo
  }).then(response => {
    //Send audio message to user
    t2sAuth.voiceSynthetization(`Vous venez de mettre à jour la tâche ${req.body.name}. L'opération a été un succès !`).then(buffer => {
      res.send({message: "Task updated !", messageBuffer: buffer});
    });
  }).catch(error => {
    //Report error
    const bugError = bugsnag.init();
    bugError.notify(error);
  });

});

module.exports = app;
