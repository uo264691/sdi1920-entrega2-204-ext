//Modulos
let express = require('express');
let app = express();

let rest = require('request');
app.set('rest',rest);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
	// Debemos especificar todas las headers que se aceptan. Content-Type , token
	next();
});

var jwt = require('jsonwebtoken');
app.set('jwt',jwt);


let fs = require('fs');
let https = require('https');

let expressSession = require('express-session');
app.use(expressSession({
		secret: 'abcdefg',
		resave: true,
		saveUninitialized: true
	})
);

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());

let mongo= require('mongodb');
let swig  = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
	console.log("routerUsuarioSession");
	if ( req.session.usuario ) {
		// dejamos correr la petición
		next();
	}
	else {
		console.log("va a : "+req.session.destino);
		res.redirect("/identificarse");
	}
});
//Aplicar routerUsuarioSession
app.use("/usuarios", routerUsuarioSession);
app.use("/invitaciones", routerUsuarioSession);
app.use("/amigos", routerUsuarioSession);
app.use("/invitacion/:email", routerUsuarioSession);
app.use("/amigos/eliminar/:email", routerUsuarioSession);


//routerUsuarioAutor
let routerInvitaciones = express.Router();
routerInvitaciones.use(function(req, res, next) {
	console.log("routerInvitaciones");
	let path = require('path');
	let id = path.basename(req.originalUrl);
	// Cuidado porque req.params no funciona
	// en el router si los params van en la URL.
	gestorBD.obtenerInvitaciones(      {_id: mongo.ObjectID(id) }, function (invitaciones) {
		console.log(invitaciones[0]);
		if(invitaciones[0].receptor == req.session.usuario ){
			next();
		}
		else {
			res.redirect("/usuarios");
		}
	})

});
//Aplicar routerUsuarioAutor
app.use("/invitacion/aceptar/",routerInvitaciones);
app.use("/invitacion/rechazar/",routerInvitaciones);


// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
	// obtener el token, vía headers (opcionalmente GET y/o POST).
	var token = req.headers['token'] || req.body.token || req.query.token;
	if (token != null) {
		// verificar el token
		jwt.verify(token, 'secreto',null, function(err, infoToken) {
			if (err || (Date.now()/1000 - infoToken.tiempo) > 3600 ){
				res.status(403); // Forbidden
				res.json({
					acceso : false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;

			} else {
				// dejamos correr la petición
				res.usuario = infoToken.usuario;
				next();
			}
		});

	} else {
		res.status(403); // Forbidden
		res.json({
			acceso : false,
			mensaje: 'No hay Token'
		});
	}
});
// Aplicar routerUsuarioToken
app.use('/api/privado/', routerUsuarioToken);


app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@tiendamusica-shard-00-00-x8s5q.mongodb.net:27017,tiendamusica-shard-00-01-x8s5q.mongodb.net:27017,tiendamusica-shard-00-02-x8s5q.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);  // (app, param1, param2, etc.)
require("./routes/ramigos.js")(app, swig, gestorBD);
require("./routes/rapi.js")(app, gestorBD);


app.get('/', function (req, res) {
	res.redirect('/usuarios');
});

app.use( function (err,req,res,next)
{
	console.log("Error producido: " + err); //Mostramos el error
	if(!res.headersSent){
		res.status(400);
		res.send("Recurso no diponible");
	}

});

// lanzar servidor
https.createServer({
	key: fs.readFileSync('certificates/alice.key'),
	cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
	console.log("Servidor activo");
});