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
define(["jquery", "BufferGeometry", "random", "band", 'ellipsoid'],
    (function($,BufferGeometry, Random, Band, Ellipsoid) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            /**
             * The interval that handles the animation.
             */
            this.animationInterval;

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
            $('#ellipsoid').hide();

            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
                $('#ellipsoid').hide();
            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
                $('#ellipsoid').hide();
            }));

            $('#btnEllipsoid').click(function() {
                $("#random").hide();
                $("#band").hide();
                $('#ellipsoid').show();
            });

            $("#btnNewRandom").click( (function() {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
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


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));

            $('#btnNewEllipsoid').click(function() {
                var config = {
                    umin : parseInt($('#numUmin').attr('value')),
                    umax : parseInt($('#numUmax').attr('value')),
                    vmin : parseInt($('#numVmin').attr('value')),
                    vmax : parseInt($('#numVmax').attr('value')),
                    uSegments : parseInt($('#numUSegments').attr('value')),
                    vSegments : parseInt($('#numVSegments').attr('value'))
                };

                var a = parseInt($('#numA').attr('value'));
                var b = parseInt($('#numB').attr('value'));
                var c = parseInt($('#numC').attr('value'));

                var ellipsoid = new Ellipsoid(a, b, c, config);
                var bufferGeometryEllipsoid = new BufferGeometry();
                bufferGeometryEllipsoid.addAttribute('position', ellipsoid.getPositions());
                bufferGeometryEllipsoid.addAttribute('color', ellipsoid.getColors());

                scene.addBufferGeometry(bufferGeometryEllipsoid);
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



            
