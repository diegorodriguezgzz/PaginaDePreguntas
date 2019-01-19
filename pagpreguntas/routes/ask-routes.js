const express = require("express");
const askRoutes = express.Router();
const zxcvbn = require("zxcvbn");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("./models/User");
const Pregunta = require("./models/Pregunta");
const Respuesta = require("./models/Respuesta");
const Interes = require("./models/Interes");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

askRoutes.get("/signup",(req,res,next)=>{
  res.render("auth/signup");
});

askRoutes.post("/signup",(req,res,next)=>{
  const username=req.body.username;
  const password=req.body.password;

  if(username==="" || password===""){
    res.render("auth/signup",{
      message: "Indica un nombre de usuario y contraseña"
    })
    return;
  }

  if(zxcvbn(password).score < 1){
    res.render("auth/signup",{
      message: "El nivel de complejidad de tu password es bajo, favor de ingresar numeros, letras y caracteres especiales"
    })
    return;
  }

  User.findOne({username})
  .then(user=>{
    if(user !== null){
      res.render("auth/signup",{
        message: "El usuario ingresado ya existe"
      })
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password,salt);

    const newUser = new User({
      username,
      password: hashPass
    })

    newUser.save((err)=>{
      if(err){
        res.render("auth/signup",{
          message: "No fue posible guardar el registro. Intetalo mas tarde"
        })
      }else{
        res.redirect("/login");
      }
    })
  })
  .catch(error=>{
    next(error)
  })
})

askRoutes.get("/login",(req,res,next)=>{
  res.render("auth/login", {message:req.flash("error")})
})

askRoutes.post("/login", passport.authenticate("local",{
  successRedirect:"/private-page",
  failureRedirect:"/login",
  failureFlash:true,
  passReqToCallback:true
}))

askRoutes.get("/userpage", ensureLogin.ensureLoggedIn(),(req,res,next)=>{
  res.render("user-page",{user:req.user})
})

/////////////////////////////////Slack login////////////////////
askRoutes.get("/auth/slack", passport.authenticate("slack"));
askRoutes.get("/auth/slack/callback", passport.authenticate("slack", {
  successRedirect: "/userpage",
  failureRedirect: "/"
}));

////////////////////Consultas sin login//////////////////////////
router.get('/preguntas', (req, res)=>{
  Pregunta.find()
    .populate("tag", "respuestas")
    .then(preguntas =>{
      res.render('preguntas-all', {preguntas})
    })
    .catch(err =>{
      console.log(err)
    })
})

router.get('/preguntas/:cat', (req, res)=>{
  const cat = req.params.cat;
  Pregunta.find({tag : cat})
    .populate("tag", "respuestas")
    .then(preguntas =>{
      res.render('preguntas-all', {preguntas})
    })
    .catch(err =>{
      console.log(err)
    })
})


////////////////////CRUD preguntas login/////////////////////////
//Consultas
router.get('/preguntas/:id/user', (req, res)=>{
  User.find()
    .populate("preguntas","respuestas","tags")
    .then(user =>{
      res.render('preguntas-all', {user})
    })
    .catch(err =>{
      console.log(err)
    })
})

router.get('/preguntas/:cat/consulta/:id/user', (req, res)=>{
  const cat = req.params.cat;
  const id = req.params.id;
  User.find($and[{'_id': id},{"tag": cat}])
    .populate("tag", "respuestas")
    .then(user =>{
      res.render('preguntas-all', {user})
    })
    .catch(err =>{
      console.log(err)
    })
})

//Altas
router.get("/preguntas/:id/add",(req,res)=>{
  res.render("pregunta-nueva")
})

router.post("/preguntas/add",(req,res)=>{
  const {pregunta,tag[]} = req.body;
  const newPregunta = new Pregunta({pregunta,tag});
  newPregunta.save()
  .then((pregunta)=>{
    res.redirect(301,"/preguntas")
  })
  .catch(err=>console.log(err));
})

router.post('/preguntas/:id/delete', (req, res)=>{
  let preguntaId = req.params.id
  console.log(preguntaId);
  Pregunta.findByIdAndRemove({'_id': preguntaId})
  .then((pregunta)=>{
    res.render('/preguntas')
  })
  .catch((err)=>{
    console.log(err);
  })
})



askRoutes.get("/logout",(req,res,next)=>{
  req.logout();
  res.redirect("login");
})

module.exports= askRoutes;
