
/**
 * Codigo javscript para autenticar a un usuario mediante la API de Microsoft
 *
 */

// CONSTANTES DE CONFIGURACION DE LA API DE MICROSOFT
var APP_CLIENT_ID = "00000000400EAA45";
var REDIRECT_URL = "simplePlayer.html";


// Inicializamos la API cada ves que se carga la pagina web
$(document).ready(function()
{
    WL.init({
        client_id: APP_CLIENT_ID,
        redirect_uri: REDIRECT_URL
    });
})

// Esta funcion se ejecuta al hacer click en el boton 'Iniciar sesion'
function loginUser()
{
    WL.login
    ({
        scope: ["wl.signin", "wl.basic", "wl.emails"]
    }).then
    (
        function (session)
        {
            console.log("Ahora estas logueado");
            getEmail(session);
        },
        function (sessionError)
        {
            console.log("Ocurrio un error al tratar de loguearte");
        }
    )
}

// Esta funcion se ejecuta con el boton 'Cerrar Sesion'
function closeSession()
{
    WL.logout();
    console.log("Se ah cerrado tu sesion");
}
