const docValidator = require('../utils/validators');

module.exports = async (req, res, next) => {
  if(!req.body.hasOwnProperty('document') || (req.body.hasOwnProperty('document') && typeof req.body.document !== 'string')) {
    return res.status(400).json("Missing document");
  }

  if(!docValidator(req.body.document)) {
    return res.status(422).json("Invalid document");
  }

  let formatedDoc = req.body.document.replace(/\D/g,"");

  const MongoClient = require('mongodb').MongoClient;

  const uri = process.env.DB_URI;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  let result = null;

  try {
    await client.connect();
    result = await insertDoc(client, formatedDoc);
  } catch(err) {
    return res.status(500).json("Internal error");
  } finally {
    await client.close();
    return res.status(200).json(result);
  }
}

async function insertDoc(client, doc){
  let documentObj = {
    document: doc,
    blacklist: false
  }
  const result = await client.db("cpfCnpjDb").collection("document").insertOne(documentObj);
  return result;
}