var cp = require("child_process");
var express = require("express");
var bp = require("body-parser");
var app = express();
var fs = require("fs");
app.use(bp.urlencoded({extended: true}));

var nextAllowed = 0;

var conf;
try {
  conf = JSON.parse(fs.readFileSync("config.json", "utf8"));
  console.log("Config loaded succesfully")
} catch(e) {
  conf = { port: 10000, password: "change-this" }
  fs.writeFileSync("config.json", JSON.stringify(conf, null, "\t"), "utf8");
  console.log("config file written change password, (and port if necessary)")
  process.exit();
}

app.listen(conf.port, function() {
  console.log("Listening on port %d", conf.port);
}).on("error", function() {
  console.log("port in use, please close other programs on port %d, or try a different port", conf.port);
  process.exit();
});

app.post("/standby", function(req, res) {
  if(req.body.password != conf.password) {
    res.sendStatus(401);
  }
  var now = new Date().getTime()
  if(now > nextAllowed) {
    nextAllowed = now + (60 * 1000);
    res.sendStatus(200);
    cp.exec ("standby.jar");
  } else {
    res.sendStatus(429);
  }
});

app.get("/test", function(req, res) {
  res.sendStatus(200);
});

