
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
// en caso de que el parametro folderID sea null, mostrara los de la raiz
// en caso de que el parametro filtro sea null mostrara todos los archivos.
// los filtros validos son: 'audio', 'folder'
function listarArchivos(folderID, filtro)
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
        function (response) 
        {
            var archivos = [];
            if (filtro === null) // Listar archivos sin filtros
            {
                for (var i = 0; i < response.data.length; i++) 
                {
                    archivos.push(response.data[i].type + " ---> " + response.data[i].name);
                }
            }
            else // Listar archivos utilizando un filtro
            {
                for (var i = 0; i < response.data.length; i++) 
                {
                    if (response.data[i].type === filtro) 
                    {
                        archivos.push(response.data[i].type + " ---> " + response.data[i].name);
                    }
                }
            }
            mostrarLista(archivos);
        },
        function (response) 
        {
            console.log("Ocurrio un error al tratar de acceder a los datos");
        }
    )
}

// Muestra los folders principales de un usuario
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
        mode: 'save',
        select: 'single'
    }).then(
        function (response) 
        {
            var selectedFolder = response.data.folders[0].id;
            var pathFolder = selectedFolder + "/files";
            console.log("INSPECCIONANDO: " + pathFolder);
            listarArchivos(pathFolder, null);
        },
        function (response) 
        {
            console.log("Un error ocurrio con el file-picker");
        }
    )
}

// Analiza un folder y agrega los archivos encontrados al arreglo recivido
// en el parametro 'files', si el parametro filtro es igual a null, se
// agregaran todos los archivos encontrados al arreglo. si el parametro
// recursivo es igual a true, se analizara cada subfolder encontrado.
function encolarArchivos(filtro, recursividad, folderPath, files)
{
    WL.api({
        path: folderPath,
        method: "GET"
    }).then(
        function (response) 
        {
            //var files = [];
            files.push(" ");
            files.push("FOLDER: ------------------")
            for (var i = 0; i < response.data.length; i++) 
            {
                if (recursividad === true && response.data[i].type === "folder") 
                {
                    encolarArchivos(filtro, recursividad, response.data[i].id + "/files", files);
                    //files.concat(folderFiles);
                };
                if (filtro === null)
                {
                    files.push(response.data[i].type + " --> " + response.data[i].name)
                }
                else if (response.data[i].type === filtro)
                {
                    files.push(response.data[i].type + " --> " + response.data[i].name);
                    console.log("Agregado --> " + response.data[i].name);
                }
            }
            console.log("EL ARREGLO CONTIENE: " + files.length + " elementos");
            mostrarLista(files);
        },
        function (error_response) 
        {
            console.log("Ocurrio un error al tratar de crear la lista de archivos");
        }
    );
}

function encolarArtistas(recursividad, folderPath, artistas)
{
    WL.api({
        path: folderPath,
        method: "GET"
    }).then(
        function (response) 
        {
            for (var i = 0; i < response.data.length; i++) 
            {
                if (recursividad === true && response.data[i].type === "folder") 
                {
                    encolarArtistas(recursividad, response.data[i].id + "/files", artistas);
                };
                if (response.data[i].type === "audio" && artistas.indexOf(response.data[i].artist) < 0)
                {
                    artistas.push(response.data[i].artist);
                    console.log("Agregado --> " + response.data[i].name);
                }
            }
            console.log("EL ARREGLO CONTIENE: " + artistas.length + " elementos");
            mostrarLista(artistas);
        },
        function (error_response) 
        {
            console.log("Ocurrio un error al tratar de crear la lista de archivos");
        }
    );
}

// Busca audio dentro del folder y agrega elementos 'audio' para permitir reproducir
// los archivos encontrados.
function encolarAudios(recursividad, folderPath, audios) {
    WL.api({
        path: folderPath,
        method: "GET"
    }).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].type === "audio")
                {
                    audios.push("<audio controls src=\"" + response.data[i].source + "\" >Tu navegador no soporta audio</audio>");
                };
            };
            mostrarLista(audios);
        }
    )
}

// Muestra un file-picker de skydrive, permite seleccionar un forlder
// y lista los archivos de audio encontrados en este.
function listarCanciones() 
{
    WL.fileDialog({
        mode: 'save',
        select: 'single'
    }).then(
        function (response) {
            var selectedFolder = response.data.folders[0].id + "/files";
            listarArchivos(selectedFolder, "audio");
        },
        function (error_response) 
        {
            console.log("Ocurrio un error al seleccionar un folder");
        }
    )
}

// Muestra un file-picker de skydrive, permite seleccionar un folder
// y lista los archivos de audio encontrados en el interior, analiza tambien
// subfolders de cada folder encontrado.
function buscarAudioRecursivo() 
{
    WL.fileDialog
    ({
        mode: 'save',
        select: 'single'
    }).then
    (
        function (response) 
        {
            var selectedFolder = response.data.folders[0].id + "/files";
            var files = [];
            encolarArchivos("audio", true, selectedFolder, files);
            console.log("============= SE DEVOLVIO ===========");
            console.log(files);
            mostrarLista(files);
        },
        function (error_response) 
        {
            console.log("Ocurrio un error al seleccionar un folder");
        }
    )
}

// Analiza recursivamente una carpeta buscando artistas de cada archivo de audio
// Muestra una lista con los artistas encontrados en los 'audio'.
function buscarArtistas() {
    WL.fileDialog({
        mode: 'save',
        select: 'single'
    }).then(
        function (response) 
        {
            var artistas = [];
            encolarArtistas(true, response.data.folders[0].id + "/files", artistas);
            mostrarLista(artistas);
        },
        function (error_response) {
            console.log("Error al elegir un folder");
        }
    );
}

// Permite elegir un folder desde skydrive y permite reproducir las canciones
// encontradas en el folder.
function resproducirFolder() {
    WL.fileDialog({
        mode: 'save',
        select: 'single'
    }).then(
        function (response) 
        {
            var audios = [];
            encolarAudios(false, response.data.folders[0].id + "/files", audios);
        },
        function (error_response) 
        {
            console.log("Error al elegir un folder");
        }
    )
}

// Muestra en la pagina una lista de datos como respuesta para el usuario.
function mostrarLista(lista) 
{
    $('#info').empty();
    console.log("Se listaran: " + lista.length + " datos del arreglo.");
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