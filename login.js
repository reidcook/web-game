class login extends Phaser.Scene {
    constructor() {
        super("login");
    }
    preload()
    {
        this.load.html("login", "loginform.html");
        this.load.image('sky', 'assets/background.png');
        this.load.image('portal', 'assets/portal.png');
        this.load.spritesheet("player", "assets/playerSheet.png", {
            frameWidth: 32,
            frameHeight: 32,
          });
        this.load.spritesheet("player", "assets/playerSheet.png", {
            frameWidth: 32,
            frameHeight: 32,
          });
        this.load.image("tiles", 'assets/moon-tileset.png');
        this.load.image("spiketiles", 'assets/spike.png');
        this.load.image("startiles", 'assets/yellowStar.png');
        this.load.tilemapTiledJSON('level1','assets/Level1stars.json');
        this.load.tilemapTiledJSON('level2','assets/level2stars.json');
        this.load.tilemapTiledJSON('level3','assets/level3stars.json');
        this.load.image("asteroid", "assets/asteroid.png");
        this.load.audio("music", ["assets/level-1.ogg"]);
        this.load.audio("music2", ["assets/level-2.ogg"]);
        this.load.audio("music3", ["assets/level-3.mp3"]);
        this.load.plugin(
            "rexclockplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js",
            true
        );
        this.load.image('dashUI', 'assets/astro-air-dash-scaled.gif');
        this.load.image('pogoUI', 'assets/astro-pogo-scaled.png');
    }
    create()
    {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", { start: 2, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
        key: "dash",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
        frameRate: 25,
        repeat: 2,
      });
      this.anims.create({
        key: "bounce",
        frames: this.anims.generateFrameNumbers("player", { start: 6, end: 6 }),
        frameRate: 25,
        repeat: -1,
      });
        this.add.image(320,180,'sky');
        
        const loginForm = this.add.dom(310, 174).createFromCache("login");

        
        const formElement = loginForm.node;

        this.errorText = this.add.text(this.scale.width / 2, 50, ' ', {
            fill: '#ff0000',
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center' // Center-align the text
        }).setOrigin(0.5, 0); // Set the origin to the middle of the text for horizontal centering
        

        formElement.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const username = formElement.querySelector('#username').value;
            const password = formElement.querySelector('#password').value;

            if (this.validateCredentials(username, password)) {
                const createAcc = formElement.querySelector('#create-account').checked;
                if (createAcc) {
                    this.registerUser(username, password);
                } else {
                    this.loginUser(username, password, this.errorText);
                }
            }
        });
    }

    validateCredentials(username, password) {
        if (username.length < 3) {
            this.errorText.setText("Username must be at least 3 characters long.");
            return false;
        }
        if (password.length < 8) {
            this.errorText.setText("Password must be at least 8 characters long.");
            return false;
        }
        if (!/[a-z]/.test(password)) {
            this.errorText.setText("Password must contain at least one lowercase letter.");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            this.errorText.setText("Password must contain at least one uppercase letter.");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            this.errorText.setText("Password must contain at least one number.");
            return false;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            this.errorText.setText("Password must contain at least one symbol.");
            return false;
        }
        return true;
    }

    registerUser(username, password) {
        const errorText = this.errorText;
    
        fetch('http://localhost:3000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status === 400 ? 'Username already in use' : 'Server error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.scene.start("levelselect", { color: "red" });
        })
        .catch(error => {
            console.error(error.message);
            errorText.setText(error.message);
        });
    }
    

    loginUser(username, password, errorText) {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            this.scene.start("levelselect", { color: "red" });
        })
        .catch(error => {
            console.error(error.message);
            errorText.setText('Invalid login! Try Again');
        });
    }
    
}