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

// var globalMesh1, globalMesh2, globalMesh3, globalMesh4, globalMesh5, globalMesh6, globalMesh7, globalMesh8, globalMesh9, globalMesh10;

var score = 0;

var gunshot;
var ENDINGS = [];
var ENEMIES = [];



var createTerrain = function () {

    // Create terrain material
    var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", globalScene);
    terrainMaterial.specularColor = new BABYLON.Color3(255/255, 165/255, 0/255);
    terrainMaterial.specularPower = 512;

    // Set the mix texture (represents the RGB values)
    terrainMaterial.mixTexture = new BABYLON.Texture("textures/terrain/mixMap.png", globalScene);

    // Diffuse textures following the RGB values of the mix map
    // diffuseTexture1: Red
    // diffuseTexture2: Green
    // diffuseTexture3: Blue
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

var loadModel = function (fileName, sceneName) {
    globalMesha = new BABYLON.Mesh("parent", globalScene);
    globalMesha.isVisible = false;
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function (importedMeshes, particleSystems, skeleton) {


        importedMeshes.forEach(function (mesh) {
           mesh.scaling.x = 70;
           mesh.scaling.y = 70;
           mesh.scaling.z = 70;
           mesh.position.x = 0;
           mesh.position.y = -320;
           mesh.position.z = 0;
           mesh.parent = globalMesha;



           // console.log(ENEMIES);
        });
        globalScene.beginAnimation(skeleton[0], 0, 120, true, 1.0);


        // var dude = importedMeshes[0];
        // dude.rotation.y = Math.PI;

        // globalScene.beginAnimation(skeleton[0], 0, 100, true, 1.0);

    });
    return model;
};

var loadModel2 = function (fileName, sceneName) {
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function (importedMeshes, particleSystems, skeleton) {

        ENEMIES.push(importedMeshes[0])
        importedMeshes.forEach(function (mesh) {
           mesh.scaling.x = 50;
           mesh.scaling.y = 50;
           mesh.scaling.z = 50;
           mesh.position.x = 200;
           mesh.position.y = -320;
           mesh.position.z = 15;




           // console.log(ENEMIES);
        });
        globalScene.beginAnimation(skeleton[0], 0, 120, true, 1.0);

        // var dude = importedMeshes[0];
        // dude.rotation.y = Math.PI;

        // globalScene.beginAnimation(skeleton[0], 0, 100, true, 1.0);

    });

    return model;
};


var loadZombie = function (fileName, sceneName, xPos, yPos, zPos) {
    var zio = new BABYLON.Mesh("parent", globalScene);
    zio.isVisible = false;
    zio.checkCollisions = true;

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
           // mesh.checkCollisions = true;




           // console.log(ENEMIES);
        });
        globalScene.beginAnimation(skeleton[0], 0, 100, true, 1.0);

        // var dude = importedMeshes[0];
        // dude.rotation.y = Math.PI;

        // globalScene.beginAnimation(skeleton[0], 0, 100, true, 1.0);

    });

    return model;
};


var updateScore = function(time){
    score += 100 - time*2;
    var scoreHTML = document.getElementById("score");
    scoreHTML.innerHTML = String(score);
}



var updateTime = function(){
    time++;
    var timeGui = document.getElementById("time");
    timeGui.innerHTML = String(time);
}

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

