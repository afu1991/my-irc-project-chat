var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true, min: 5, max: 20 },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  type : { type: Boolean, default: false },
  token: { type: String },
  created_at: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

//var todos = [];

/*io.on('connection',function(){

  socket.emit('message_saved', todos);

  socket.on('new_message', function(data){
      todos.push(data);
      socket.broadcast.emit('new_message', data)
  })
});
*/
