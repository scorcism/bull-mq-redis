const express = require("express");
const app = express();
const port = 8080;
const { Queue } = require("bullmq");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const addToCourse = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Added ${id}`);
    }, 400);
  });
};

const emailQueue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
    username: "",
    password: "PASSWORD",
  },
});

app.post("/opt", async (req, res) => {
  const id = req.body.id;
  console.log("id: ", id);
  let studentData = await addToCourse(id);

  //   Job name , {data}
  await emailQueue.add(`${Date.now()}`, {
    data: id,
  });

  res.json(studentData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
