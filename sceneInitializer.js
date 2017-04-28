var
globalCanvas,
globalEngine,
globalLight,
globalCamera,
globalScene;


var TREE_MODEL;
var ENDINGS = [];
var ENEMIES = [];






var loadTreeModel = function (fileName, sceneName) {
    var model = BABYLON.SceneLoader.ImportMesh("", "", fileName, sceneName, function (importedMeshes) {
        // TODO stuff
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

    globalCamera = new BABYLON.FreeCamera('globalCamera', new BABYLON.Vector3(0, 5, -15), globalScene);

    globalCamera.setTarget(BABYLON.Vector3.Zero()); // lookAt 0, 0, 0
    globalCamera.attachControl(globalCanvas, true); // True - to attach control
    globalCamera.keysUp.push(87);     // w
    globalCamera.keysDown.push(83);   // s
    globalCamera.keysLeft.push(65);   // a
    globalCamera.keysRight.push(68);  // d

    globalLight = new BABYLON.HemisphericLight("globalLight", new BABYLON.Vector3(0, 5, -5), globalScene);

    TREE_MODEL = loadTreeModel('Tree.babylon', globalScene);
    // TREE_MODEL.position = new BABYLON.Vector3(0, 5, 0);
    console.log(TREE_MODEL);
    initializeGame();


    globalEngine.runRenderLoop(function () { // main render loop
        globalScene.render();
        // console.log(globalCamera.position);
    });

};


document.addEventListener('DOMContentLoaded', function () {

    if(BABYLON.Engine.isSupported()){
        initializeScene();
    } else {
        alert("Cannot start!");
    }

});