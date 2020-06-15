module.exports = function (app, swig, gestorBD) {

/* GET de envio de una nueva invitación de amistad*/
    app.get('/invitacion/:email', function (req, res) {
        let receptor =req.params.email;
        invitacionPosible(receptor,req.session.usuario,function(esPosible){
            if(esPosible){
                let criterio = {email: req.session.usuario};
                gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    if (usuarios == null || usuarios.length == 0) {
                        res.send("Error al crear invitacion: usuario no encontrado");
                    } else {
                        let invitacion = {
                            receptor: receptor,
                            solicitanteName: usuarios[0].name,
                            solicitanteLastname: usuarios[0].lastname,
                            solicitanteEmail: usuarios[0].email
                        };
                        gestorBD.insertarInvitacion(invitacion, function (idInvitacion) {
                            if (idInvitacion == null) {
                                res.send("Error al crear invitacion");
                            } else {
                                res.redirect("/usuarios"+"?mensaje=Solicitud enviada");
                            }
                        });
                    }
                });
            }else res.redirect("/usuarios"+"?mensaje=El usuario ya es tu amigo,o alguno de los dos ya lo ha solicitado"+"&tipoMensaje=alert-danger ");
        });


    });
    /*Función para comprobar que es posible enviar una invitación*/
    function invitacionPosible(receptor,solicitante, functionCallback) {
        if(receptor != solicitante) {
            let criterio = {$or: [{receptor: receptor,solicitanteEmail: solicitante},
                    {receptor: solicitante, solicitanteEmail: receptor}]};
            gestorBD.obtenerInvitaciones(criterio,function(invitaciones){
                if(invitaciones==null || invitaciones.length==0){
                    let criterio = {$or: [{amigo1: receptor,amigo2: solicitante},
                            {amigo1: solicitante, amigo2: receptor}]};
                    gestorBD.obtenerAmistades(criterio,function(amistades){
                        if(amistades==null || amistades.length==0){
                            functionCallback(true);
                        }else functionCallback(false);
                    })
                }else functionCallback(false);
            })
        }
        else functionCallback(false);
    }
    /* GET de listar invitaciones*/
    app.get("/invitaciones", function (req, res) {
        let criterio = {receptor: req.session.usuario};

        let pg = parseInt(req.query.pg); // EsString !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerInvitacionesPg(criterio, pg, function (invitaciones, total) {
            if (invitaciones == null) {
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

                let respuesta = swig.renderFile('views/binvitaciones.html', {
                    invitaciones: invitaciones,
                    paginas: paginas,
                    actual: pg,
                    session: req.session !== null,
                    session_user: req.session.usuario
                });
                res.send(respuesta);
            }
        });

    });

    /* GET de aceptar invitacion*/
    app.get('/invitacion/aceptar/:id', function (req, res) {
        let invitacionId = gestorBD.mongo.ObjectID(req.params.id);
        let criterio = {_id: invitacionId};

        gestorBD.obtenerInvitaciones(criterio, function (invitaciones) {
            if (invitaciones == null || invitaciones.length == 0) {
                res.send("Error al crear amistad");
            } else {
                let amistad = {
                    amigo1: invitaciones[0].receptor,
                    amigo2: invitaciones[0].solicitanteEmail,
                };
                gestorBD.insertarAmistad(amistad, function (idAmistad) {
                    if (idAmistad == null) {
                        res.send("Error al crear amistad");
                    } else {

                        gestorBD.eliminarInvitaciones(criterio, function (resultado) {
                            if (resultado == null) {
                                res.send(resultado);
                            } else {
                                res.redirect("/invitaciones"+"?mensaje=¡Amigo añadido!");
                            }
                        });

                    }
                });
            }
        });

    });
    /* GET de rechazar invitación*/
    app.get('/invitacion/rechazar/:id', function (req, res) {
        let invitacionId = gestorBD.mongo.ObjectID(req.params.id);
        let criterio = {_id: invitacionId};
        gestorBD.eliminarInvitaciones(criterio, function (resultado) {
            if (resultado == null) {
                res.send(resultado);
            } else {
                res.redirect("/invitaciones"+"?mensaje=Solicitud rechazada");
            }
        });
    });
    /* GET de listar amigos*/
    app.get("/amigos", function (req, res) {
        let criterio = { $or: [{amigo1 : req.session.usuario},{amigo2 : req.session.usuario}]};

        let pg = parseInt(req.query.pg); // EsString !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerAmistadesPg(criterio, pg, function (amistades, total) {
            if (amistades == null) {
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
                if (amistades.length > 0) {
                    let amigos = amistades.map(function (x) {
                        if (x.amigo1 != req.session.usuario) return x.amigo1;
                        else return x.amigo2;
                    });

                    criterio = {email: {$in: amigos}};
                    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                        if (usuarios == null || usuarios.length == 0) {
                            res.send(usuarios)
                        } else {
                            for (var usuario of usuarios) {
                                delete usuario['password'];
                            }

                            let respuesta = swig.renderFile('views/bamigos.html', {
                                amigos: usuarios,
                                paginas: paginas,
                                actual: pg,
                                session: req.session !== null,
                                session_user: req.session.usuario
                            });
                            res.send(respuesta);
                        }
                    });

                }
                else{
                    let respuesta = swig.renderFile('views/bamigos.html', {
                        amigos: [],
                        paginas: paginas,
                        actual: pg,
                        session: req.session !== null,
                        session_user: req.session.usuario
                    });
                    res.send(respuesta);
                }
            }
        });

    });
    /* GET de eliminar amistad*/
    app.get('/amigos/eliminar/:email', function (req, res) {
        let criterio = {$or: [{amigo1: req.params.email,amigo2: req.session.usuario},
                {amigo1: req.session.usuario, amigo2: req.params.email}]};
        gestorBD.eliminarAmistad(criterio, function (amistad) {
            if (amistad == null) {
                res.send(respuesta);
            } else {
                res.redirect("/amigos"+"?mensaje=Amigo eliminado");
            }
        });
    });


    //GET para reiniciar datos de los tests
    app.get('/reiniciar', function (req, res) {
        let invitacionId = gestorBD.mongo.ObjectID(req.params.id);
        let criterio = {amigo1: "prueba1@prueba1.com", amigo2: "p1@p1.com"};
        gestorBD.eliminarAmistad(criterio, function (resultado) {
            if (resultado == null) {
                res.send(resultado);
            } else {
                criterio = {email: "p1@p1.com"};
                gestorBD.eliminarUsuarios(criterio, function (resultado) {
                    if (resultado == null) {
                        res.send(resultado);
                    } else {
                        res.redirect("/identificarse");
                    }
                })
            }
        });
    });


    app.get('/mensajes', function (req, res) {
        //let criterio = {emisor: req.params.email,destinatario: req.session.usuario};
        let criterio = { $or: [{amigo1 : req.session.usuario},{amigo2 : req.session.usuario}]};

        let pg = parseInt(req.query.pg); // EsString !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerAmistadesPg(criterio, pg, function (amistades, total) {
            if (amistades == null) {
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
                if (amistades.length > 0) {
                    let amigos = amistades.map(function (x) {
                        if (x.amigo1 != req.session.usuario) return x.amigo1;
                        else return x.amigo2;
                    });

                    criterio = {email: {$in: amigos}};
                    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                        if (usuarios == null || usuarios.length == 0) {
                            res.send(usuarios)
                        } else {
                            for (var usuario of usuarios) {
                                delete usuario['password'];
                            }
                            let mensajes = [];
                            for (var usuario of usuarios) {
                            let criterio2 = {emisor: req.session.usuario,destino: usuario.email};
                            gestorBD.obtenerMensajes(criterio2, function (mns) {

                                mensajes.push({amigo: usuario.email ,mensajes: mns.length});
                            });
                        }
                            let respuesta = swig.renderFile('views/bmensajes.html', {
                                amigos: mensajes,
                                paginas: paginas,
                                actual: pg,
                                session: req.session !== null,
                                session_user: req.session.usuario
                            });
                            res.send(respuesta);
                        }
                    });

                }
                else{
                    let respuesta = swig.renderFile('views/bamigos.html', {
                        amigos: [],
                        paginas: paginas,
                        actual: pg,
                        session: req.session !== null,
                        session_user: req.session.usuario
                    });
                    res.send(respuesta);
                }
            }
        });
    });

}







