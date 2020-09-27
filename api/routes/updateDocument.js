const updateDocument = require('../controllers/updateDocument');

module.exports = app => {
  app.route('/api/v1/updateDocument')
    .post(updateDocument);
}