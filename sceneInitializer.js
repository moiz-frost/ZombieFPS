/*
* Program: ZombieFPS
* Description: Zombie First Person Shooter Game in babylon.js
* File Name: sceneInitializer.js
* Desc: this is the main javascript file for the project
* (around 450 lines)
* Creator: Abdul Moiz Sheikh
* Contributors: Saad, Jareer
* Help was taken from pixelcodr.com to implement many features of the game.
*/


//-- Global Variables Initialization --//

var
globalCanvas,
globalEngine,
globalLight,
globalCamera,
globalScene,
globalSkybox,
time = 0,
Assets = [];
var globalMesh = [];

var s;
var globalIndex = 0;

var score = 0;

var gunshot;
var ENDINGS = [];
var ENEMIES = [];

//-- End Global Variables Initialization --//




/**
* Function name: CreateTerrain
* Desc: This function creates the terrain(Ground) seen in the project
* Inputs: None
* Output: Ground
* Creator: Abdul Moiz Sheikh
* Code help taken from babylon.js official documentation and examples.
* Date: 24/05/17
*/
var createTerrain = function () {

    // Create terrain material
    var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", globalScene);
    terrainMaterial.specularColor = new BABYLON.Color3(255/255, 165/255, 0/255);
    terrainMaterial.specularPower = 512;

    // Set the mix texture (represents the RGB values)
    terrainMaterial.mixTexture = new BABYLON.Texture("textures/terrain/mixMap.png", globalScene);

    // Diffuse textures following the RGB values of the mix map
    terrainMaterial.diffuseTexture1 = new BABYLON.Texture("textures/terrain/floor.png", globalScene);
    terrainMaterial.diffuseTexture2 = new BABYLON.Texture("textures/terrain/rock.png", globalScene);
    terrainMaterial.diffuseTexture3 = new BABYLON.Texture("textures/terrain/grass.png", globalScene);

    // Bump textures according to the previously set diffuse textures
    terrainMaterial.bumpTexture1 = new BABYLON.Texture("textures/terrain/floor_bump.png", globalScene);
    terrainMaterial.bumpTexture2 = new BABYLON.Texture("textures/terrain/rockn.png", globalScene);
    terrainMaterial.bumpTexture3 = new BABYLON.Texture("textures/terrain/grassn.png", globalScene);

    // Rescale textures according to the terrain
    terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 30;
    terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 30;
    terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 30;

    // Ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/terrain/heightMap.png", 5000, 5000, 0, 0, -1010, globalScene, false);
    ground.position.y = -2.05;
    ground.material = terrainMaterial;
    ground.checkCollisions = true;


};


/**
* Function name: loadSkyBox
* Desc: This function creates the SkyBox seen in the project
* Inputs: None
* Output: Skybox
* Creator: Abdul Moiz Sheikh
* Help taken from FPS Shooter game by Julian Chenard
* Date: 25/05/17
*/
var loadSkyBox = function () {
    globalSkybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:5000.0}, globalScene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", globalScene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/skybox/violentdays/violentdays", globalScene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    globalSkybox.material = skyboxMaterial;
    globalSkybox.checkCollisions = true;
};


/**
* Function name: LoadGun
* Desc: This function creates the gun object seen in the project
* Inputs: None
* Output: Gun (as child of camera)
* Creator: Saad Mairaj Ansari
* Date: 26/05/17
*/
var loadGun = function(fileName, sceneName){
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function(importedMeshes){
        importedMeshes.forEach(function(mesh){
            mesh.position = new BABYLON.Vector3(10, -25, 10);
            mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            mesh.parent = globalCamera;
            mesh.scaling.x = 0.75;
            mesh.scaling.y = 0.75;
            mesh.scaling.z = 0.75;
            mesh.checkCollisions = true;
        });
    });
    return model;
}

/**
* Function name: LoadZombie
* Desc: This function imports the zombie seen in the project and runs its animation in loop.
* Inputs: fileName, sceneName, xPosition of imported mesh, yPosition of Imported Mesh, zPosition of Imported Mesh
* Output: Zombie
* Date: 24/05/17
*/
var loadZombie = function (fileName, sceneName, xPos, yPos, zPos) {
    //-- An invisible mesh is created to make parent of zombie model. --//
    var zio = new BABYLON.Mesh("parent", globalScene);
    zio.isVisible = false;
    zio.checkCollisions = true;


    //-- Zombie Import --//
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function (importedMeshes, particleSystems, skeleton) {


        ENEMIES.push(importedMeshes[0])
        importedMeshes.forEach(function (mesh) {
           mesh.scaling.x = 50;
           mesh.scaling.y = 50;
           mesh.scaling.z = 50;
           mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
           mesh.position.x = xPos;
           mesh.position.y = yPos;
           mesh.position.z = zPos;
           mesh.parent = zio;
           globalMesh.push(zio);
           mesh.checkCollisions = true;

        });

        //-- Animation of zombie movement; static --//
        globalScene.beginAnimation(skeleton[0], 0, 100, true, 1.0);
    });

    return model;
};



