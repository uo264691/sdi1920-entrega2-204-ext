window.history.pushState("", "", "/cliente.html?w=login");
$("#boton-login").click (function() {
	$.ajax ({
		url: URLbase + "/autenticar",
		type: "POST",
		data: {
			email : $("#email").val(),
			password : $("#password").val()
		},
		dataType: 'json',
		success: function(respuesta) {
			token = respuesta.token;
			Cookies.set('token', respuesta.token);
			$( "#contenedor-principal" ).load( "widget-usuarios.html");
		},
		error: function (error) {
			Cookies.remove('token');
			$("#widget-login")
				.prepend("<div class='alert alert-danger'>Usuario o contraseña incorrectos</div>");
		}
	});
});