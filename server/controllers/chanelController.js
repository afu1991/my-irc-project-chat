var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('../models/User');

var User = mongoose.model('User');

