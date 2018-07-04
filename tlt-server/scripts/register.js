module.exports = {


  friendlyName: 'Register',


  description: 'Register a user.',


  inputs: {
    username: {
      description: 'Username for new user',
      type: 'string',
      required: true
    },
    email: {
      description: 'Email for new user',
      type: 'string',
      required: true
    },
    password: {
      description: 'Password for new user',
      type: 'string',
      required: true
    }
  },


  fn: async function (inputs, exits) {

    sails.log('Running custom shell script... (`register`)');
    await User.create({
      username: inputs.username,
      email: inputs.email,
      password: inputs.password
    });

    console.log(await User.find());

    // All done.
    return exits.success();

  }


};

