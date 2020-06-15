window.history.pushState("", "", "/cliente.html?w=amigos");

amigos = [];

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
			actualizarTabla(amigos);
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

function actualizarTabla(usuariosMostrar) {
	$("#tablaCuerpo").empty(); // Vaciar la tabla
	for (let i = 0; i < usuariosMostrar.length; i++) {
		$("#tablaCuerpo").append(
			"<tr id=" + usuariosMostrar[i]._id + " class=filaAmigo>" +
			"<td><a onclick=mensajes('"+ usuariosMostrar[i].email +"')>" +
					usuariosMostrar[i].name + "</a></td>" +
			"<td>" + usuariosMostrar[i].lastname + "</td>" +
			"<td>" + usuariosMostrar[i].email + "</td>" +
			"</tr>");
	}
}

function mensajes(email) {
	usuarioSeleccionado = email;
	$("#contenedor-principal").load("widget-mensajes.html");
}

cargarUsuarios();
/*setInterval(function () {
	cargarusuarios();
}, 5000);
*/

