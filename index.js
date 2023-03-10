const express = require('express');
const xlsx = require('xlsx');
const axios = require('axios');
const configfile = require('./config.json');

// Middlewares
const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  console.log("JSON DATA...", configfile.assignedTo);
  const assignedTo = configfile.assignedTo;
  const url = configfile.sheets[0].url;

  axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      const workbook = xlsx.read(response.data, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      let actualData = [];

      data.forEach((item) => {
        if (item.Owner == assignedTo) {
          actualData.push(item);
        }
      });

      res.json(actualData);
    })
    .catch((error) => {
      console.error(error);
    });
});

// connection
const port = process.env.PORT || 9008;
app.listen(port, () => console.log(`Listening to port ${port}`));

