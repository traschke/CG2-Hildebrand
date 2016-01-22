/* requireJS module definition */
define(["jquery", "three", "shaders"],
    (function($, THREE, Shaders) {

        "use strict";

        var Explosion = function(config) {

            var frequencyScale = config.frequencyScale;
            var colorScale = config.colorScale;
            var weight = config.weight;

            this.root = new THREE.Object3D();

            var scope = this;

            var start = Date.now();

            // load explosion texture
            //
            // Loading textures is asynchronous. That means you the load function
            // takes the file url as input and three callback functions
            // onLoadSuccess, onLoadProgress and onLoadError
            // we need to handle these cases. Only in onLoadSuccess we can setup
            // the scene, the texture and the shaders correctly.
            // correctly this would be implemented with promises (see assignment add-on question)
            /*this.loadTexture(String url){


            };*/


            // define a shader with these uniform values
            var textureLoader = new THREE.TextureLoader();

            var material = new THREE.ShaderMaterial( {

                    uniforms: {

                        tExplosion: {
                            type: "t", 
                            value: textureLoader.load( 'textures/explosion.png' )
                        },

                        time: {// float initialized to 0
                            type: "f", 
                            value: 0.0 },

                        weight: {
                            type: "f", 
                            value: weight 
                        },
                        freqScale: {
                            type: "f", 
                            value: frequencyScale 
                        },
                        colorScale: {
                            type: "f", 
                            value: colorScale                             
                        }
                    },

                     vertexShader: Shaders.getVertexShader("explosion"),
                     fragmentShader: Shaders.getFragmentShader("explosion")
                 } );


            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry( 300, 50, 50 ), material );
            scope.mesh.name = "explosion";
            scope.root.add(scope.mesh);





            this.getMesh = function() {
                return this.root;
            };

            this.animate = function() {
                
            }


        }; // constructor


        return Explosion;

    })); // define module