/**
* Function name: UpdateScore
* Desc: This function updates the score
* Inputs: time
* Output: new Score
* Created By: Jareer Arshad
* Date: 27/05/17
*/
var updateScore = function(time){
    score += 100 - time*2;
    var scoreHTML = document.getElementById("score");
    scoreHTML.innerHTML = String(score);
}


/**
* Function name: UpdateTime
* Desc: This function updates the Time on the GUI
* Inputs: None
* Output: new Time
* Created By: Saad Mairaj
* Date: 27/05/17
*/
var updateTime = function(){
    time++;
    var timeGui = document.getElementById("time");
    timeGui.innerHTML = String(time);
}



/**
* Function name: LoadManyZombies
* Desc:
* Inputs: None
* Output: Initializes many zombies and their starting positions and movement.
* Created By: Saad Mairaj
* Date: 27/05/17
*/
var loadManyZombies = function(){
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 0, -350, 0);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 100, -340, 15);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 800, -320, 200);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 800, -320, 1000);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 500, -350, 500);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 1000, -320, 500);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 250, -350, 451);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 900, -350, 150);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 850, -350, 288);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, 200, -350, 0);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, -400, -350, 65);
    loadZombie('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene, -200, -350, 55);
}

// Doesn't Work
/**
* Function name: minimap
* Desc:
* Inputs: None
* Output:
* Created By: Saad Mairaj
* Copied from www.pixelcodr.com/tutorials, specifically FPS shooter tutorial
* Date: 27/05/17
*/
var minimap = function(){
        var mm = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(0, 100, 0), globalScene);
        mm.setTarget(new BABYLON.Vector3(0, 0, 0));
        // Activate the orthographic projection
        mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        //These values are required for using an orthographic mode,
        // and represents the coordinates of the square containing all the camera view.
        // this.size is the size of our arena
        mm.orthoLeft = -500 / 2;
        mm.orthoRight = 500 / 2;
        mm.orthoTop = 500 / 2;
        mm.orthoBottom = -500 / 2;
        mm.rotation.x = Math.PI / 2;
        // Viewport definition
        var xstart = 0.8, // 80% from the left
        ystart = 0.75; // 75% from the bottom
        var width = 0.99 - xstart, // Almost until the right edge of the screen
        height = 1 - ystart; // Until the top edge of the screen
        mm.viewport = new BABYLON.Viewport(xstart, ystart, width, height);
        mm.layerMask = 1; // 001 in binary
        globalScene.activeCamera.layerMask = 2;
        // The representation of player in the minimap
        s = BABYLON.Mesh.CreateSphere("player2", 16, 25, globalScene);
        s.position.y = 50;
        // The sphere position will be displayed accordingly to the player position
        // this.scene.registerBeforeRender(function () {
        //
        // });
        var red = new BABYLON.StandardMaterial("red", globalScene);
        red.diffuseColor = BABYLON.Color3.Red();
        red.specularColor = BABYLON.Color3.Black();
        s.material = red;
        s.layerMask = 1; // 001 in binary : won't be displayed on the player camera, only in the minimap
        // Add the camera to the list of active cameras of the game
        globalScene.activeCameras.push(globalScene.activeCamera);
        globalScene.activeCameras.push(mm);
}



