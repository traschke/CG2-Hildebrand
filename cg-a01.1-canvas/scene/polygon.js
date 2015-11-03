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

        var Polygon = function(getP1, getP2, getP3, setP1, setP2, setP3, lineStyle) {

            this.getP1 = getP1;
            this.getP2 = getP2;
            this.getP3 = getP3;
            this.setP1 = setP1;
            this.setP2 = setP2;
            this.setP3 = setP3;

            this.lineStyle = lineStyle || { width: "1", color: "#0000AA" };

            // draw this polygon into the provided 2D rendering context
            this.draw = function(context) {
                var p1 = this.getP1();
                var p2 = this.getP2();
                var p3 = this.getP3();

                context.beginPath();
                console.log("go poly");

                context.moveTo(p1[0],p1[1]);
                context.lineTo(p2[0],p2[1]);
                context.moveTo(p2[0],p2[1]);
                context.lineTo(p3[0],p3[1]);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke(); 
            }

            this.mouseDrag = function(dragEvent) {
                // TODO Implement
            }

        };

             // return the constructor function
        return Polygon;


    })); // require

