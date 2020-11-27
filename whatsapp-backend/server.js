//Import
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbmodel.js";
import Pusher from "pusher";
import Cors from "cors";

//App config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1107518",
  key: "29732a93fee67aea44b7",
  secret: "f25f82fc83384ef4757e",
  cluster: "ap2",
  useTLS: true,
});

//Middlewares
app.use(express.json());

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});*/
//cors library will set headers => npm i cors
app.use(Cors());

//DB config
const connection_url =
  "mongodb+srv://admin:WPjCgQzH5SqdU4DM@cluster0.uy3p3.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log("Changes here - ", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});

//API routes
app.get("/", (req, res) => res.status(200).send("Whatsapp back-end"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(`Error - ${err}`);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbmessage = req.body;
  Messages.create(dbmessage, (err, data) => {
    if (err) {
      res.status(500).send(`Error - ${err}`);
    } else {
      res.status(201).send(data);
    }
  });
});

//Listener
app.listen(port, () => console.log(`App listening to ${port}`));
