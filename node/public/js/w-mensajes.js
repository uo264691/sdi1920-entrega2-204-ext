window.history.pushState("", "", "/cliente.html?w=mensajes");
/*
* Recoger los mensajes de la conversación
* */
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
			console.log("Mensajes actualizados");
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}
/*
* Actualiza los mensajes en la pantalla
* */
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
/*
* Enviar mensaje al usuario de la conversacion abierta
* */
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
			console.log("Mensaje enviado");
		},
		error: function (error) {
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

/*
* Marcar mensajes como leidos
* */
function marcarLeidos() {
	$.ajax({
		url: URLbase + "/privado/leermensaje",
		type: "PUT",
		data: {'conversador': usuarioSeleccionado},
		dataType: 'json',
		headers: {"token": token},
		success: function (response) {
			console.log("Mensajes marcados como leidos");
		},
		error: function (error) {
			console.log(error);
			$("#contenedor-principal").load("widget-login.html");
		}
	});
}

cargarMensajes();
/* Actualiza los mensajes cada 3 segundos*/
setInterval(function () {
	if(window.location.search==="?w=mensajes"){
		cargarMensajes(mensajes);
	}

}, 3000);