
/**
 * Codigo javscript para autenticar a un usuario mediante la API de Microsoft
 *
 */
 
WL.init({
   client_id: "00000000400EAA45",
   redirect_uri: "player.html"
});

$(document).ready(function(){
    if (!WL.session)
    {
        loginUser();
    };
})

var playlist = [];
var indexCurrentSong = -1;

// Permite seleccionar un folder de skydrive y posteriormente llama a la funcion
// encolarPistas sobre este folder.
function agregarFolder() 
{
    WL.fileDialog({
        mode: 'save',
        select: 'single'
    }).then(
        function (response)
        {
            var filesPath = response.data.folders[0].id + "/files";
            encolarPistas(filesPath);
        },
        function (error_response)
        {
            alert("Debes seleccionar un folder para agregar pistas");
        }
    )
}

// Agrega las pistas encontradas en la ruta dada al arreglo 'playlist'
function encolarPistas(filesPath)
{
    WL.api({
        path: filesPath,
        method: "GET"
    }).then(
        function (response) 
        {
            for (var i = 0; i < response.data.length; i++) 
            {
                if (response.data[i].type === "audio")
                {
                    var song = {
                        title: response.data[i].title,
                        artist: response.data[i].artist,
                        album: response.data[i].album,
                        duration: response.data[i].duration,
                        genre: response.data[i].genre,
                        source: response.data[i].source
                    }
                    playlist.push(song);
                    $("#playlist").append("<span id=\"song-" + playlist.length + "\">" + playlist.length + ". " + song.title + "</span><br>");
                };
            };
            if(indexCurrentSong === -1)
            {
                var audio = document.getElementById("audio-player");
                //var audio = $('audio');
                console.log("El audio quedo: " + audio);
                audio.pause();
                audio.src = playlist[0].source;
                indexCurrentSong+=1;
                audio.play();
                console.log("Arrancando playlist en la pista: " + indexCurrentSong);
                destacarPista(1);
            };
        },
        function (error_response) 
        {
            console.log("No se pudieron obtener los datos del folder");
        }
    )
}

// Permite seleccionar archivos para agregarlos a la lista de reproduccion
function agregarArchivos()
{
    WL.fileDialog({
        mode: 'open',
        select: 'multi'
    }).then(
        function (response) {
            for (var i = 0; i < response.data.files.length; i++) 
            {
                if (response.data.files[i].type === "audio")
                {
                    WL.api({
                        path: response.data.files[i].id,
                        method: "GET"
                    }).then(
                        function (response) 
                        {
                            var song = {
                                title: response.title,
                                artist: response.artist,
                                album: response.album,
                                duration: response.duration,
                                genre: response.genre,
                                source: response.source
                            }
                            playlist.push(song);
                            $("#playlist").append("<span id=\"song-" + playlist.length + "\">" + playlist.length + ". " + song.title + "</span><br>");
                            if(indexCurrentSong === -1)
                            {
                                nextSong();
                            };
                        },
                        function (error_response) 
                        {
                            console.log("Ocurrio un error al obtener el archivo");
                        }
                    )
                };
            };
        },
        function (error_response) {
            console.log("Ocurrio un error al agregar archivos");
        }
    )
}

// Reproduce la siguiente pista de audio del playlist (Si hay alguna)
function nextSong() 
{
    if (indexCurrentSong < playlist.length-1)
    {
        var nextSong = playlist[indexCurrentSong+1];
        var audio = document.getElementById("audio-player");
        if (!audio.paused) { audio.pause() };
        audio.src = nextSong.source;
        audio.play();
        indexCurrentSong++;
        destacarPista(indexCurrentSong + 1);
        //console.log("Resproduciendo pista: " + indexCurrentSong + ". " + nextSong.title);
    }
}

// Reproduce la pista anterior del playlist (Si esta disponible)
function prevSong() {
    if (indexCurrentSong > 0)
    {
        var prevSong = playlist[indexCurrentSong-1];
        var audio = document.getElementById("audio-player");
        if (!audio.paused) { audio.pause() };
        audio.src = prevSong.source;
        audio.play();
        indexCurrentSong--;
        destacarPista(indexCurrentSong + 1);
        //console.log("Resproduciendo pista: " + indexCurrentSong + ". " + prevSong.title);
    };
}

// Marca con color rojo la pista especificada.
// el resto de pistas, se marcan de color negro.
// util para marcar la pista que se reproduce actualmente
function destacarPista(indexOnPlaylist)
{
    for (var i = 1; i<=playlist.length; i++) 
    {
        var id_song = "#song-" + i;
        $(id_song).css("color", "black");
    };
    var id = "#song-" + indexOnPlaylist;
    $(id).css("color", "red");
}

// Muestra una lista con las canciones del arreglo 'playlist'
function actualizarPlaylist() 
{
    $("#playlist").empty();
    for (var i = 0; i < playlist.length; i++) 
    {
        $("#playlist").append("<span>" + playlist[i].title + "</span><br>")
    };   
}


// Esta funcion se ejecuta al hacer click en el boton 'Iniciar sesion'
function loginUser()
{
    WL.login
    ({
        scope: ["wl.signin", "wl.skydrive", "wl.emails"]
    }).then
    (
        function (session)
        {
            // Login exitoso
            console.log("Ahora estas logueado");
        },
        function (sessionError)
        {
            console.log("Ocurrio un error al tratar de loguearte");
        }
    )
}

// Esta funcion se ejecuta con el boton 'Cerrar Sesion'
function logoutUser()
{
    WL.logout();
    console.log("Se ah cerrado tu sesion");
}
