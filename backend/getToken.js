const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 'dummy' }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
