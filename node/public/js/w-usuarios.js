window.history.pushState("", "", "/cliente.html?w=amigos");

amigos = [];
nuevosMensajes =0;

$('#filtroNombre').on('input', function (e) {
	var usuariosFiltrados = [];
	var nombreFiltro = $("#filtroNombre").val().toLowerCase();
	for (i = 0; i < amigos.length; i++) {
		if (amigos[i].name.toLowerCase().indexOf(nombreFiltro) != -1) {
			usuariosFiltrados.push(amigos[i]);
		}
	}
	actualizarTabla(usuariosFiltrados);
});

function cargarUsuarios() {
	$.ajax({
		url: URLbase + "/privado/amigo",
		type: "GET",
		data: {},
		dataType: 'json',
		headers: {"token": token},
		success: function (respuesta) {
			amigos = respuesta;
			console.log(amigos);
			$("#tablaCuerpo").empty(); // Vaciar la tabla
			actualizarTabla(amigos);
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

/*function mensajesNuevos(usuario) {

	$.ajax({
		url: URLbase + "/privado/mensajesnuevos",
		type: "GET",
		data: {'conversador': usuario},
		dataType: 'json',
		processData: true,
		headers: {token: token},
		success: function (respuesta) {
			nuevosMensajes = respuesta;
			console.log(respuesta);

		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}*/

/*function actualizarTabla(usuariosMostrar) {
	$("#tablaCuerpo").empty(); // Vaciar la tabla
	for (let i = 0; i < usuariosMostrar.length; i++) {
		console.log("aaaa");
		mensajesNuevos(usuariosMostrar[i].email);
		console.log("bbbb");
		$("#tablaCuerpo").append(
			"<tr id=" + usuariosMostrar[i]._id + " class=filaAmigo>" +
			"<td><a onclick=mensajes('"+ usuariosMostrar[i].email +"')>" +
					usuariosMostrar[i].name + "</a></td>" +
			"<td>" + usuariosMostrar[i].lastname + "</td>" +
			"<td>" + usuariosMostrar[i].email + "</td>" +
			"<td>" + nuevosMensajes + "</td>" +
			"</tr>");
	}
}*/
function actualizarTabla(usuariosMostrar) {
	$("#tablaCuerpo").empty(); // Vaciar la tabla
	for (let i = 0; i < usuariosMostrar.length; i++) {
	$.ajax({
		url: URLbase + "/privado/mensajesnuevos",
		type: "GET",
		data: {'conversador': usuariosMostrar[i].email},
		dataType: 'json',
		processData: true,
		headers: {token: token},
		success: function (respuesta) {
			nuevosMensajes = respuesta;
			console.log(respuesta);
			$("#tablaCuerpo").append(
				"<tr id=" + usuariosMostrar[i]._id + " class=filaAmigo>" +
				"<td><a onclick=mensajes('"+ usuariosMostrar[i].email +"')>" +
				usuariosMostrar[i].name + "</a></td>" +
				"<td>" + usuariosMostrar[i].lastname + "</td>" +
				"<td>" + usuariosMostrar[i].email + "</td>" +
				"<td>" + nuevosMensajes + "</td>" +
				"</tr>");

		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});

	}
}

function mensajes(email) {
	usuarioSeleccionado = email;
	$("#contenedor-principal").load("widget-mensajes.html");
}

cargarUsuarios();
/*setInterval(function () {
	cargarUsuarios();
}, 5000);*/


