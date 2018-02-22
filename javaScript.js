/**@description monto los eventos al cargar la pagina
 * 
 * 
 */
$(document).ready(function () {
    montaJson($('#opciones').val());

    $('.dos').hide();

    $('.BtnCerrar').on('click', function () {
        $('.informacion')[0].style.display = "none";
        $('#formulario').show();
        $('#charts')[0].style.display = "none";
        $('.dos').hide();
        $('.uno').show();
        $('.uno').empty();

        //limpio formulario
        $('#TbNombre').val("");
        $('#TbTelefono').val("");
        $('#TbEmail').val("");
        $('#TbPuntos').val("");
        $('#tituloPelicula').val("");
        $('#TbLocalidad').val("");
        $('#TbNombre').removeAttr("Style");
        $('#TbTelefono').removeAttr("Style");
        $('#TbEmail').removeAttr("Style");
        $('#TbPuntos').removeAttr("Style");
    });

    $('.titulo1').on('click', function () {
        $('.uno').slideToggle();
        $('.dos').slideUp(400);
    });

    $('.titulo2').on('click', function () {
        $('.dos').slideToggle();
        $('.uno').slideUp(400);
    });

    $('#BtnGuardar').on('click', function () {
        guardarLocalStorage();
    });

    $('#eleccion').on('change', function () {
        select = $(this).val();
    });

    $('#opciones').on('change', function () {
        montaJson($('#opciones').val());
    });

    google.charts.load('current', {
        packages: ['corechart']
    });
})

/**
 * @description monto los elementos 
 * @param {type} mostrar pasa el valor del select
 * @returns {nada}
 */
function montaJson(mostrar) {
    var num = parseInt($('#NumOpciones').val());
    if (num > 0 && num < 21) {
        var marvelAPIComics = 'https://gateway.marvel.com/v1/public/comics?limit='+num+'&apikey=9128f80f887f2060a7a7ee8519e4ace6';
        var marvelAPIPersonajes = 'https://gateway.marvel.com/v1/public/characters?limit='+num+'&apikey=9128f80f887f2060a7a7ee8519e4ace6';
        $('#spiner').show();
        $('#resultado').empty();
        if (mostrar == 1) { //comics

            $.ajax({
                method: "GET",
                url: marvelAPIComics,
                success: function (response) {
                    var results = response.data.results;
                    var resultsLen = results.length;
                    var nodo;
                    var imgPath;
                    var descripcion;

                    for (var i = 0; i < resultsLen; i++) {
                        if (results[i].images.length > 0) {
                            imgPath = results[i].thumbnail.path + '/standard_xlarge.' + results[i].images[0].extension;
                            descripcion = results[i].Description;

                            if (descripcion == "" || descripcion == undefined || descripcion == null) {
                                descripcion = "Sin Descripción";
                            }

                            if (descripcion.indexOf('"') == 0) {
                                descripcion = descripcion.replace('\"', ' ')
                            }

                            nodo = `<div class="Panel sombra">
                                <h2>${results[i].title}</h2>
                                <img class="comic" src="${imgPath}">                                
                                <input type="button" value="Ver mas" class="botonMotrar">
                           </div>`;
                        } else {
                            imgPath = results[i].thumbnail.path + '/standard_xlarge.' + results[i].thumbnail.extension;
                            descripcion = results[i].variantDescription;

                            if (descripcion == "" || descripcion == undefined || descripcion == null) {
                                descripcion = "Sin Descripción";
                            }

                            if (descripcion.indexOf('"')) {
                                descripcion = descripcion.replace('\"', ' ')
                            }

                            nodo = `<div class="Panel sombra" patata='${descripcion}'>
                                <h2>${results[i].title}</h2>
                                <img class="comic" src="${imgPath}">                                
                                <input type="button" value="Ver mas" class="botonMotrar">
                           </div>`;
                        }

                        $('.botonMotrar').on('click', function () {
                            rellenarInformacion($(this).parent());
                            $('#tituloPelicula').focus().delay(800);

                            var datos = $('.algo');
                            for (var i = 1; i < datos.length; i++) {
                                datos[i].remove();
                            }
                        });

                        $('#resultado').append(nodo);
                    }
                    $('#spiner').hide();
                },
                error: function () {
                    alert('Hemos tenido un problema, Pruebe otra vez');
                }
            });
        }

        if (mostrar == 2) { //personajes        
            $.ajax({
                method: "GET",
                url: marvelAPIPersonajes,
                beforesend: function () {
                    $('#spiner').attr("style", "display:block");
                },
                complete: function () {
                    $('#spiner').attr("style", "display:none");
                },
                success: function (response) {
                    var results = response.data.results;
                    var resultsLen = results.length;
                    var nodo;
                    var imgPath;
                    var descripcion;

                    for (var i = 0; i < resultsLen; i++) {
                        imgPath = results[i].thumbnail.path + '/standard_xlarge.' + results[i].thumbnail.extension;
                        descripcion = results[i].description;

                        if (descripcion == "") {
                            descripcion = "Sin Descripción";
                        }

                        nodo = `<div class="Panel sombra" patata="${descripcion}">
                                <h2>${results[i].name}</h2>                                
                                <img src="${imgPath}">             
                                <input type="button" value="Ver mas" class="botonMotrar">
                           </div>`;

                        $('#resultado').append(nodo);
                    }

                    $('.botonMotrar').on('click', function () {
                        rellenarInformacion($(this).parent());
                        $('#tituloPelicula').focus().delay(800);
                    });
                },
                error: function () {
                    alert('Hemos tenido un problema, Pruebe otra vez');
                }
            });
        }
    } else {
        alert('Numero de elementos no disponibles, entro 1 y 20')
    }
}

