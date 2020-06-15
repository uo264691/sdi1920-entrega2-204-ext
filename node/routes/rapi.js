module.exports = function (app, gestorBD) {
	app.post("/api/autenticar/", function (req, res) {
		let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
			.update(req.body.password).digest('hex');
		let criterio = {
			email: req.body.email,
			password: seguro
		};

		gestorBD.obtenerUsuarios(criterio, function (usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				res.status(401);    // Unauthorized
				res.json({
					autenticado: false
				})
			} else {
				var token = app.get('jwt').sign(
					{usuario: criterio.email, tiempo: Date.now() / 1000},
					"secreto");
				res.status(200);
				res.json({
					autenticado: true,
					token: token
				})
			}
		});
	});

	app.get("/api/privado/amigo", function (req, res) {
		let criterio = { $or: [{amigo1 : res.usuario},{amigo2 : res.usuario}]};

		gestorBD.obtenerAmistades(criterio, function (amistades, total) {
			if (amistades == null) {
				res.json({error: "Se ha producido un error"});
			} else {
				let amigos = amistades.map(function(x){
					if(x.amigo1!==res.usuario) return x.amigo1;
					else return x.amigo2;
				});

				criterio = { email: {$in: amigos}};
				gestorBD.obtenerUsuarios(criterio, function (usuarios) {
					if (usuarios == null) {
						res.status(500);
						res.json({error: "Se ha producido un error"})
					} else {
						for(var usuario of usuarios) {
							delete usuario['password'];
						}
						res.status(200);
						res.json(usuarios);
					}
				});
			}
		});
	});

	app.get("/api/privado/mensaje", function (req, res) {
		if(req.body == null)
		{
			res.status(400);
			res.json({error: "Parametros incorrectos"});
		}
		else
		{
			let criterio = { $or: [
				{$and: [{emisor : res.usuario},{destino : req.body.conversador || req.query.conversador}]},
				{$and: [{emisor : req.body.conversador || req.query.conversador},{destino : res.usuario}]}
			]};

			gestorBD.obtenerMensajes(criterio, function (mensajes) {
				if (mensajes == null) {
					res.status(500);
					res.json({error: "Se ha producido un error"})
				} else {
					res.status(200);
					res.json(mensajes);
				}
			});
		}
	});

	app.post("/api/privado/leermensaje", function (req, res) {
		if(req.body.id == null)
		{
			res.status(400);
			res.json({error: "Parametros incorrectos"});
		}

		var ObjectID = require('mongodb').ObjectID;
		let criterio = { _id : ObjectID(req.body.id)};

		gestorBD.obtenerMensajes(criterio, function (mensajes) {
			if (mensajes == null) {
				res.status(500);
				res.json({error: "Se ha producido un error"})
			} else {
				if(res.usuario != mensajes[0].destino)
				{
					res.status(400);
					res.json({error: "Debes ser el destinatario de un mensaje para leerlo"})
				}
				else
				{
					gestorBD.leerMensaje(criterio, function (exito) {
						if (!exito) {
							res.status(500);
							res.json(
								{
									error: "Se ha producido un error"
								}
							)
						} else {
							res.status(200);
							res.json(
								{
									informacion: "Mensaje leido"
								}
							)
						}
					});
				}
			}
		});
	});

	app.post("/api/privado/mensaje", function (req, res) {
		if(req.body.destino == null || req.body.texto == null)
		{
			res.status(400);
			res.json({error: "Parametros incorrectos"});
		}
		if(req.body.destino == res.usuario)
		{
			res.status(400);
			res.json({error: "Imposible mandar mensaje a uno mismo"});
		}

		var mensaje = [];
		mensaje.push({
				emisor: res.usuario,
				destino: req.body.destino,
				texto: req.body.texto,
				leido: false
			});

		gestorBD.mandarMensaje(mensaje, function (id) {
			if (id == null) {
				res.status(500);
				res.json(
					{
						error: "Se ha producido un error"
					}
				)
			} else {
				res.status(201);
				res.json(
					{
						informacion: "Mensaje enviado",
						_id: id
					}
				)
			}
		});
	});

	app.get("/api/coffee", function (req, res) {
		res.status(418);
		res.json({error: "I refuse to brew coffee, I'm a teapot."});
	});
};
