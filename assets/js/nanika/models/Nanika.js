var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  constructor: function Article() {
  },
  url: function () {
    return '/api/groups/1/users/1'; // + this.id
  },
  parse: function (res) {
    console.log('parse');
    console.log(res);
  },
  defaults: {
    title: '',
    description: '',
    date: ''
  }
});

