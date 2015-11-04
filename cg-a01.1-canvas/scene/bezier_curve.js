/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: straight_line
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger", "Polygon"],
    (function(util,vec2,Scene,PointDragger, Polygon) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Bezier_curve = function(p1, p2, p3, lineStyle, segments) {
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.segments = segments || 10;
            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            this.drawMarks = false;

            this.pointList = [];

            this.b0 = function(t) {
                return Math.pow(1 - t, 3);
            };

            this.b1 = function(t) {
                return 3 * Math.pow(1 - t, 2) * t;
            };

            this.b2 = function(t) {
                return 3 * (1 - t) * Math.pow(t, 2);
            }

            this.b3 = function(t) {
                return Math.pow(t, 3);
            }

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                this.pointList = [];

                // first point
                this.pointList.push(this.p1);

                // calculate other points
                for (var i = 1; i <= this.segments; i++) {
                    var t = 1 / this.segments * i;

                    var px = (this.b0(t) * this.p1[0])
                        + (this.b1(t) * this.p2[0])
                        + (this.b2(t) * this.p2[0])
                        + (this.b3(t) * this.p3[0]);

                    var py = (this.b0(t) * this.p1[1])
                        + (this.b1(t) * this.p2[1])
                        + (this.b2(t) * this.p2[1])
                        + (this.b3(t) * this.p3[1]);

                    this.pointList.push([px, py]);
                }

                // draw bezier curve
                context.beginPath();

                context.moveTo(this.pointList[0][0], this.pointList[0][1]);
                for (var i = 1; i < this.pointList.length; i++) {
                    context.lineTo(this.pointList[i][0], this.pointList[i][1]);
                }

                // set drawing style for bezier curve
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing bezier curve
                context.stroke();

                if (this.drawMarks) {
                    // draw tick marks
                    var tickLengthPx = 30;

                    context.beginPath();

                    // start with second point
                    for (var i = 1; i < this.segments; i++) {
                        // Calculate distance between the points neighbors
                        var dist = vec2.sub(this.pointList[(i + 1)], this.pointList[(i - 1)]);
                        // calc the normal
                        var norm = [dist[1] * (-1), dist[0]];
                        // normalize the vector
                        var normalized = vec2.mult(norm, (1 / vec2.length(norm)));

                        var tickBegin = vec2.add(this.pointList[i], vec2.mult(normalized, tickLengthPx / 2));
                        var tickEnd = vec2.sub(this.pointList[i], vec2.mult(normalized, tickLengthPx / 2));

                        context.moveTo(tickBegin[0], tickBegin[1]);
                        context.lineTo(tickEnd[0], tickEnd[1]);
                    }
                    // set drawing style for tick marks
                    context.lineWidth = "1";
                    context.strokeStyle = "#FF0000";


                    // actually start drawing tick marks
                    context.stroke();
                }
            };

            // test whether the mouse position is on this line segment
            this.isHit = function(context, pos) {
                var t = 0;
                for (var i = 0; i < this.pointList.length - 1; i++) {
                    t = vec2.projectPointOnLine(pos, this.pointList[i], this.pointList[i + 1]);
                    if (t >= 0 && t <= 1) {
                        var p = vec2.add(this.pointList[i], vec2.mult(vec2.sub(this.pointList[i + 1], this.pointList[i]), t));
                        var distance = vec2.length(vec2.sub(p, pos));
                        if (distance <= (this.lineStyle.width / 2) + 2) {
                            return true
                        }
                    }
                }
                return false;
            };

            this.createPolygon = function() {
                var polyStyle = { width: "1", color: this.lineStyle.color }
                var polys = [];
                var _bezier = this;

                var getP1 = function() {
                    return _bezier.p1;
                };

                var getP2 = function() {
                    return _bezier.p2;
                };

                var getP3 = function() {
                    return _bezier.p3;
                }

                var setP1 = function(e) {
                    _bezier.p1 = e.position;
                };

                var setP2 = function(e) {
                    _bezier.p2 = e.position;
                };

                var setP3 = function(e) {
                    _bezier.p3 = e.position;
                }

                polys.push(new Polygon(getP1, getP2, getP3, setP1, setP2, setP3, polyStyle));

                return polys;
            };

            // return list of draggers to manipulate this line
            this.createDraggers = function() {

                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
                var draggers = [];
                var _bezier = this;

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos1Dragger = function() {
                    return _bezier.p1;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos2Dragger = function() {
                    return _bezier.p2;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos3Dragger = function() {
                    return _bezier.p3;
                };

                var setP1 = function(dragEvent) {
                    _bezier.p1 = dragEvent.position;
                };
                var setP2 = function(dragEvent) {
                    _bezier.p2 = dragEvent.position;
                };
                var setP3 = function(dragEvent) {
                    _bezier.p3 = dragEvent.position;
                };

                draggers.push(new PointDragger(getPos1Dragger, setP1, draggerStyle));
                draggers.push(new PointDragger(getPos2Dragger, setP2, draggerStyle));
                draggers.push(new PointDragger(getPos3Dragger, setP3, draggerStyle));


                return draggers;

            }
        };



        // this module only exports the constructor for StraightLine objects
        return Bezier_curve;

    })); // define

    
