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
         * A bezier curve with 3 points can be dragged around by its points.
         *
         * @param p1 Point 1 of bezier.
         * @param p2 Point 2 of bezier.
         * @param p3 Point 3 of bezier.
         * @param lineStyle object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         * @param segments Number of segments.
         * @constructor
         */
        var Bezier_curve = function(p1, p2, p3, lineStyle, segments) {
            console.log("creating bezier curve at ", p1, p2, p3, "with linestyle", lineStyle, "and", segments, "segments");

            /**
             * Point1
             */
            this.p1 = p1;

            /**
             * Point 2.
             */
            this.p2 = p2;

            /**
             * Point 3.
             */
            this.p3 = p3;

            /**
             * Number of segments of the bezier.
             * @type {*|number}
             */
            this.segments = segments || 10;

            /**
             * draw style for drawing the line.
             * @type {*|{width: string, color: string}}
             */
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            /**
             * Switch which determines whether do draw tick marks or not.
             * @type {boolean}
             */
            this.drawMarks = false;

            /**
             * Array of the points of the bezier.
             * @type {Array} [x, y]
             */
            this.pointList = [];

            /**
             * Bernstein polynom 0.
             * @param t
             * @returns {number}
             */
            this.b0 = function(t) {
                return Math.pow(1 - t, 3);
            };

            /**
             * Berstein polynom 1.
             * @param t
             * @returns {number}
             */
            this.b1 = function(t) {
                return 3 * Math.pow(1 - t, 2) * t;
            };

            /**
             * Bernstein polynom 2.
             * @param t
             * @returns {number}
             */
            this.b2 = function(t) {
                return 3 * (1 - t) * Math.pow(t, 2);
            };

            /**
             * Bernstein polynom 3.
             * @param t
             * @returns {number}
             */
            this.b3 = function(t) {
                return Math.pow(t, 3);
            };

            /**
             * Draws bezier to provided context.
             * @param context
             */
            this.draw = function(context) {
                this.pointList = [];

                // first point
                this.pointList.push(this.p1);

                // calculate other points
                for (var i = 1; i <= this.segments; i++) {
                    // t := 0..1
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

            /**
             * test whether the mouse position is on this line segment.
             * @param context
             * @param pos Position which will be checked.
             * @returns {boolean}
             */
            this.isHit = function(context, pos) {
                var t = 0;
                for (var i = 0; i < this.pointList.length - 1; i++) {
                    // project point on line, get parameter of that projection point
                    t = vec2.projectPointOnLine(pos, this.pointList[i], this.pointList[i + 1]);

                    // inside the line segment?
                    if (t >= 0 && t <= 1) {
                        // coordinates of the projected point
                        var p = vec2.add(this.pointList[i], vec2.mult(vec2.sub(this.pointList[i + 1], this.pointList[i]), t));

                        // distance of the point from the line
                        var distance = vec2.length(vec2.sub(p, pos));

                        // allow 2 pixels extra "sensitivity"
                        if (distance <= (this.lineStyle.width / 2) + 2) {
                            return true;
                        }
                    }
                }
                // if no segment matches, return false
                return false;
            };

            /**
             * Creates polygon of bezier and returns it in an array.
             * @returns {Array}
             */
            this.createPolygon = function() {
                var polyStyle = { width: "1", color: this.lineStyle.color }
                var polys = [];
                var _bezier = this;

                /**
                 * Callback to get Point 1 of the polygon.
                 * @returns {Array}
                 */
                var getP1 = function() {
                    return _bezier.p1;
                };

                /**
                 * Callback to get Point 2 of the polygon.
                 * @returns {Array}
                 */
                var getP2 = function() {
                    return _bezier.p2;
                };

                /**
                 * Callback to get Point 3 of the polygon.
                 * @returns {Array}
                 */
                var getP3 = function() {
                    return _bezier.p3;
                };

                /**
                 * Callback to set Point 1 of the polygon.
                 * @param e DragEvent.
                 */
                var setP1 = function(e) {
                    _bezier.p1 = e.position;
                };

                /**
                 * Callback to set Point 2 of the polygon.
                 * @param e DragEvent.
                 */
                var setP2 = function(e) {
                    _bezier.p2 = e.position;
                };

                /**
                 * Callback to set Point 3 of the polygon.
                 * @param e DragEvent.
                 */
                var setP3 = function(e) {
                    _bezier.p3 = e.position;
                }

                polys.push(new Polygon(getP1, getP2, getP3, setP1, setP2, setP3, polyStyle));

                return polys;
            };

            /**
             * return list of draggers to manipulate this bezier.
             * @returns {Array}
             */
            this.createDraggers = function() {

                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
                var draggers = [];
                var _bezier = this;

                /**
                 * Callback to get the position of the dragger of Point 1.
                 * @returns {*|number[]}
                 */
                var getPos1Dragger = function() {
                    return _bezier.p1;
                };

                /**
                 * Callback to get the position of the dragger of Point 2.
                 * @returns {*|number[]}
                 */
                var getPos2Dragger = function() {
                    return _bezier.p2;
                };

                /**
                 * Callback to get the position of dragger of Point 3.
                 * @returns {*|number[]}
                 */
                var getPos3Dragger = function() {
                    return _bezier.p3;
                };

                /**
                 * Callback to set the position of Point 1.
                 * @param dragEvent
                 */
                var setP1 = function(dragEvent) {
                    _bezier.p1 = dragEvent.position;
                };

                /**
                 * Callback to set the position of Point 2.
                 * @param dragEvent
                 */
                var setP2 = function(dragEvent) {
                    _bezier.p2 = dragEvent.position;
                };
                /**
                 * Callback to set the position of Point 3.
                 * @param dragEvent
                 */

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

    
