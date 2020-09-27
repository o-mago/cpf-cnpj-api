module.exports = async (req, res, next) => {
  const client = req.app.get('client');

  let result = null;
  let [query, sort] = buildQuery(req.body);
  let pageNumber = req.body.page ? req.body.page : 1;
  let limitPerPage = req.body.limit ? req.body.limit : 20;
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
  if(req.hasOwnProperty('blacklist') && typeof req.blacklist === 'boolean' && req.blacklist) {
    query["blacklist"] = req.blacklist;
  }
  if(req.hasOwnProperty('cpf') && typeof req.cpf === 'boolean' && !req.cpf) {
    if(!query.hasOwnProperty("$or")) {
      query["$or"] = [];
    }
    query["$or"].push({
      "$expr":{
        "$ne": [
          {
            "$strLenCP": "$document"
          },
          11
        ]
      }
    });
  }
  if(req.hasOwnProperty('cpf') && typeof req.cnpj === 'boolean' && !req.cnpj) {
    if(!query.hasOwnProperty("$or")) {
      query["$or"] = [];
    }
    query["$or"].push({
      "$expr":{
        "$ne": [
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