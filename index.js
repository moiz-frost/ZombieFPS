window.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        scene.clearColor = new BABYLON.Color3.Black();

        var camera = new BABYLON.FreeCamera(
            'FreeCamera',
            new BABYLON.Vector3(0, 5, -10),
            scene);

        camera.attachControl(canvas, true);

        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);

        camera.setTarget(BABYLON.Vector3.Zero());

        // camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight(
            'Global-Light',
            new BABYLON.Vector3(0, 1, 0),
            scene);

        var sphere = new BABYLON.Mesh.CreateSphere('Sphere', 16, 2, scene);

        sphere.position.y = 1;

        var ground = new BABYLON.Mesh.CreateGround('Ground', 6, 6, 2, scene);

        return scene;
    };

    var scene = createScene();
    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

});



