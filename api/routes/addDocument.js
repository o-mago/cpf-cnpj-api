const addDocument = require('../controllers/addDocument');

module.exports = app => {
  app.route('/api/v1/addDocument')
    .put(addDocument);
}