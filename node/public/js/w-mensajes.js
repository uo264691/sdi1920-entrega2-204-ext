window.history.pushState("", "", "/cliente.html?w=mensajes");

function cargarMensajes() {
	$("#conversador").text(usuarioSeleccionado);
	$.ajax({
		url: URLbase + "/privado/mensaje",
		type: "GET",
		data: {'conversador': usuarioSeleccionado},
		dataType: 'json',
		processData: true,
		headers: {token: token},
		success: function (respuesta) {
			mensajes = respuesta;
			actualizarMensajes(respuesta);
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

function actualizarMensajes(mensajesMostrar) {
	$("#divMensajes").empty(); // Vaciar la tabla
	marcarLeidos();
	for (let i = 0; i < mensajesMostrar.length; i++) {
		if (mensajesMostrar[i].emisor !== usuarioSeleccionado) {
			$("#divMensajes").append("<p class='msg mensajeUsuario'>" + mensajesMostrar[i].texto + (mensajesMostrar[i].leido ? ' ✔(leido)' : '')+ "</p>");
		} else {
			$("#divMensajes").append("<p class='msg mensajeConversador'>" + mensajesMostrar[i].texto + "</p>");
		}
	}
}

function enviarMensaje() {
	let mensaje = $("#areaMensaje").val();
	$("#areaMensaje").val("");
	$.ajax({
		url: URLbase + "/privado/mensaje",
		type: "POST",
		data: {'destino': usuarioSeleccionado, 'texto':mensaje},
		dataType: 'json',
		processData: true,
		headers: {token: token},
		success: function (respuesta) {
			cargarMensajes();
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}
function marcarLeidos() {
	$.ajax({
		url: URLbase + "/privado/leermensaje",
		type: "PUT",
		data: {'conversador': usuarioSeleccionado},
		dataType: 'json',
		headers: {"token": token},
		success: function (response) {
			console.log("Mensaje marcado como leido");
		},
		error: function (error) {
			console.log(error);
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

cargarMensajes();
setInterval(function () {
	if(window.location.search==="?w=mensajes"){
		cargarMensajes(mensajes);
	}

}, 3000);