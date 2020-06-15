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
	for (let i = 0; i < mensajesMostrar.length; i++) {
		if (mensajesMostrar[i].emisor !== usuarioSeleccionado) {
			$("#divMensajes").append("<p class='msg mensajeUsuario'>" + mensajesMostrar[i].texto + "</p>");
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

cargarMensajes();
setInterval(function () {
	if(window.location.search==="?w=mensajes")
		cargarMensajes(mensajes);
}, 5000);