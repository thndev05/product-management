const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected successfully!');
  } catch (error) {
    console.log('Connected failed!');
  }
}