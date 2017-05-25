var
globalCanvas,
globalEngine,
globalLight,
globalCamera,
globalScene,
globalSkybox;


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
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/terrain/heightMap.png", 5000, 5000, 0, 0, -1000, globalScene, false);
    ground.position.y = -2.05;
    ground.material = terrainMaterial;
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
};





var loadModel = function (fileName, sceneName) {
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function (importedMeshes) {
        // TODO stuff
        importedMeshes.forEach(function (mesh) {
           mesh.scaling.x = 70;
           mesh.scaling.y = 70;
           mesh.scaling.z = 70;
           mesh.position.x = 0;
           mesh.position.y = -450;
           mesh.position.z = 0;
        });
    });
    return model;
};



var initializeGame = function () {

    var LANE_NUMBER = 6;        // no of lanes
    var LANE_INTERVAL = 6;      // space between lanes
    var LANES_POSITIONS = [];   // positions of lanes

    var createLane = function (laneIdentifier, position, sceneName) {
        var lane = BABYLON.Mesh.CreateBox("lane" + laneIdentifier, 1, sceneName);
        lane.scaling = new BABYLON.Vector3(3, 0.1, 800);
        lane.position = new BABYLON.Vector3(position, 0, 0);
    };

    var createEndingLane = function (laneIdentifier, position, sceneName) {
        var endingLane = BABYLON.Mesh.CreateGround(laneIdentifier, 3, 4, 1, sceneName);
        endingLane.position = new BABYLON.Vector3(position, 0.1, 1);
        var mat = new BABYLON.StandardMaterial("mat", sceneName);
        mat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        endingLane.material = mat;
        return endingLane;
    };


    var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER / 2);

    for (var i = 0; i < LANE_NUMBER; i++){
        LANES_POSITIONS[i] = currentLanePosition;
        createLane(i, currentLanePosition, globalScene);
        var e = createEndingLane(i, currentLanePosition, globalScene);
        ENDINGS.push(e);
        currentLanePosition += LANE_INTERVAL;
    }

    globalCamera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER / 2)];
};

var initializeScene = function () {

    globalCanvas = document.getElementById('mainGameCanvas'); // Points to the main canvas in the html file

    globalEngine = new BABYLON.Engine(globalCanvas, true); // True - to enable antialisaing
    globalEngine.enableOfflineSupport = false;

    globalScene = new BABYLON.Scene(globalEngine); // scene

    globalCamera = new BABYLON.FreeCamera('globalCamera', new BABYLON.Vector3(-666, -371, 50), globalScene);

    globalCamera.setTarget(new BABYLON.Vector3(1500, 0, -1350)); // lookAt 0, 0, 0
    globalCamera.attachControl(globalCanvas, true); // True - to attach control
    globalCamera.keysUp.push(87);     // w
    globalCamera.keysDown.push(83);   // s
    globalCamera.keysLeft.push(65);   // a
    globalCamera.keysRight.push(68);  // d

    loadSkyBox();
    createTerrain();

    globalLight = new BABYLON.HemisphericLight("globalLight", new BABYLON.Vector3(1500, 600, -1250), globalScene);
    globalLight.diffuse = new BABYLON.Color3(1, 1, 1);
    globalLight.specular = new BABYLON.Color3(20, 20, 20);

    // loadModel('./Assets/Tree.babylon', globalScene);
    loadModel('./Assets/zombie/gears-of-war-3-lambent-female.babylon', globalScene);
    // TREE_MODEL.position = new BABYLON.Vector3(0, 5, 0);
    // initializeGame();


    globalEngine.runRenderLoop(function () { // main render loop
        globalScene.render();
        console.log(globalCamera.position);
    });

};


document.addEventListener('DOMContentLoaded', function () {

    if(BABYLON.Engine.isSupported()){
        initializeScene();
    } else {
        alert("Cannot start!");
    }

});