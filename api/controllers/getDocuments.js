module.exports = async (req, res, next) => {
  const MongoClient = require('mongodb').MongoClient;

  const uri = process.env.DB_URI;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  let result = null;
  let [query, sort] = req.body ? buildQuery(req.body) : [{}, {}];
  let pageNumber = req.body && req.body.page ? req.body.page : 1;
  let limitPerPage = req.body && req.body.limit ? req.body.limit : 20;
  let skips = (pageNumber-1) * limitPerPage;
  try {
    await client.connect();
    result = await listDocuments(client, query, sort, limitPerPage, skips);
  } catch(err) {
    return res.status(500).json("Internal error");
  } finally {
    await client.close();
    return res.status(200).json(result);
  }
}

async function listDocuments(client, query, sort, limitPerPage, skips) {
  let documentList = await client.db('cpfCnpjDb').collection('document').find(query).sort(sort).skip(skips).limit(limitPerPage).toArray();
  return documentList;
};

function buildQuery(req) {
  let query = {};
  let sort = {};
  if(req.hasOwnProperty('search') && typeof req.search === 'string' && req.search) {
    let regex = new RegExp(`${req.search}`,"g");
    query["document"] = { $regex: regex };
  }
  if(req.hasOwnProperty('blacklist') && typeof req.blacklist === 'boolean' && req.blacklist) {
    query["blacklist"] = req.blacklist;
  }
  if(req.hasOwnProperty('cpf') && typeof req.cpf === 'boolean' && req.cpf) {
    if(!query.hasOwnProperty("$or")) {
      query["$or"] = [];
    }
    query["$or"].push({
      "$expr":{
        "$eq": [
          {
            "$strLenCP": "$document"
          },
          11
        ]
      }
    });
  }
  if(req.hasOwnProperty('cnpj') && typeof req.cnpj === 'boolean' && req.cnpj) {
    if(!query.hasOwnProperty("$or")) {
      query["$or"] = [];
    }
    query["$or"].push({
      "$expr":{
        "$eq": [
          {
            "$strLenCP": "$document"
          },
          14
        ]
      }
    });
  }
  if(req.hasOwnProperty('sort') && typeof req.sort === 'string' && (req.sort === 'asc' || req.sort === 'desc')) {
    const sortDict = {
      "asc": 1,
      "desc": -1
    }
    sort =  { document: sortDict[req.sort]};
  }
  return [query, sort];
}