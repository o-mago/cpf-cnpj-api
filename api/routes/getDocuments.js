const getDocuments = require('../controllers/getDocuments');

module.exports = app => {
  app.route('/api/v1/getDocuments')
    .post(getDocuments);
}