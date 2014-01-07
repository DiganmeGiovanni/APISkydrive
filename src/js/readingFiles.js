
/**
 *  @created on: 02 de Enero del 2014 // Primer programa del anio :)
 *  Codigo javascript para analizar los archivos del skydrive de un usuario
 */

// Inicializamos los parametros de la libreria
WL.init({
    client_id: "00000000400EAA45",
    redirect_uri: "readingFilesInfo.html"
});

// Muestra archivos y folders de una carpeta de skydrive
// en caso de que el parametro sea null, mostrara los de la raiz
function listarArchivos(folderID) 
{
    var files_path = folderID;
    if (folderID === null)
    {
        files_path = "me/skydrive/files";
    }
    
    WL.api({
        path: files_path,
        method: "GET"
    }).then(
        function (response) {
            var archivos = [];
            for (var i = 0; i < response.data.length; i++) 
            {
                archivos.push(response.data[i].type + " ---> " + response.data[i].name);
            }
            mostrarLista(archivos);
        },
        function (response) {
            console.log("Ocurrio un error al tratar de acceder a los datos");
        }
    )
}

// Muestra todos los folders de un usuario
function listarFolders()
{
    var files_path = "me/skydrive/files";
    WL.api({
        path: files_path,
        method: "GET"
    }).then(
        function (response) 
        {
            var folders = [];
            for (var i=0; i<response.data.length; i++) 
            {
                if (response.data[i].type === "folder")
                {
                    folders.push(response.data[i].name);
                };
            };
            mostrarLista(folders);
        },
        function (response) {
            console.log("No se pudieron obtener los folders");
        }
    )
}

// Muestra un file-picker de skydrive y permite seleccionar un folder
// posteriormente lista los archivos encontrados dentro de este folder
function listarUnFolder()
{
    WL.fileDialog({
        mode: 'open',
        select: 'single'
    }).then(
        function (response) {
            var selectedFolder = response.data.files[0].id;
            var pathFolder = "/me/skydrive.files/" + selectedFolder;
        }
    )
}

// Muestra en la pagina una lista de datos como respuesta para el usuario.
function mostrarLista(lista) 
{
    for (var i = 0; i < lista.length; i++) 
    {
        $('#info').append("<span>" + lista[i] + "</span><br />");
    };
}

// Inicia la sesion de un usuario
function loginUser()
{
    WL.login
    ({
        scope: ["wl.signin", "wl.skydrive", "wl.emails"]
    }).then
    (
        function (session)
        {
            console.log("Ahora estas logueado");
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