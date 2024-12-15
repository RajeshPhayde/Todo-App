import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

//! Creating database and connecting to it (Use databaseName)
mongoose
  .connect(process.env.DEV_MONGOURL)
  .then(() => {
    console.log("Mongodb Connected SuccessFully");
  })
  .catch((err) => {
    console.log(err);
  });
