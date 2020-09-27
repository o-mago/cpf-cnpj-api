const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

module.exports = () => {
  const app = express();

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.API_PORT);

  // MIDDLEWARES
  app.use(bodyParser.json());

  require('../api/routes/getDocuments')(app);
  require('../api/routes/addDocument')(app);
  require('../api/routes/updateDocument')(app);

  const MongoClient = require('mongodb').MongoClient;

  const uri = process.env.DB_URI;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app.set('client', client);

  return app;
};