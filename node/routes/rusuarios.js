module.exports = function (app, swig, gestorBD) {
	/* POST de registro de un nuevo usuario*/
	app.post('/usuario', function (req, res) {
		let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
		let usuario = {name: req.body.name, lastname: req.body.lastname, email: req.body.email, password: seguro};
		if (usuario.name == "" || usuario.lastname == "" || usuario.email == "" || req.body.password == "" || req.body.rep_password=="") {
			res.redirect("/registrarse" + "?mensaje=Rellene todos los campos" + "&tipoMensaje=alert-danger ");
		}else{
		if(req.body.password !=req.body.rep_password){
				res.redirect("/registrarse" + "?mensaje=Las contraseñas no coinciden" + "&tipoMensaje=alert-danger ");
		}else{
		let criterio = {email: usuario.email};
		gestorBD.obtenerUsuarios(criterio, function (usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				gestorBD.insertarUsuario(usuario, function (id) {
					if (id == null) {
						res.redirect("/registrarse" + "?mensaje=Error al registrar usuario" + "&tipoMensaje=alert-danger ");
					} else {
						res.redirect("/identificarse" + "?mensaje=Nuevo usuario registrado");
					}
				});
			} else {
				res.redirect("/registrarse" + "?mensaje=Ya existe un usuario con ese email" + "&tipoMensaje=alert-danger ");
			}
		})
		}
	}
	});
	/* GET para acceder al registro de usuario*/
	app.get("/registrarse", function (req, res) {
		let respuesta = swig.renderFile('views/bregistro.html', {session: req.session.usuario != null});
		res.send(respuesta);
	});
	/* GET para acceder al login*/
	app.get("/identificarse", function (req, res) {
		let respuesta = swig.renderFile('views/bidentificacion.html', {session: req.session.usuario != null});
		res.send(respuesta);
	});
	/* POST para loggearse*/
	app.post("/identificarse", function (req, res) {
		let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
		let criterio = {email: req.body.email}
		if(req.body.email=="" || req.body.password ==""){
			res.redirect("/identificarse"+"?mensaje=Rellene todos los campos"+"&tipoMensaje=alert-danger ");

		}else{
		gestorBD.obtenerUsuarios(criterio, function (usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				req.session.usuario = null;
				res.redirect("/identificarse"+"?mensaje=Usuario inexistente"+"&tipoMensaje=alert-danger ");
			} else {
				if(usuarios[0].password != seguro){
					req.session.usuario = null;
					res.redirect("/identificarse"+"?mensaje=Contraseña incorrecta"+"&tipoMensaje=alert-danger ");
				}else{
					req.session.usuario = usuarios[0].email;
					res.redirect("/usuarios");
				}

			}
		});
		}
	});
	/* GET para cerrar sesión*/
	app.get('/desconectarse', function (req, res) {
		req.session.usuario = null;
		res.redirect("/identificarse");
	})
	/* GET para listar usuarios*/
	app.get("/usuarios", function (req, res) {
		let criterio = {};
		if (req.query.busqueda != null) {
			criterio = { $or: [
						{name: {$regex: ".*" +req.query.busqueda + ".*"}},
						{lastname: {$regex: ".*" +req.query.busqueda + ".*"}},
						{email: {$regex: ".*" +req.query.busqueda + ".*"}}
					]
				};
		}

		let pg = parseInt(req.query.pg); // EsString !!!
		if (req.query.pg == null) { // Puede no venir el param
			pg = 1;
		}
		gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
			if (usuarios == null) {
				res.send("Error al listar ");
			} else {
				let ultimaPg = total / 5;
				if (total % 5 > 0) { // Sobran decimales
					ultimaPg = ultimaPg + 1;
				}
				let paginas = []; // paginas mostrar
				for (let i = pg - 2; i <= pg + 2; i++) {
					if (i > 0 && i <= ultimaPg) {
						paginas.push(i);
					}
				}
				for(var usuario of usuarios) {
					delete usuario['password'];
				}
				let respuesta = swig.renderFile('views/bUsuarios.html', {
					usuarios: usuarios,
					paginas: paginas,
					actual: pg,
					session: req.session !== null ,
					session_user: req.session.usuario
				});
				res.send(respuesta);
			}
		});

	});


};