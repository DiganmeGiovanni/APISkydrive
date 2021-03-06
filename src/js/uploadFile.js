/**
 *  @created on: 15 de Diciembre del 2013
 *  Codigo javascript para cargar un archivo a skydrive
 */
 
// Inicializamos los parametros de la libreria:
WL.init({
    client_id: "00000000400EAA45",
    redirect_uri: "loadFile.html"
});

$(document).ready(function()
{
    // Mostramos el boton "Save to skydrive" con los estilos de microsoft
    WL.ui
    ({
        name: "skydrivepicker",
        element: "upload-button",
        mode: "save",
        onselected: handleUpload,
        onerror: handleError
    });
});

// Administra la carga del archivo a skydrive
function handleUpload(response)
{
    var folder = response.data.folders[0];
    WL.upload({
        path: folder.id,
        element: "file-to-upload",
        overwrite: 'rename'
    }).then(
        function(response){
            $("#info").html("<span>Genial, se ah cargado el archivo</span>");
        },
        function(error){
            $("#info").html(error.error.message);
        },
        function(progress){
            // Administrar el progreso de la carga
        }
    );
}

// Administra lo que pasa en caso de algun error fatal.
function handleError(response)
{
    $("#info").html(response.error.message);
}
