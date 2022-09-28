import Game from "./game.js";

let game = new Game();
let tries = 0;

const toggleContainer = document.getElementById('toggle-teclado');
const toggle = document.getElementById('toggle');
const sectionPrincipal = document.getElementById('principal');
const sectionGame = document.getElementById('game');
const keyboard = document.getElementById('teclado-virtual');
const keys = document.getElementsByClassName('key');
const sectionPalabra = document.getElementById('nueva-palabra');
const inputPalabra = document.getElementsByName('palabra')[0];

function changeDisplay(section, display) {//Oculta o muestra los elementos de la seccion recibida
    
    if(display) {
        section.className = 'display-container';//Muestra la seccion

        section.childNodes.forEach(element => {//Muestra los hijos de la seccion
            element.className = 'display-children';
        });
    }

    else {
        section.className = 'container';//Oculta la seccion

        section.childNodes.forEach(element => {//Oculta los hijos de la seccion
            element.className = 'container-children';
        });
    }

}

function resetKeys() {//Reestablece el estilo de las teclas
    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        element.style = '';
    }
    tries = 0;
}

//Valida que los valores ingresados en la pantalla de "Agregar palabra" 
inputPalabra.addEventListener('keydown', (evt) => {
    
    //Permite el uso de las teclas de Home, End, Retroceso y las flechas de navegacion
    if(evt.key == 'Backspace' || 
    evt.key.includes('Arrow') || 
    evt.key == 'End' || 
    evt.key == 'Home') return;
    
    //Si la tecla no es una letra, termina el evento
    if(!/^[a-zA-Z]$/.test(evt.key)){
        evt.preventDefault();
        return;
    }

    //En caso de que la longitud de la palabra ingresada halla llegado al limite, se mostrara una animacion
    if(inputPalabra.value.length == 8){
        evt.preventDefault();
        inputPalabra.value = inputPalabra.value.substring(0, 8);
        document.getElementById('max').animate({color : ['#323232', '#E23E57', '#E23E57'], offset: [0, .1, .8], easing : 'ease-out'},1700);
    }

});


//Establece la funcion que ejecutara cada una de las teclas del teclado virtual
for (let i = 0; i < keys.length; i++) {
    
    const element = keys[i];

    element.onclick = () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key' : element.innerText}));

        if(game.tryCount != tries) {
            element.style.borderColor = '#BE3144';
            element.style.color = '#BE3144'
            tries = game.tryCount;
        } 
        else {
            element.style.borderColor = '#17B794';
            element.style.color = '#17B794'
        }

        if(game.isOver || game.isLost) tries = 0;
    }

}


//Establece la funcion para mostrar o no el teclado virtual
toggle.onclick = () => {
    if(toggle.checked) {
        keyboard.style.display = 'flex';
        return;
    }

    keyboard.style.display = 'none';
};


//Establece la funcion del boton "Iniciar partida"
document.getElementById("init").onclick = () => {
    
    let toast = Swal.mixin({//Creacion de alerta info de teclado virtual
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 8000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseover', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    
    toggleContainer.style.display = 'flex';//Muestra el boton en pantalla

    if(!toggle.checked){//Si el boton no esta seleccionado, muestra la alerta de info
        toast.fire({
            icon: 'info',
            html: 'Puedes utilizar tu teclado fisico o el teclado virtual para jugar.<br><br>Para habilitar el teclado virtual, solo haz click en el boton de la esquina superior derecha &#128512',
            showCloseButton: true
        });
    }

    changeDisplay(sectionPrincipal, false);
    changeDisplay(sectionGame, true);

    game.newGame();

};


//Establece la funcion del boton "Anhadir palabra"
document.getElementById('new-word').onclick = () => {
    
    changeDisplay(sectionPrincipal, false);
    changeDisplay(sectionPalabra, true);

};


//Establece la funcion del boton "Agregar y empezar"
document.getElementById('push-word').onclick = () => {
    let input = inputPalabra.value.toUpperCase();//Obtiene la palabra ingresada
    
    //Si el usuario escribio algun dato, lo añada a la lista de palabras del juego y muestra la pantalla de juego
    if(input!=''){
        game.addWord(input);
        inputPalabra.value = '';
        document.getElementById('cancel').onclick();
        document.getElementById("init").onclick();
        return;
    }

    //En caso de no haber ingresado nada, le mostrara una animacion al usuario
    inputPalabra.animate({borderColor : ['#323232', '#E23E57'], offset: [0, .1], easing : 'ease-out'},2000);

};


//Establece la funcion del boton "Cancelar" en la pantalla de "Anhadir palabra"
document.getElementById('cancel').onclick = () => {
    changeDisplay(sectionPalabra, false);
    changeDisplay(sectionPrincipal, true);
    inputPalabra.value = '';
};


//Establece la funcion del boton "Nuevo juego"
document.getElementById("new-game").onclick = () => {
    game.newGame();
    resetKeys();
}


//Establece la funcion del boton "Finalizar partida"
document.getElementById("end").onclick = () => {
    
    changeDisplay(sectionGame, false);
    changeDisplay(sectionPrincipal, true);
    toggleContainer.style.display = 'none';

    resetKeys();
    game.endGame();//Finaliza el juego

};