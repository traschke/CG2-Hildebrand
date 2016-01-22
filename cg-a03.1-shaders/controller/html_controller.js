/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band", 'ellipsoid', 'cosine', 'funnel', 'robot', 'planet', 'explosion'],
    (function($,BufferGeometry, Random, Band, Ellipsoid, Cosine, Funnel, Robot, Planet, Explosion) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            var mesh;

            /**
             * The interval that handles the animation.
             */
            this.animationInterval;

            this.directionalLightRotationInterval;

            var angle = 0;

            var directionalLightRotate = function(angle) {
                var quat = new THREE.Quaternion();
                quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), angle);
                scene.currentDirectionalLight.position.applyQuaternion(quat).normalize();
            };

            var rotateX = function(value) {
                scene.currentMesh.rotation.x += value;
            };

            var rotateY = function(value) {
                scene.currentMesh.rotation.y += value;
            };

            var rotateZ = function(value) {
                scene.currentMesh.rotation.z += value;
            };

            $("#random").show();
            $("#band").hide();
            $('#parametric').hide();
            $('#planet').hide();
            $('#explosion').hide();
            $('#material-options').show();

            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
                $('#parametric').hide();
                $('#planet').hide();
                $('#explosion').hide();
                $('#material-options').show();
            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
                $('#parametric').hide();
                $('#planet').hide();
                $('#explosion').hide();
                $('#material-options').show();
            }));

            $('#btnParametric').click(function() {
                $("#random").hide();
                $("#band").hide();
                $('#parametric').show();
                $('#planet').hide();
                $('#explosion').hide();
                $('#material-options').show();
            });

            $('#btnPlanet').click(function() {
                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();
                $('#planet').show();
                $('#explosion').hide();
                $('#material-options').hide();
            });

            $('#btnExplosion').click(function() {
                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();
                $('#planet').hide();
                $('#explosion').show();
                $('#material-options').hide();
            });

            $("#btnNewRandom").click( (function() {

                var renderMesh = $('#chkSolid').is(':checked');
                var renderWireframe = $('#chkWireframe').is(':checked');
                var renderPoints = $('#chkPoints').is(':checked');

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry(renderMesh, renderWireframe, renderPoints);
                bufferGeometryRandom.setIndex(random.getIndices());
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));


            $("#btnNewBand").click( (function() {

                var config = {
                    segments : parseInt($("#numSegments").attr("value")),
                    radius : parseInt($("#radius").attr("value")),
                    height : parseInt($("#height").attr("value"))
                };

                var renderMesh = $('#chkSolid').is(':checked');
                var renderWireframe = $('#chkWireframe').is(':checked');
                var renderPoints = $('#chkPoints').is(':checked');

                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry(renderMesh, renderWireframe, renderPoints);
                bufferGeometryBand.setIndex(band.getIndices());
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));

            $("#btnRobot").click( (function() {
                var robot = new Robot();
                scene.addBufferGeometry(robot) ;
            }));

            $('#btnNewParametric').click(function() {
                var config = {
                    umin : parseFloat($('#numUmin').attr('value').replace( /,/,"." )),
                    umax : parseFloat($('#numUmax').attr('value').replace( /,/,"." )),
                    vmin : parseFloat($('#numVmin').attr('value').replace( /,/,"." )),
                    vmax : parseFloat($('#numVmax').attr('value').replace( /,/,"." )),
                    uSegments : parseFloat($('#numUSegments').attr('value').replace( /,/,"." )),
                    vSegments : parseFloat($('#numVSegments').attr('value').replace( /,/,"." ))
                };

                var a = parseFloat($('#numA').attr('value').replace( /,/,"." ));
                var b = parseFloat($('#numB').attr('value').replace( /,/,"." ));
                var c = parseFloat($('#numC').attr('value').replace( /,/,"." ));

                var geometry = undefined;

                switch ($('#selParametricSurface').val()) {
                    case 'ellipsoid':
                        geometry = new Ellipsoid(a, b, c, config);
                        break;
                    case 'cosine':
                        geometry = new Cosine(a, b, c, config);
                        break;
                    case 'funnel':
                        geometry = new Funnel(a, b, c, config);
                        break;
                }

                var renderMesh = $('#chkSolid').is(':checked');
                var renderWireframe = $('#chkWireframe').is(':checked');
                var renderPoints = $('#chkPoints').is(':checked');

                var bufferGeometry = new BufferGeometry(renderMesh, renderWireframe, renderPoints);
                bufferGeometry.setIndex(geometry.getIndices());
                bufferGeometry.addAttribute('position', geometry.getPositions());
                bufferGeometry.addAttribute('color', geometry.getColors());

                scene.addBufferGeometry(bufferGeometry);
            });

            $('#selParametricSurface').change(function() {
                console.log('Para changed!', this.value);
                switch (this.value) {
                    case 'ellipsoid':
                        $('#numUmin').attr('value', Math.PI * (-1));
                        $('#numUmax').attr('value', Math.PI);
                        $('#numVmin').attr('value', Math.PI * (-1));
                        $('#numVmax').attr('value', Math.PI);
                        break;
                    case 'cosine':
                        $('#numUmin').attr('value', Math.PI * (-1));
                        $('#numUmax').attr('value', Math.PI);
                        $('#numVmin').attr('value', Math.PI * (-1));
                        $('#numVmax').attr('value', Math.PI);
                        break;
                    case 'funnel':
                        $('#numUmin').attr('value', 0.1);
                        $('#numUmax').attr('value', 2);
                        $('#numVmin').attr('value', 0);
                        $('#numVmax').attr('value', (Math.PI * 2));
                        break;
                }
            });

            /**
             * Handler for creating a new planet.
             */
            $('#btnNewPlanet').click(function() {
                console.log("Creating a new planet...");
                console.log(scene);
                var planet = new Planet($('#chkPlanetDayTexture').is(':checked'), $('#chkPlanetNightTexture').is(':checked'), $('#chkPlanetCloudsTexture').is(':checked'));
                scene.addMesh(planet.getMesh());

                var aLight = new THREE.AmbientLight('#ADADAD');
                var dLight = new THREE.DirectionalLight('#FFF8D1', 1);
                dLight.name = "dLight";
                dLight.position.set(-1, 0, -0.3).normalize();
                scene.addLight(aLight);
                scene.addLight(dLight);
            });

            $('#chkPlanetSunAnimation').change(function() {
                if ($(this).is(':checked')) {
                    console.log("Sun rotation started!");
                    this.directionalLightRotationInterval = setInterval(directionalLightRotate, 20, 0.02);
                } else {
                    clearInterval(this.directionalLightRotationInterval);
                }
            });

            $('#btnNewExplosion').click(function() {
                var config = {
                    frequencyScale : parseFloat($('#nmbExplosionFrequencyScale').attr('value').replace( /,/,"." )),
                    colorScale : parseFloat($('#nmbExplosionColorScale').attr('value').replace( /,/,"." )),
                    weight : parseFloat($('#nmbExplosionWeight').attr('value').replace( /,/,"." ))
                };
               console.log("Creating new explosion...");
                //TODO Implement
                var explosion = new Explosion(config);
                scene.addMesh(explosion.getMesh());
            });

            /**
             * Handler for animation checkbox.
             */
            $('#chkAnimationX').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Animation X started!');
                    this.animationInterval = setInterval(rotateX, 20, -0.01);
                } else {
                    console.log('Animation X stoppped!');
                    clearInterval(this.animationInterval);
                }
            });

            $('#chkAnimationY').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Animation Y started!');
                    this.animationInterval = setInterval(rotateY, 20, -0.01);
                } else {
                    console.log('Animation Y stoppped!');
                    clearInterval(this.animationInterval);
                }
            });

            $('#chkAnimationZ').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Animation Z started!');
                    this.animationInterval = setInterval(rotateZ, 20, -0.01);
                } else {
                    console.log('Animation Z stoppped!');
                    clearInterval(this.animationInterval);
                }
            });
        };

        // return the constructor function
        return HtmlController;


    })); // require



            
