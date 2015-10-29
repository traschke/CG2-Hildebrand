/*
 *
 * Module: parametric_curve
 *
 */


/* requireJS module definition */
define(["Scene", "PointDragger"],
    (function(xT, yT, minT, maxT, segments) {

        "use strict";


        var parametric_curve = function(xT, yT, minT, maxT, segments) {

            console.log("parametric_curve at [" +
            xT + "," + yT + minT + "," + maxT + "+" + segments);

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

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

            // return empty list
            this.createDraggers = function() {
                var draggers = [];
                return draggers;
            };


        };

        // this module only exports the constructor for StraightLine objects
        return Circle;

    })); // define

    
