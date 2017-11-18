var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: {type: String, require: true},
  lastName: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  city: {type: String, require: true},
  description: String, default: "",
  tags: [String], default: [],
  education: String, default: "",
  friends: [String], default: [],
  friendRequests: [String], default: [],
  pendingFriends: [String], default: [],
  blockedUsers: [String], default: [],
  notifications: {unviewedCount: {type: Number, default: 0},
                  messages: [ {
                    from_id: String,
                    message: String,
                    time : {type: Date, default: Date.now},
                    isUnread: {type: Boolean, default: true} }
      ] }, default: [],
  photoURL: String, default: "",
  settings: { notifications: {
    friendRequest: {type: Boolean, default: true},
    friendRequestCancel: {type: Boolean, default: true},
    friendAccepted: {type: Boolean, default: true},
    chatInitiated: {type: Boolean, default: true}, 
  } }
});

module.exports = mongoose.model('User', userSchema);