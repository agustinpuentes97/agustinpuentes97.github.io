let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    margin: '0px auto',
    parent: 'game-container',
    createCanvas: {
        parent: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    preload: preload,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

// Crear el objeto del juego
let gameOver = false;
let puntaje = 0;
let puntajeTexto;
const game = new Phaser.Game(config);



function preload() {
    // Se precargan todos los elementos necesarios
    this.load.image('cielo', 'img/cielo.png');
    this.load.image('plataforma', 'img/plataforma.png');
    this.load.image('pincel', 'img/pincel.png');
    this.load.image('bomba', 'img/bomba.png');
    this.load.spritesheet('personaje', 'img/personaje.png', { frameWidth: 32, frameHeight: 48 })
}

function create() {
    // Genera las plataformas y su física
    this.add.image(400, 300, 'cielo');
    plataformas = this.physics.add.staticGroup();
    plataformas.create(400, 568, 'plataforma').setScale(2).refreshBody();
    plataformas.create(600, 400, 'plataforma');
    plataformas.create(50, 250, 'plataforma');
    plataformas.create(750, 220, 'plataforma');
    // Genera las jugador y su física
    jugador = this.physics.add.sprite(100, 450, 'personaje');
    jugador.setCollideWorldBounds(true)
    jugador.setBounce(0.2)
    // Se crean animaciones izquierda, derecha y estatico
    this.anims.create({
        key: 'izquierda',
        frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 3 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'medio',
        frames: [{ key: 'personaje', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'derecha',
        frames: this.anims.generateFrameNumbers('personaje', { start: 5, end: 8 }),
        frameRate: 20,
        repeat: -1
    });
    // Se establece la interacción entre jugador y plataformas
    this.physics.add.collider(jugador, plataformas);
    // Se establece la espera de presión de teclas
    cursores = this.input.keyboard.createCursorKeys();
    // Se crean los pinceles que van a caer y ser recolectados
    pinceles = this.physics.add.group({
        key: 'pincel',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    // Debajo se le da un valor de rebote aleatorio entre 0.4 y 0.8
    pinceles.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.5));
    }
    )
    //Colisiones de los pinceles
    this.physics.add.collider(pinceles, plataformas)
    // Da cuenta de la posición del jugador, pinceles y llama a la función para desaparecer
    this.physics.add.overlap(jugador, pinceles, coleccionarPinceles, null, true);

    // Se añade el puntaje seteado en 0
    puntajeTexto = this.add.text(16, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#000' })

    bombas = this.physics.add.group();
    this.physics.add.collider(bombas, plataformas)
    this.physics.add.collider(jugador, bombas, choqueBomba, null, this);

}

function update() {
    // Evalua que la variable gameOver esté en false, si está true es porque perdió 
    if (gameOver) {
        puntaje = puntaje;
        alert(`Perdiste :C pero lograste ${puntaje} puntos`)
        gameOver = false;
        return;
    }
    // Controla los botones apretados y genera la animación
    if (cursores.left.isDown) {
        jugador.setVelocityX(-160)
        jugador.anims.play('izquierda', true)
    } else if (cursores.right.isDown) {
        jugador.setVelocityX(160)
        jugador.anims.play('derecha', true)
    } else {
        jugador.setVelocityX(0)
        jugador.anims.play('medio')
    }
    // Genera salto teniendo en cuenta de que esté parado en algo sólido
    if (cursores.up.isDown && jugador.body.touching.down) {
        jugador.setVelocityY(-330)
    }

}

// Funcion que nota las colision con pinceles
function coleccionarPinceles(jugador, pincel) {
    pincel.disableBody(true, true)
    puntaje += 10;
    puntajeTexto.setText('Puntaje:' + puntaje)
    // Cuenta las estrellas activas, si es igual a 0 se generan estrellas nuevas y una (1) bomba  
    if (pinceles.countActive(true) === 0) {
        pinceles.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)
        });
        // Busca dónde está el jugador, para lanzar la bomba lejos de él y dar una chance
        let x = (jugador.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomba = bombas.create(x, 16, 'bomba');
        // Se crea la bomba
        bomba.setBounce(1)
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

}
// Funcion de fin de juego, indica que el jugador ha perdido
function choqueBomba(jugador, bomba) {
    this.physics.pause();
    jugador.setTint(0xff0000);
    jugador.anims.play('medio');
    gameOver = true;
}

// Crea la escena del juego
const gameScene = new Phaser.Scene('Game');

gameScene.preload = preload;
gameScene.create = create;
gameScene.update = update;

// Agregar la escena al juego
game.scene.add('Game', gameScene, true);
