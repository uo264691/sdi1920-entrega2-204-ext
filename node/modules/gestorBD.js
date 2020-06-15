module.exports = {
	mongo: null, app: null, init: function (app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
	obtenerUsuariosPg: function (criterio, pg, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('usuarios');
				collection.count(function (err, count) {
					collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function (err, usuarios) {
						if (err) {
							funcionCallback(null);
						} else {
							funcionCallback(usuarios, count);
						}
						db.close();
					});
				});
			}
		});
	},
	insertarInvitacion: function (invitacion, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('invitaciones');
				collection.insert(invitacion, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	obtenerInvitacionesPg: function (criterio, pg, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('invitaciones');
				collection.count(function (err, count) {
					collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function (err, invitaciones) {
						if (err) {
							funcionCallback(null);
						} else {
							funcionCallback(invitaciones, count);
						}
						db.close();
					});
				});
			}
		});
	},
	eliminarInvitaciones: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('invitaciones');
				collection.remove(criterio, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	obtenerUsuarios: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('usuarios');
				collection.find(criterio).toArray(function (err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	insertarAmistad: function (amistad, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('amistades');
				collection.insert(amistad, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	eliminarAmistad: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('amistades');
				collection.remove(criterio, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	obtenerInvitaciones: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('invitaciones');
				collection.find(criterio).toArray(function (err, invitaciones) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(invitaciones);
					}
					db.close();
				});
			}
		});
	}, insertarUsuario: function (usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('usuarios');
				collection.insert(usuario, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	obtenerAmistadesPg: function (criterio, pg, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('amistades');
				collection.count(function (err, count) {
					collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function (err, amistades) {
						if (err) {
							funcionCallback(null);
						} else {
							funcionCallback(amistades, count);
						}
						db.close();
					});
				});
			}
		});
	},
	obtenerAmistades: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('amistades');
				collection.find(criterio).toArray(function (err, amistades) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(amistades);
					}
					db.close();
				});
			}
		});
	},eliminarUsuarios: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('usuarios');
				collection.remove(criterio, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	obtenerMensajes: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('mensajes');
				collection.find(criterio).toArray(function (err, mensajes) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(mensajes);
					}
					db.close();
				});
			}
		});
	},
	mandarMensaje: function (mensaje, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('mensajes');
				collection.insert(mensaje, function (err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	leerMensaje: function (criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('mensajes');
				collection.updateOne(criterio, {$set: {"leido": true}},null,function (err) {
					if (err) {
						funcionCallback(false);
					} else {
						funcionCallback(true);
					}
					db.close();
				});
			}
		});
	},
}
;