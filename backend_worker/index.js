const express = require("express");
const app = express();
const port = 8090;
const { Worker } = require("bullmq");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const sendMail = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done");
    }, 3000);
  });
};

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const data = job.data;
    sendMail(data.data);
    console.log("Mail sent finished ", data.data, job.id);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
      username: "",
      password: "PASSWORD",
    },
    // concurrency: 10 // Concurrency control
    // limiter: {
    //   max: 50,
    //   duration: 1 * 100,
    // },
  }
);

emailWorker;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
