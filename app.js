const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const cors = require("cors");
const localStrategy = require("passport-local").Strategy;
const nodeApiDocGenerator = require("node-api-doc-generator");
const { DATABASE, PORT } = require("./config/keys");
const User = require("./models/userModel");
const moment = require("moment");
const WebSockets = require("./helpers/WebSocket");

const userRoutes = require("./routes/users");
const locationRoutes = require("./routes/locations");
const categoryRoutes = require("./routes/categories");
const missionRoutes = require("./routes/missions");
const offreRoutes = require("./routes/offres");
const messageRoutes = require("./routes/messages");
const productRoutes = require("./routes/products");
const infoRoutes = require("./routes/infos");
const publiciteRoutes = require("./routes/publicites");
const vipRoutes = require("./routes/vip");
const helpRoutes = require("./routes/helps");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('Connected 2 ')
  })
  .catch((err) => console.log(err));

//set up cors
app.use(cors());
// app.use(secure);
//middleware for session
app.use(
  session({
    secret: "Just a simple login/sign up application",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy(
    {
      usernameField: "phone",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, phone, password, done) {
      User.findOne({ $or: [{ phone: phone }] }, function (err, user) {
        if (!user) {
          return done(null, false, { message: "Incorrect phone number" });
        }

        if (!user.active) {
          return done(null, false, { message: "Compte inactif" });
        }
        user.authenticate(password, function (err, users, passwordError) {
          if (passwordError) {
            return done(null, false, { message: "Password is wrong" });
          } else if (users) {
            return done(null, users);
          }
        });
      });
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for method override
app.use(methodOverride("_method"));

//middleware for flash messages
app.use(flash());

//Setting middleware globally
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.moment = moment;
  next();
});

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

nodeApiDocGenerator(app, "http://localhost", PORT);
app.use(userRoutes);
app.use(locationRoutes);
app.use(categoryRoutes);
app.use(missionRoutes);
app.use(offreRoutes);
app.use(messageRoutes);
app.use(productRoutes);
app.use(infoRoutes);
app.use(publiciteRoutes);
app.use(vipRoutes);
app.use(helpRoutes);

const server = http.createServer(app);
app.set("websocket", new WebSockets(server));
server.listen(PORT, () => {
});
