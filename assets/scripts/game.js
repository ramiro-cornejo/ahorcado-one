export default class Game {
    
    //Contiene las coordenadas para dibujar la horca
    #coordinates ={
        1: [45,16,180,16],
        2: [180,16,180,60],
        3: () => {
            this.#pincel.beginPath();
            this.#pincel.arc(180, 85, 25, 0, 2*Math.PI);
            this.#pincel.stroke();
        },
        4: [180,110,180,140],
        5: [180,140,140,160],
        6: [180,140,220,160],
        7: [180,140,180,260],
        8: [180,260,210,300],
        9: [180,260,150,300],
    }
    #word = [];//Contiene la palabra a adivinar en fomra de un arreglo de caracteres.
    #row = document.getElementById("palabra");//Fila que contiene la palabra a adivinar.
    #rowFailed = document.getElementById("error");//Fila que contiene las letras incorrectas.
    #tryCount = 0;//Conteo de los intentos del usuario.
    #isOver = false;//Variable que controla si el juego ah terminado.
    #isLost = false;//Inidca si el juego se perdio (no se adivino la letra)
    #canvas = document.querySelector('canvas');
    #pincel = this.#canvas.getContext('2d');
    static #words = ["CASCADA", "JUGUETE", "MADERA", "BUHO", "MURCIELAGO", "JAVA", "MUEBLE", "PROGRAMAR", "PLUMA", "ALURA", "ORACLE"];//Contiene las palabras a utlizar en el juego.
    
    constructor(){
        
        this.#pincel.strokeStyle = '#0A3871';
        this.#pincel.lineWidth = '3';

    }

    newGame() {//Restablece todos los elementos y variables del juego

        //Inicializa el event listener para manejar la teclas presionadas por el usuario
        document.addEventListener('keydown', this.#handleKeyboard);

        this.#isOver = false;
        this.#isLost = false;
        this.#tryCount = 0;

        //Limpia las filas de la tabla.
        let newRow = document.createElement("tr");
        newRow.setAttribute('id',"palabra");
        this.#row.replaceWith(newRow);
        this.#row = newRow;
        this.#rowFailed.innerText = '';

        //Limpia el canvas y dibuja las lineas base
        this.#pincel.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#pincel.beginPath();
        this.#pincel.moveTo(25, 370);
        this.#pincel.lineTo(275, 370);
        this.#pincel.stroke();

        this.#pincel.moveTo(45, 370);
        this.#pincel.lineTo(45, 15);
        this.#pincel.stroke();

        //Limpia el canvas y dibuja las lineas base
        this.#pincel.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#pincel.beginPath();
        this.#pincel.moveTo(25, 370);
        this.#pincel.lineTo(275, 370);
        this.#pincel.stroke();

        this.#pincel.moveTo(45, 370);
        this.#pincel.lineTo(45, 15);
        this.#pincel.stroke();

        //Obtiene una nueva palabra de forma aleatoria.
        let wordIndex = Math.floor(Math.random()*Game.#words.length);
        this.#word = Game.#words[wordIndex].split('');

        //Inicializa la fila que contiene la palabra adivinar.
        for(let i = 0 ; i < this.#word.length ; i++) {
            let data = document.createElement("td");
            this.#row.append(data);
        }

    }

    //Elimina el manejador de las teclas presionadas por el usuario patra evitar errores y ejecutar tareas de manera innecesaria.
    endGame() {
        document.removeEventListener('keydown',this.#handleKeyboard);
    }

    //Verifica si letter existe en la palabra a adiviniar o si esta ya se ha ingresado anteriormente.
    #isCorrect(letter){

        let chars = this.#row.childNodes;
        let exist = false;//Variable de control para conocer si la letra ingresada existe en la palabra adivinar o se ah ingresado anteriormente.

        //Verifica si letter existe en la palabra a adivinar.
        for(let i = 0 ; i < this.#word.length ; i++) {

            if(letter == this.#word[i]) {
                chars[i].textContent = letter;
                exist = true;
            }

        }//fin for

        if(!exist) {

            chars = this.#rowFailed.textContent.split('');

            //Verifica si la letra ingresada ya se ah ingresado anteriormente.
            for (let i = 0; i < chars.length; i++) {
                if(chars[i] == letter) {
                    exist = true;
                    break;
                }
            }//fin for

            if(!exist){
                this.#rowFailed.append(letter);
            }//fin if

        }//fin if

        return exist;

    }

    #updateGameStatus() {//Actualiza el estado del juego

        //Si el usuario agoto sus intentos o adivino la palabra, el juego habra terminado.

        if(this.#tryCount == 9){//Verifica los intentos
            this.#isOver = true;
            this.#isLost = true;
            return;
        } 

        let chars = this.#row.childNodes;

        for(let i = 0 ; i < chars.length ; i++) {//Verifica si el usuario adivino la palabra
            if (chars[i].textContent == '') return;
        }

        this.#isOver = true;

    }

    #draw() {//Dibuja un elemento de la horca segun el numero de intentos que lleve el jugador

        const line = this.#coordinates[this.#tryCount];

        //Si estamos en el intento 3, tendremos que dibujar un arco cuya funcion esta definida en this.#coordinates
        if(this.#tryCount == 3) {
            line();
            return;
        }

        this.#pincel.beginPath();
        this.#pincel.moveTo(line[0], line[1]);
        this.#pincel.lineTo(line[2], line[3]);
        this.#pincel.stroke();

    }

    #handleKeyboard = (evt) => {//Implementa la logica para el manejo de las teclas presionadas por el usuario

        let letter = evt.key.toUpperCase();

        //Verifica que la tecla presionada sea una letra
        if(/^[A-Z]$/.test(letter)) {

            if(!this.#isCorrect(letter)){
                this.#tryCount++;
                this.#draw();
            }

            this.#updateGameStatus();

        }

        //Verificia si el juego aun no termina
        if(this.#isOver) {
            evt.preventDefault();
            this.endGame();
            
            Swal.fire({//Muestra mensaje de 
                title: this.#isLost ? 'Perdiste' : 'Ganaste!',

                html: this.#isLost ? 
                    'La palabrea era: '+this.#word.join('')+'<br>Intentalo de nuevo!' : 
                    'Felicidades, adivinaste la palabra: '+this.#word.join(''),

                iconHtml: this.#isLost ? '<lord-icon src="https://cdn.lordicon.com/tdrtiskw.json" delay="2000" trigger="loop" colors="primary:#545454,secondary:#e83a30" style="width: 12rem; height: 12rem;"></lord-icon>'
                : '<lord-icon src="https://cdn.lordicon.com/rcopausw.json" trigger="loop" delay="1500" colors="primary:#121331,secondary:#08a88a" style="width:250px;height: 180%"></lord-icon>',
                customClass: {
                    icon: 'no-border'
                },

                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#17B794',
                cancelButtonColor: '#323232',
                confirmButtonText: 'Nuevo juego',
                cancelButtonText: 'Menu principal'
            })
            .then((result) => {

                if (result.isConfirmed) this.newGame();
                else document.getElementById('end').click();

                //Restablece el estilo de las teclas del teclado virtual
                const keys = document.getElementsByClassName('key');

                for (let i = 0; i < keys.length; i++) {
                    const element = keys[i];
                    element.style = '';
                }//fin for

            });

            return;
        }
    }

    addWord(word) {//Añade una palabra al juego
        Game.#words.push(word);
    }

    get isLost() {
        return this.#isLost;
    }

    get isOver() {
        return this.#isOver;
    }

    get tryCount() {
        return this.#tryCount;
    }

}