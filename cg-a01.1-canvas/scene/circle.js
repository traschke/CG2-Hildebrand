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
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util,vec2,Scene,PointDragger) {

        "use strict";

        /**
         * A simple circle that can be dragged and resized.
         *
         * @param center Array object representing [x,y] coordinates of the center.
         * @param radius The radius of the circle.
         * @param lineStyle object defining width and color attributes for line drawing, begin of the form { width: 2, color: "#00FF00" }
         * @constructor
         */
        var Circle = function(center, radius, lineStyle) {

            console.log("creating circle at", center, "with radius of", radius);

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // initial values in case either point is undefined
            this.center = center || [10,10];
            this.radius = radius || 10;

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);

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

                // create closure and callbacks for dragger
                var _circle = this;

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPosMiddleDragger = function() {
                    return _circle.center;
                };

                /**
                 * Callback to change the circle position.
                 * @param dragEvent
                 */
                var setMiddle = function(dragEvent) {
                    _circle.center = dragEvent.position;
                };

                /**
                 * Callback to get the position of the Radius dragger.
                 * @returns {*[]}
                 */
                var getPosRadiusDragger = function() {
                    return [
                        _circle.center[0] + (_circle.radius / 2),
                        _circle.center[1] + (_circle.radius / 2)
                    ];
                }

                /**
                 * Callback to change the circle radius.
                 * @param dragEvent
                 */
                var setRadius = function(dragEvent) {
                    var newRadius = _circle.radius + dragEvent.delta[0];
                    // Check if radius is bigger than 0.
                    if (newRadius > 0) {
                        _circle.radius = newRadius;
                    }
                }

                draggers.push(new PointDragger(getPosMiddleDragger, setMiddle, draggerStyle));
                draggers.push(new PointDragger(getPosRadiusDragger, setRadius, draggerStyle));

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Circle;

    })); // define

    
