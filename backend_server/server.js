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

async function loadModel(results) {
  const model = await tf.loadLayersModel(
    "https://nikhil2904.github.io/testibg/model.json"
  );

  const oneDArray = tf.tensor1d(results);
  const shape = [1, 128, 128, 3];
  const newArray = oneDArray.reshape(shape);

  // Log the new 4D array to the console
  console.log(newArray);

  const op = model.predict(newArray);
  const opData = op.dataSync();
  const number = Number(opData[0]);

  // console.log(tensor4d.shape);
  if (number > 0.5) return true;
  else return false;
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const imagePath = path.join(__dirname, req.file.path);
  const proc = execSync(
    "python3 " +
      "prepare_ela_image.py " +
      imagePath
  );
  const results = proc.toString();
  const newResult = JSON.parse(results);

  // console.log(results);
  const predictions = await loadModel(newResult);
  res.send({ newResult, predictions });
});

app.listen(process.env.PORT || 3000,() => {
  console.log("Server started on port 3000");
});