/**
 * @description al clicar recojo el div donde pudeo recoger la informacion
 * @param {type} elementoElegido
 * @returns {nada}
 */
function rellenarInformacion(elementoElegido) {
    $('.uno').show();

    var nombre = $(elementoElegido).find('h2').text();
    $('#tituloPelicula').text(nombre);

    var imagen = $(elementoElegido).find('img').attr('src');
    var descripcion = $(elementoElegido).attr('patata');

    //muevo el foco a la ventana sacada
    var focalizar = $('#tituloPelicula').position().top;
    $('html,body').animate({
        scrollTop: focalizar
    }, 500);

    //muestro el cuadro
    $('.informacion')[0].style.display = "block";

    var dato = ` <div class="algo">   
            <img id="cartel" src="${imagen}" alt="Portada" />
            <p class="info" title="Información de la pelicula">
                <span tabindex="0" class="oscuro">Descripción:</span>
                <span id="CuadroDescripcion">${descripcion}</span>
            </p></div> `;
    $('.uno').append(dato)

}
/**
 * @description valído los datos del formulario y guardo el local storage
 * @returns {nada}
 */
function guardarLocalStorage() {
    var nombre = $('#TbNombre').val();
    var telefono = $('#TbTelefono').val();
    var email = $('#TbEmail').val();
    var puntos = parseInt($('#TbPuntos').val());
    var Npelicula = $('#tituloPelicula').text();
    var validar = true;

    $('#TbNombre').removeAttr("Style");
    $('#TbTelefono').removeAttr("Style");
    $('#TbEmail').removeAttr("Style");
    $('#TbPuntos').removeAttr("Style");

    switch (true) {
        case nombre == "":
            alert("Nombre erroneo");
            $('#TbNombre').attr('Style', 'background-Color: rgba(255,0,0,0.7); border: 2px solid red')
            $('#TbNombre').focus();
            validar = false;
            break;
        case (telefono == "" || telefono.length < 9):
            alert("Telefono incorrecto");
            $('#TbTelefono').attr('Style', 'background-Color: rgba(255,0,0,0.7); border: 2px solid red')
            $('#TbTelefono').focus();
            validar = false;
            break;
        case email.indexOf('@') == - 1:
            alert("Email incorrecto");
            $('#TbEmail').attr('Style', 'background-Color: rgba(255,0,0,0.7); border: 2px solid red')
            $('#TbEmail').focus();
            validar = false;
            break;
        case (puntos < 1 && puntos > 10 && puntos == NaN):
            alert("Puntos incorrectos del 1 al 10");
            $('#TbPuntos').attr('Style', 'background-Color: rgba(255,0,0,0.7); border: 2px solid red')
            $('#TbPuntos').focus();
            validar = false;
            break;
    }
    if (validar) {
        if (localStorage.getItem(Npelicula) != null) {
            var datoExistente = localStorage.getItem(Npelicula);
            localStorage.setItem(Npelicula, localStorage.getItem(Npelicula) + parseInt(puntos));
        } else {
            localStorage.setItem(Npelicula, puntos);
            localStorage.setItem("Usuario", nombre + ";" + telefono + ";" + email);
        }
        google.charts.setOnLoadCallback(dibujar);
    }
}

/**
 * @description monto la grafica SVG y con el select obtengo el tipo de grafica
 * @returns {nada}
 */
function dibujar() {
    var data = new google.visualization.DataTable();
    var select = $('#eleccion')[0];

    $('#formulario').hide();
    $('#charts')[0].style.display = "block";
    $('#charts').focus();

    data.addColumn('string', 'Películas');
    data.addColumn('number', 'Puntuación');

    var opciones = {
        'title': 'Puntuaciones:',
        'width': '600',
        'height': '300'
    };

    for (var a = 0; a < localStorage.length; a++) {
        var nombre = localStorage.key(a);
        var puntos = parseInt(localStorage.getItem(nombre));
        data.addRows([[nombre, puntos]]);
    }

    var chart;
    if ($('#char').val() == 1) {
        chart = new google.visualization.AreaChart(document.getElementById('charts'));
    } else {
        chart = new google.visualization.PieChart(document.getElementById('charts'));
    }
    chart.draw(data, opciones);
}