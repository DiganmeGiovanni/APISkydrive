
/**
  *  Codigo javascript para conectar con las APIs de Skydrive
  */


// CONSTANTES:
var APP_CLIENT_ID = "00000000400EAA45";
var REDIRECT_URL = "http://transferoncloud.com/APISkydrive/src/index.html";

$(document).ready(function()
{
	//WL.Event.subscribe("auth.login", onLogin); // Suscribe un escuchador de evento
	WL.init({
		client_id: APP_CLIENT_ID,
        redirect_uri: REDIRECT_URL,
        scope: "wl.signin",
        response_type: "token"
	});
})

/**
 *  @Deprecated, util solocon el escuchador de evento
 */
function onLogin(session)
{
	if (!session.error)
	{
		WL.api({
			path: "me",
			method: "GET"
		}).then(
			function(response) {
				document.getElementById("info").innerText = "Hola, " + response.first_name + " " + response.last_name + "!";
			},
			function(responseFailed){
				document.getElementById("info").innerText = "Error calling API: " + responseFailed.error.message;
			}
		);
	}
	else {
		document.getElementById("info").innerText = "Error signing in: " + session.error_description;
	}
}

/** Esta funcion es ejecutada por el boton: iniciarSesion */
function logear()
{
	WL.login
	({
        scope: ["wl.signin", "wl.basic"]
    }).then
    (
        function (session) 
        {
            document.getElementById("info").innerText = "Signed in. Gio :)";
        },
        function (sessionError) 
        {
            document.getElementById("info").innerText = 
                "Error signing in: " + sessionError.error_description;
        }
    );
}