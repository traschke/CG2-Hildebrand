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
         * A simple point that can be dragged.
         *
         * @param center Array object representing [x,y] coordinates of the points center.
         * @param lineStyle Object defining width and color attributes for line drawing, begin of the form { width: 2, color: "#00FF00" }
         * @constructor
         */
        var Point = function(center, lineStyle) {

            console.log("creating point at", center);

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // initial values in case either point is undefined
            this.center = center || [10,10];
            this.radius = 5;

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.fillStyle = this.lineStyle.color;
                // fill the circle
                context.fill();
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
                var getMiddle = function() { return _circle.center; };
                var setMiddle = function(dragEvent) { _circle.center = dragEvent.position; };
                draggers.push( new PointDragger(getMiddle, setMiddle, draggerStyle) );

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Point;

    })); // define

    
