const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose
  .connect(
    "mongodb+srv://" + process.env.DB_USER_PASS + "@nodetuts.xscds4t.mongodb.net/application?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
