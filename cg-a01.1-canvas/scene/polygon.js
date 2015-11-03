define(["util", "vec2", "Scene", "PointDragger", "Point"],
    (function(util,vec2,Scene,PointDragger,Point) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Polygon = function(p1, p2, p3, lineStyle) {

            this.lineStyle = lineStyle || { width: "1", color: "#0000AA" };

            // draw this polygon into the provided 2D rendering context
            this.draw = function(context) {
                context.beginPath();
                console.log("go poly");

                context.moveTo(p1.center[0],p1.center[1]);
                context.lineTo(p2.center[0],p2.center[1]);
                context.moveTo(p2.center[0],p2.center[1]);
                context.lineTo(p3.center[0],p3.center[1]);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke(); 
            }

        };

             // return the constructor function
        return Polygon;


    })); // require