var initializeScene = function () {

    globalCanvas = document.getElementById('mainGameCanvas'); // Points to the main canvas in the html file

    globalEngine = new BABYLON.Engine(globalCanvas, true); // True - to enable antialisaing
    // globalEngine.enableOfflineSupport = false;

    globalScene = new BABYLON.Scene(globalEngine); // scene

    globalCamera = new BABYLON.FreeCamera('globalCamera', new BABYLON.Vector3(-50, -405, 1650), globalScene);
    globalCamera.applyGravity = true;
    globalCamera.speed = 50;
    globalCamera.inertia = 0.09;
    globalCamera.setTarget(new BABYLON.Vector3(1500, 0, -1350)); // lookAt 0, 0, 0
    // globalCamera.attachControl(globalCanvas, true); // True - to attach control
    globalCamera.keysUp.push(87);     // w
    globalCamera.keysDown.push(83);   // s
    globalCamera.keysLeft.push(65);   // a
    globalCamera.keysRight.push(68);  // d
    globalScene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    globalCamera.ellipsoid = new BABYLON.Vector3(1, 25 ,1);
    globalScene.collisionsEnabled = true;
    globalCamera.checkCollisions = true;
    globalCamera.angularSensibility = 1000;



    gunshot = new BABYLON.Sound("gunshot", "Assets/shot.wav", globalScene, null, { loop: false, autoplay: false });



    loadSkyBox();
    createTerrain();

    globalLight = new BABYLON.HemisphericLight("globalLight", new BABYLON.Vector3(1500, 600, -1250), globalScene);
    globalLight.diffuse = new BABYLON.Color3(1, 1, 1);
    globalLight.specular = new BABYLON.Color3(20, 20, 20);


    // loadModel('./Assets/Tree.babylon', globalScene);
    // loadModel('./Assets/zombie/gears-of-war-3-lambent-female-boned-animated-testing.babylon', globalScene);

    loadManyZombies();

    // TREE_MODEL.position = new BABYLON.Vector3(0, 5, 0);
    // initializeGame();
    loadGun('./Assets/Gun/mp5k.babylon', globalScene);

    // minimap();
    // globalScene.beginAnimation(globalScene.getSkeletonById(1), 0, 61, true, 1.0);

    // console.log(ENEMIES);
    globalScene.registerBeforeRender(function(){
        // globalMesha.position.x += 1;
        if(globalIndex %  50 === 0){
            for (var i = 0; i < globalMesh.length; i++) {
                globalMesh[i].position.z += 3;
                globalMesh[i].position.y += 0.01;
            }
        }
        globalIndex++;

        if (globalScene.activeCameras[0]) {
                s.position.x = globalScene.activeCameras[0].position.x;
                s.position.z = globalScene.activeCameras[0].position.z;
            }

    });



    //Jump Code
    document.addEventListener("keydown", function (event) {
        if(event.keyCode == 32){
            globalCamera.position.y += 150;
        }
    });

    document.addEventListener("keyup", function (event) {
        if(event.keyCode == 32){
            globalCamera.position.y -= 150;
        }
    });


    globalCanvas.addEventListener("click", function(evt){
        globalCanvas.requestPointerLock = globalCanvas.requestPointerLock || globalCanvas.mozRequestPointerLock || globalCanvas.webkitRequestPointerLock;

        if(globalCanvas.requestPointerLock){
            globalCanvas.requestPointerLock();
        }

        // globalCamera.detachControl(globalCanvas);
        // globalCanvas.requestPointerLock();

            var pointerlockchange = function(event){
                controlEnabled =
                    document.mozPointerLockElement === globalCanvas||
                    document.webkitPointerLockElement === globalCanvas||
                    document.msPointerLockElement === globalCanvas ||
                    document.pointerLockElement === globalCanvas

                if(!controlEnabled)
                {
                    globalCamera.detachControl(globalCanvas);
                }
                else{
                    globalCamera.attachControl(globalCanvas);
                }



                    // globalCamera.attachControl(globalCanvas);
                // else{
                //     _this.camera.attachControl(globalCanvas);
                // }
            };

            document.addEventListener("pointerlockchange", pointerlockchange, false);
            document.addEventListener("mspointerlockchange", pointerlockchange, false);
            document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
            document.addEventListener("mozpointerlockchange", pointerlockchange, false);

            // document.addEventListener("mousemove", moveCallback, false);
        }, false);

        globalCanvas.addEventListener("click", function(evt){
            var width = globalEngine.getRenderWidth();
            var height = globalEngine.getRenderHeight();
            gunshot.play();
            var pickInfo = globalScene.pick(width/2, height/2, null, false, globalCamera);
            if(pickInfo.pickedMesh.name === "Lambent_Female"){
                var Enemy = pickInfo.pickedMesh;
                var index = ENEMIES.indexOf(Enemy);
                ENEMIES.splice(index, 1);
                // console.log(ENEMIES.length);

                // pickInfo.pickedMesh.scaling.x = 2;
                // pickInfo.pickedMesh.scaling.y = 2;
                // pickInfo.pickedMesh.scaling.z = 2;

                pickInfo.pickedMesh.dispose();
                updateScore(time);

                if(ENEMIES.length == 0){
                    console.log("You Win");
                    // updateScore(time);
                    var win = document.getElementById("instructions");
                    win.innerHTML = "Congratulations! You won. Your Score is "+score;
                }
            }


            // console.log(pickInfo.pickedMesh.name);
        });




    globalEngine.runRenderLoop(function () { // main render loop
        globalScene.render();
        // console.log(time);
        // console.log(globalCamera.position);
    });

};

setInterval(updateTime, 1000);

document.addEventListener('DOMContentLoaded', function () {

    if(BABYLON.Engine.isSupported()){
        initializeScene();
    } else {
        alert("Cannot start!");
    }



});