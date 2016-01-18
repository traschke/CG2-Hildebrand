/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */



/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band", "robot"],
    (function(THREE, util, shaders, BufferGeometry, Random, Band, Robot) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function(renderer, width, height) {

            // the scope of the object instance
            var scope = this;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera( 66, width / height, 0.1, 2000 );
            scope.camera.position.z = 1000;
            scope.scene = new THREE.Scene();

            //scope.scene.add(new THREE.AmbientLight(0xFFFFFF));

            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);


            function onDocumentKeyDown(event){
                // Get the key code of the pressed key
                var keyCode = event.which;

                if(keyCode == 38){
                    console.log("cursor up");
                    scope.currentMesh.rotation.x += 0.05;
                    // Cursor down
                } else if(keyCode == 40){
                    console.log("cursor down");
                    scope.currentMesh.rotation.x += -0.05;
                    // Cursor left
                } else if(keyCode == 37){
                    console.log("cursor left");
                    scope.currentMesh.rotation.y += 0.05;
                    // Cursor right
                } else if(keyCode == 39){
                    console.log("cursor right");
                    scope.currentMesh.rotation.y += -0.05;
                    // Cursor up
                }
                else if(keyCode == 72){
                    var nodeHead = scope.scene.getObjectByName("head", true);
                    if ( nodeHead ) {
                        nodeHead.rotateY(Math.PI/16);
                    }
                }
                else if(keyCode == 68){
                    var nodeshoulder1 = scope.scene.getObjectByName("shoulder1", true);
                    if ( nodeshoulder1 ) {
                        nodeshoulder1.rotateX(-Math.PI/16);
                    }
                }
                else if(keyCode == 65){
                    var nodeshoulder2 = scope.scene.getObjectByName("shoulder2", true);
                    if ( nodeshoulder2 ) {
                        nodeshoulder2.rotateX(-Math.PI/16);
                    }
                }
                else if(keyCode == 83){
                    var nodehip1 = scope.scene.getObjectByName("hip1", true);
                    var nodeknee1 = scope.scene.getObjectByName("knee1", true);
                    if ( nodehip1 ) {
                        nodehip1.rotateX(-Math.PI/16);
                    }
                    if ( nodeknee1 ) {
                        nodeknee1.rotateX(Math.PI/16);
                    }
                }
                else if(keyCode == 87){
                    var nodehip1 = scope.scene.getObjectByName("hip1", true);
                    var nodeknee1 = scope.scene.getObjectByName("knee1", true);
                    if ( nodehip1 ) {
                        nodehip1.rotateX(Math.PI/16);
                    }
                    if ( nodeknee1 ) {
                        nodeknee1.rotateX(-Math.PI/16);
                    }
                }
            };

            this.addBufferGeometry = function(bufferGeometry) {

                scope.currentMesh = bufferGeometry.getMesh();
                scope.scene.add( scope.currentMesh );

            };

            this.addLight = function(light) {
                if (light instanceof THREE.Light) {
                    console.log("Addded light", light, "to the scene.");
                    scope.scene.add(light);
                    if (light instanceof  THREE.DirectionalLight) {
                        scope.currentDirectionalLight = light;
                    }
                } else {
                    console.log(light, "is not a valid THREE.light");
                }
            };

            this.addMesh = function(mesh) {
                scope.currentMesh = mesh;
                scope.scene.add(scope.currentMesh);
            }


            /*
             * drawing the scene
             */
            this.draw = function() {

                requestAnimFrame( scope.draw );

                scope.renderer.render(scope.scene, scope.camera);

            };
        };


        // this module only exports the constructor for Scene objects
        return Scene;

    })); // define

    
