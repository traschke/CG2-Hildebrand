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
define(["util", "vec2", "Scene", "PointDragger", "Point", "Polygon"],
    (function(util,vec2,Scene,PointDragger,Point,Polygon) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Bezier_curve = function(p1, p2, p3, lineStyle) {

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.moveTo(p1.center[0],p1.center[1]);
                context.quadraticCurveTo(p2.center[0], p2.center[1], p3.center[0], p3.center[1])

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

            };

            // test whether the mouse position is on this line segment
            this.isHit = function(context,mousePos) {

                // what is my current position?
                var middle = this.center;

                // check whether distance between mouse and dragger's center
                // is less or equal ( radius + (line width)/2 )
                var dx = mousePos[0] - middle[0];
                var dy = mousePos[1] - middle[1];
                var radius = this.radius;
                return (dx*dx + dy*dy) <= (radius*radius);

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
                    console.log("P1: " + p1.center);
                    return p1.center;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos2Dragger = function() {
                    console.log("P2: " + p2.center);
                    return p2.center;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos3Dragger = function() {
                    console.log("P3: " + p3.center);
                    return p3.center;
                };

                /**
                 * Callback to change the circle position.
                 * @param dragEvent
                 */
                var setMiddle = function(dragEvent) {
                    _bezier.center = dragEvent.position;
                }

                /**
                 * Callback to change the circle radius.
                 * @param dragEvent
                 */
                var setRadius = function(dragEvent) {
                    var newRadius = _bezier.radius + dragEvent.delta[0];
                    // Check if radius is bigger than 0.
                    if (newRadius > 0) {
                        _bezier.radius = newRadius;
                    }
                }
                var setP1 = function(dragEvent) { _bezier.p1 = dragEvent.position; };
                var setP2 = function(dragEvent) { _bezier.p2 = dragEvent.position; };
                var setP3 = function(dragEvent) { _bezier.p3 = dragEvent.position; };

                draggers.push(new PointDragger(getPos1Dragger, setP1, draggerStyle));
                draggers.push(new PointDragger(getPos2Dragger, setP2, draggerStyle));
                draggers.push(new PointDragger(getPos3Dragger, setP3, draggerStyle));

                var poly = new Polygon(p1, p2, p3);
                console.log(poly);
                poly.draw();

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Bezier_curve;

    })); // define

    