/**
* Function name: InitializeScene
* Desc: This function creates the necessary environment along with initializing all elements of the game.
* Inputs: None
* Output: Complete Game
* Created By: Abdul Moiz Sheikh
* Date: 27/05/17
*/
var initializeScene = function () {

    globalCanvas = document.getElementById('mainGameCanvas'); // Points to the main canvas in the html file

    globalEngine = new BABYLON.Engine(globalCanvas, true); // True - to enable antialisaing
    // globalEngine.enableOfflineSupport = false;

    globalScene = new BABYLON.Scene(globalEngine); // scene


    //-- The following lines implement a Free Camera for player movement --//
    globalCamera = new BABYLON.FreeCamera('globalCamera', new BABYLON.Vector3(-50, -405, 1650), globalScene);
    globalCamera.applyGravity = true;

    //-- Speed of Camera upon movement --//
    globalCamera.speed = 50;

    //-- Inertia of globalCamera. The value of inertia when the camera stops moving. (For how long will the camera slide) --//
    globalCamera.inertia = 0.09;
    globalCamera.setTarget(new BABYLON.Vector3(1500, 0, -1350)); // lookAt 0, 0, 0
    // globalCamera.attachControl(globalCanvas, true); // True - to attach control
    globalCamera.keysUp.push(87);     // w
    globalCamera.keysDown.push(83);   // s
    globalCamera.keysLeft.push(65);   // a
    globalCamera.keysRight.push(68);  // d

    //-- Value of Gravity in the Scene --//
    globalScene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    //-- The player's body (or its representation) --//
    globalCamera.ellipsoid = new BABYLON.Vector3(1, 25 ,1);
    globalScene.collisionsEnabled = true;
    globalCamera.checkCollisions = true;


    globalCamera.angularSensibility = 1000;


    //-- Global variable gunshot is initialized with the shot.wav file.
    gunshot = new BABYLON.Sound("gunshot", "Assets/shot.wav", globalScene, null, { loop: false, autoplay: false });



    loadSkyBox();
    createTerrain();


    //-- Code to initialize Lighting in the scene --//
    globalLight = new BABYLON.HemisphericLight("globalLight", new BABYLON.Vector3(1500, 600, -1250), globalScene);
    globalLight.diffuse = new BABYLON.Color3(1, 1, 1);
    globalLight.specular = new BABYLON.Color3(20, 20, 20);

    loadManyZombies();


    // Import Tree for Jareer
    // TREE_MODEL.position = new BABYLON.Vector3(0, 5, 0);
    // initializeGame();
    loadGun('./Assets/Gun/mp5k.babylon', globalScene);




    //-- Movement of Zombie done here --//
    globalScene.registerBeforeRender(function(){
        //-- A global Variable is updated. If its value is divisible by 50, then the zombie's parent is moved. --//
        if(globalIndex %  50 === 0){
            for (var i = 0; i < globalMesh.length; i++) {
                //-- Z-Position and Y-Position of the globalMesh is increased giving the effect of zombie movement --//
                globalMesh[i].position.z += 3;
                globalMesh[i].position.y += 0.01;
            }
        }
        globalIndex++;

        //-- Code to try to implement minimap; Doesn't Work --//
        if (globalScene.activeCameras[0]) {
                s.position.x = globalScene.activeCameras[0].position.x;
                s.position.z = globalScene.activeCameras[0].position.z;
            }

    });


    //-- The following lines request the PointerLockAPI Upon initial click --//
    globalCanvas.addEventListener("click", function(evt){
        globalCanvas.requestPointerLock = globalCanvas.requestPointerLock || globalCanvas.mozRequestPointerLock || globalCanvas.webkitRequestPointerLock;

        if(globalCanvas.requestPointerLock){
            globalCanvas.requestPointerLock();
        }
            var pointerlockchange = function(event){
                controlEnabled =
                    document.mozPointerLockElement === globalCanvas||
                    document.webkitPointerLockElement === globalCanvas||
                    document.msPointerLockElement === globalCanvas ||
                    document.pointerLockElement === globalCanvas

                if(!controlEnabled)
                {
                    //-- if PointerLock is enabled, disable it --//
                    globalCamera.detachControl(globalCanvas);
                }
                else{
                    globalCamera.attachControl(globalCanvas);
                }

            };

            document.addEventListener("pointerlockchange", pointerlockchange, false);
            document.addEventListener("mspointerlockchange", pointerlockchange, false);
            document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
            document.addEventListener("mozpointerlockchange", pointerlockchange, false);

        }, false);


        //-- The following lines of code implement the shooting functionality on click --//
        globalCanvas.addEventListener("click", function(evt){

            var width = globalEngine.getRenderWidth();
            var height = globalEngine.getRenderHeight();

            gunshot.play();

            //-- This code picks the mesh in the middle of screen --//
            var pickInfo = globalScene.pick(width/2, height/2, null, false, globalCamera);
            if(pickInfo.pickedMesh.name === "Lambent_Female"){
                var Enemy = pickInfo.pickedMesh;
                var index = ENEMIES.indexOf(Enemy);
                ENEMIES.splice(index, 1);

                //-- This line deletes the zombie from the scene --//
                pickInfo.pickedMesh.dispose();

                //-- Score is updated --//
                updateScore(time);

                //-- If No Enemies Present, You win the game; A text is shown on the screen --//
                if(ENEMIES.length == 0){
                    var win = document.getElementById("instructions");
                    win.innerHTML = "Congratulations! You won. Your Score is "+score;
                }
            }
        });

    //-- Keeps rendering the main Scene --//
    globalEngine.runRenderLoop(function () { // main render loop
        globalScene.render();
    });

};

//-- updateTime function is called every 1 second --//
setInterval(updateTime, 1000);


//-- Initializes Game --//
document.addEventListener('DOMContentLoaded', function () {

    if(BABYLON.Engine.isSupported()){
        initializeScene();
    } else {
        alert("Cannot start!");
    }

});