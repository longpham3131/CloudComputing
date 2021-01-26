const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const router = express.Router();
var { exec } = require("child_process");

app.use(express.json());
app.use(express.urlencoded());

// // Static files
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/run", (req, res) => {
  const { imageName } = req.body;
  const { volCPU } = req.body;
  const { volMemory } = req.body;

  const containers = {
    "ubuntu-ssh:version4": "ubuntu-ssh",
    "centos-ssh:version2": "centos-ssh",
  };

  let port;
  if (imageName == "centos-ssh:version2") {
    port = "2201:22";
    exec(
      `sudo docker run -i -d --name ${containers[imageName]} --cpus ${volCPU} -m ${volMemory} -p ${port} ${imageName}`,
      (error, stdout, stderr) => {
        if (error) return res.json(error);
        if (stderr) return res.json(stderr);
        if (stdout) return res.json(stdout);
      });
  }
  else {
    port = "2202:22";
    exec(
      `sudo docker run -it -d --name ${containers[imageName]} --cpus ${volCPU} -m ${volMemory} -p ${port} ${imageName} && sudo docker exec ${containers[imageName]} bash -c "/etc/init.d/ssh start"`,
      (error, stdout, stderr) => {
        if (error) return res.json(error);
        if (stderr) return res.json(stderr);
        if (stdout) {
              return res.json(stdout);
        }
      }
    );
  }
});
app.post("/stop", (req, res) => {
  const { containerName } = req.body;
  exec(
    `sudo docker container stop ${containerName}`,
    (error, stdout, stderr) => {
      if (error) return res.json(error);
      if (stderr) return res.json(stderr);
      if (stdout) {
        exec(`sudo docker rm ${containerName}`, (error, stdout, stderr) => {
          if (error) return res.json(error);
          if (stderr) return res.json(stderr);
          if (stdout) {
            return res.json(stdout);
          }
        });
      }
    }
  );
});
app.get("/images", (req, res) => {
  exec("sudo docker image ls", (err, stdout, stderr) => {
    return res.json(stdout);
  });
});
app.get("/containers", (req, res) => {
  exec("sudo docker ps", (err, stdout, stderr) => {
    return res.json(stdout);
  });
});
app.get("/users", (req, res) => {
  exec("awk -F: '{ print $1}' /etc/passwd", (err, stdout, stderr) => {
    return res.json(stdout);
  });
});
app.post("/createuser", (req, res) => {
  const { username, password } = req.body;
  exec(`mkpasswd ${password}`, (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stdout) {
      const hashpw = stdout.split("\n")[0];
      exec(`sudo useradd -m -p ${hashpw} -s /bin/bash ${username}`, () => {
        return res.json(username);
      });
    }
  });
});
app.post("/deleteuser", (req, res) => {
  const { username } = req.body;
  exec(`sudo deluser --remove-home ${username}`, (err, stdout, stderr) => {
    if (stdout) {
      return res.json(stdout)
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

