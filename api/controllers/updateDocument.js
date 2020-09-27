const { ObjectID } = require('mongodb');

module.exports = async (req, res, next) => {
  if(!req.body.hasOwnProperty('_id') || (req.body.hasOwnProperty('_id') && typeof req.body._id !== 'string')) {
    return res.status(400).json("Missing _id");
  }

  if(!req.body.hasOwnProperty('blacklist') || (req.body.hasOwnProperty('blacklist') && typeof req.body.blacklist !== 'boolean')) {
    return res.status(400).json("Missing blacklist");
  }

  const client = req.app.get('client');

  let result = null;

  try {
    await client.connect();
    result = await updateDoc(client, req.body);
  } catch(err) {
    return res.status(500).json("Internal error");
  } finally {
    await client.close();
    return res.status(200).json(result);
  }
}

async function updateDoc(client, payload) {
  console.log(payload);
  let document = await client.db('cpfCnpjDb').collection('document').updateOne(
    { _id: ObjectID(payload._id) },
    { $set: { blacklist: payload.blacklist } }
  );

  return document;
};