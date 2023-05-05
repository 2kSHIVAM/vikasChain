const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { execSync } = require("child_process");
const tf = require("@tensorflow/tfjs-node");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

var model;
async function load() {
  console.log("hello");
  model = await tf.loadLayersModel(
    "https://2kSHIVAM.github.io/json-api/vikasChain_ml_model.json"
  );
  console.log("hello");
}
load();

async function loadModel(results) {
  console.log("entered load function");

  console.log("json loaded");
  const oneDArray = tf.tensor1d(results);
  const shape = [1, 128, 128, 3];
  const newArray = oneDArray.reshape(shape);
  console.log("4d work done");
  // Log the new 4D array to the console
  console.log(newArray);
  console.log("prediction started");

  const op = model.predict(newArray);
  const opData = op.dataSync();
  const number = Number(opData[0]);
  console.log(number);
  console.log("prediction ended");
  // console.log(tensor4d.shape);
  if (number > 0.5) return true;
  else return false;
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("entered");
  const imagePath = path.join(__dirname, req.file.path);
  const proc = execSync("python3 " + "prepare_ela_image.py " + imagePath);
  const results = proc.toString();
  const newResult = JSON.parse(results);
  console.log("script done");
  // console.log(results);
  console.log("started loading model");
  const predictions = await loadModel(newResult);
  console.log("model work done");
  res.send({ newResult, predictions });
});
app.get("/", (req, res, next) => {
  res.send({
    connect: "true",
  });
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
