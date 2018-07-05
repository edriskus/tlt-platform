const passport = require('passport');

module.exports = {

  /**
   * A custom action that overrides the built-in "findOne" blueprint action.
   * As a dummy example of customization, imagine we were working on something in our app
   * that demanded we tweak the format of the response data, and that we only populate two
   * associations: "company" and "friends".
   */
  findOne: function (req, res) {
    let params = { id: req.param('id') };
    if(!req.user) {
      params.published = true;
    }
    Post.findOne(params)
    .exec(function(err, post) {
      if (err) {
        switch (err.name) {
          case 'UsageError': return res.badRequest(err);
          default: return res.serverError(err);
        }
      }
      if (!post) { return res.notFound(); }
      if (req.isSocket) {
        Post.subscribe(req, [post.id]);
      }
      return res.ok(post);
    });
  },

  find: function (req, res) {
    let params = { };
    if(!req.user) {
      params.published = true;
    }
    Post.find(params)
    .exec(function(err, post) {
      if (err) {
        switch (err.name) {
          case 'UsageError': return res.badRequest(err);
          default: return res.serverError(err);
        }
      }
      if (!post) { return res.notFound(); }
      if (req.isSocket) {
        Post.subscribe(req, [post.id]);
      }
      return res.ok(post);
    });
  }

}
