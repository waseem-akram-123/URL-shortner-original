// const {getUser} = require ("../service/auth");

// async function restrictLoggedInUserOnly (req,res,next) {
//     const useruid = req.cookies?.uid;
//     if (!useruid) return res.redirect ("/login");

//     const user = getUser (useruid);
//     if (!user) return res.redirect ("/login");

//     req.user = user;
//     next();
// }
// async function checkAuth (req,res,next) {
//     const useruid = req.cookies?.uid;

//     const user = getUser (useruid);

//     req.user = user;
//     next();
// }
const {getUser} = require ("../service/auth");

// function checkAuthentication (req, res, next){
//     const tokenCookie = req.cookies?.token;

//     req.user = null;
    
//     if (!tokenCookie) next();

//     const token = tokenCookie;

//     const user = getUser (token);

//     req.user = user;

//     return next();
// }
function checkAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie) {
        return next(); // Allow unauthenticated access to continue
    }

    const user = getUser(tokenCookie);

    if (user) {
        req.user = user;
    }

    next(); // Continue processing
}

function restrictTo (roles = []){  
      return function (req,res,next){
        if (!req.user) return res.redirect ("/login");

        if (!roles.includes (req.user.role)) {
            return res.end ("UN-AUTHORIZED");
        }
        return next();
    };
}
module.exports = {
    checkAuthentication,
    restrictTo,
};