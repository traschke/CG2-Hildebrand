/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "Line", "Circle", "Point", "KdTree", "util", "kdutil", "Parametric_curve", "Bezier_curve"],
    (function($, Line, Circle, Point, KdTree, Util, KdUtil, Parametric_curve, Bezier_curve) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {

            var kdTree;
            var pointList = [];

            // generate random X coordinate within the canvas
            var randomX = function() {
                return Math.floor(Math.random()*(context.canvas.width-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function() {
                return Math.floor(Math.random()*(context.canvas.height-10))+5;
            };

            // generate random radius within the canvas
            var randomRadius = function() {
                return Math.floor(Math.random() * ((context.canvas.height / 2) - 10)) + 5;
            };

            // generate random color in hex notation
            var randomColor = function() {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function(byte) {
                    var s = byte.toString(16); // convert to hex string
                    if(s.length == 1) s = "0"+s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random()*25.9)*10;
                var g = Math.floor(Math.random()*25.9)*10;
                var b = Math.floor(Math.random()*25.9)*10;

                // convert to hex notation
                return "#"+toHex2(r)+toHex2(g)+toHex2(b);
            };

            /**
             * event handler for "new line button".
             */
            $("#btnNewLine").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var line = new Line( [randomX(),randomY()],
                    [randomX(),randomY()],
                    style );
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));

            /**
             * Event handler for the New Circle button. Creates a new random circle.
             */
            $("#btnNewCircle").click(function() {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var circle = new Circle([randomX(), randomY()], randomRadius(), style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw
            });

            /**
             * Event handler for the New Point button. Creates a new random point.
             */
            $("#btnNewPoint").click(function() {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var point = new Point([randomX(), randomY()], style);
                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw
            });

            /**
             * Event handler for the New Parametric curve button.
             */
            $("#btnNewParametricCurve").click(function() {
                try {
                    var xT = $("#inputXt").val();
                    var yT = $("#inputYt").val();

                    // Test eval
                    var t = 0;
                    eval(xT);
                    eval(yT);

                    // create the actual line and add it to the scene
                    var style = {
                        width: Math.floor(Math.random()*3)+1,
                        color: randomColor()
                    };

                    var parametric_curve = new Parametric_curve(xT, yT, $('#inputMint').val(), $("#inputMaxt").val(), $("#inputSegments").val(), style);
                    scene.addObjects([parametric_curve]);

                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(parametric_curve); // this will also redraw
                } catch (e) {
                        alert(e.message);
                }


            });

            /**
             * Event handler for the New Parametric curve button.
             */
            $("#btnNewBezierCurve").click(function() {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var bezier_curve = new Bezier_curve([randomX(), randomY()], [randomX(), randomY()], [randomX(), randomY()], style, $("#inputSegments").val());
                scene.addObjects([bezier_curve]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(bezier_curve); // this will also redraw
            });

            /**
             * Event handler that changes the color of the selected object if the color of
             * the input field is changed.
             */
            $("#inputColor").change(function() {
                var object = sceneController.getSelectedObject();
                object.lineStyle.color = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Event handler that changes the width of the selected object if the value of
             * the input field is changed.
             */
            $("#inputLineWidth").change(function() {
                var object = sceneController.getSelectedObject();
                object.lineStyle.width = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Event handler that changes the radius of the selected circle if the value of
             * the input field is changed.
             */
            $("#inputRadius").change(function() {
                var object = sceneController.getSelectedObject();
                object.radius = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Handles segments value change.
             */
            $('#inputSegments').change(function() {
                var object = sceneController.getSelectedObject();
                object.segments = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Handles tick marks visible.
             */
            $('#visTickMarks').change(function() {
                var obj = sceneController.getSelectedObject();
                if (obj instanceof Bezier_curve || obj instanceof Parametric_curve) {
                    // check if checkbox is cheked or not and set the drawMarks clause true or false
                    obj.drawMarks = $(this).is(':checked');
                    // redraw
                    sceneController.select(obj);
                }
            });

            /**
             * Handles minT value change.
             */
            $('#inputMint').change(function() {
                var object = sceneController.getSelectedObject();
                object.minT = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Handles maxT value change.
             */
            $('#inputMaxt').change(function() {
                var object = sceneController.getSelectedObject();
                object.maxT = this.value;
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(object);
            });

            /**
             * Creates a new Pointlist for kd-tree.
             */
            $("#btnNewPointList").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var numPoints = parseInt($("#numPoints").attr("value"));;
                for(var i=0; i<numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], style);
                    scene.addObjects([point]);
                    pointList.push(point);
                }

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            /**
             * Handle visualize kd-tree button click.
             */
            $("#visKdTree").click( (function() {

                var showTree = $("#visKdTree").attr("checked");
                if(showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));

            /**
             * Eventhandler for build the kd-tree button.
             */
            $("#btnBuildKdTree").click(function() {
                kdTree = new KdTree(pointList);
            });

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click( (function() {

                var style = {
                    width: 2,
                    color: "#ff0000"
                };
                var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint);

                console.log("query point: ", queryPoint.center);

                ////////////////////////////////////////////////
                // measure and compare timings of linear
                // and kd-nearest-neighbor search
                ////////////////////////////////////////////////
                var linearTiming;
                var kdTiming;
                var startTime = Date.now();
                var endTime;

                var minIdx = KdUtil.linearSearch(pointList, queryPoint);

                endTime = Date.now();
                linearTiming = endTime - startTime;

                console.log("nearest neighbor linear: ", pointList[minIdx].center);
                console.log("nearest neighbor linear took " + linearTiming + " msecs.");

                startTime = Date.now();

                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, 10000000, kdTree.root, 0);

                endTime = Date.now();
                kdTiming = endTime - startTime;

                console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center);
                console.log("nearest neighbor kd took " + kdTiming + " msecs.");

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

            /**
             * Event handler that updates the input field for the the line width and color
             * if an object is changed.
             */
            sceneController.onObjChange(function() {
                var object = this.getSelectedObject();
                $("#inputLineWidth").val(object.lineStyle.width);
                $("#inputColor").val(object.lineStyle.color);

                // Disable all controls
                $("#inputRadius").val(0);
                $("#inputRadius").prop("disabled", true);
                $('#visTickMarks').prop('disabled', true);

                // enable controls for specific object
                if (object instanceof Circle) {
                    $("#inputRadius").prop("disabled", false);
                    $("#inputRadius").val(object.radius);
                } else if (object instanceof Bezier_curve) {
                    $('#inputSegments').val(object.segments);
                    $('#visTickMarks').prop('checked', object.drawMarks);

                    $('#visTickMarks').prop('disabled', false);
                    $('#inputSegments').prop('disabled', false);
                } else if (object instanceof Parametric_curve) {
                    $('#inputSegments').val(object.segments);
                    $('#visTickMarks').prop('checked', object.drawMarks);
                    $('#inputXt').val(object.xT);
                    $('#inputYt').val(object.yT);
                    $('#inputMint').val(object.minT);
                    $('#inputMaxt').val(object.maxT);

                    $('#inputXt').prop('disabled', false);
                    $('#inputYt').prop('disabled', false);
                    $('#inputMint').prop('disabled', false);
                    $('#inputMaxt').prop('disabled', false);
                    $('#inputSegments').prop('disabled', false);
                    $('#visTickMarks').prop('disabled', false);
                }

            });

            /**
             * Event handler that updates the input field for the line width and color
             * if an object is selected.
             */
            sceneController.onSelection(function() {
                var object = this.getSelectedObject();
                $("#inputLineWidth").val(object.lineStyle.width);
                $("#inputColor").val(object.lineStyle.color);
                // Disable all controls
                $("#inputRadius").val(0);
                $("#inputRadius").prop("disabled", true);
                $('#visTickMarks').prop('disabled', true);

                // enable controls for specific object
                if (object instanceof Circle) {
                    $("#inputRadius").prop("disabled", false);
                    $("#inputRadius").val(object.radius);
                } else if (object instanceof Bezier_curve) {
                    $('#visTickMarks').prop('checked', object.drawMarks);
                    $('#visTickMarks').prop('disabled', false);
                    $('#inputSegments').prop('disabled', false);
                } else if (object instanceof Parametric_curve) {
                    $('#visTickMarks').prop('checked', object.drawMarks);
                    $('#inputXt').prop('disabled', false);
                    $('#inputYt').prop('disabled', false);
                    $('#inputMint').prop('disabled', false);
                    $('#inputMaxt').prop('disabled', false);
                    $('#inputSegments').prop('disabled', false);
                    $('#visTickMarks').prop('disabled', false);
                }
            });
        };



        // return the constructor function
        return HtmlController;


    })); // require



            
