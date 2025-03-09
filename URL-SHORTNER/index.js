const express = require ("express");
const {connectMongoDb} =  require ("./connection");
const URL = require ("./models/url");
const { timeStamp } = require("console");
const urlRoute = require ("./routes/url");
const staticRoute = require ("./routes/staticRouter");
const path = require ("path");

const cookieParser = require ("cookie-parser");

const userRoute = require ("./routes/user");

const {checkAuthentication,restrictTo} = require ("./middlewares/auth");

const app = express();
const PORT = 8000;

//connection
connectMongoDb ("mongodb://127.0.0.1:27017/short-url")
.then (()=> {
    console.log ("mongo db is connected");
});

// SSR ----> Server Side Rendering
app.set ("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// middleware -->  parsing json data
app.use (express.json());

// middleware  --> to parse form data
app.use (express.urlencoded ({extended:false}));

//middleware  --> parsing cookie data
app.use (cookieParser());

app.use (checkAuthentication); // always runs

//routes

app.use ("/url",restrictTo(["NORMAL"]), urlRoute);

app.use ("/user", userRoute);

app.use ("/", staticRoute);

app.get ("/url/:shortId", async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate ({
        shortId,    
    },
    {
        $push : {
            visitHistory : {
                timestamp: Date.now(),
            },
        },
    }
)
return res.redirect (entry.redirectURL);
});

app.listen (PORT, ()=> console.log (`server started at PORT :${PORT}`));