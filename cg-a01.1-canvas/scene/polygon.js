define([],
    (function() {

        "use strict";

        /**
         * A polygon with 3 points. Is used by Bezier_curve to draw its polygon.
         *
         * @param getP1 The function to get position array ([x, y]) of point 1.
         * @param getP2 The function to get position array ([x, y]) of point 2.
         * @param getP3 The function to get position array ([x, y]) of point 3.
         * @param setP1 The function to set position array ([x, y]) of point 1.
         * @param setP2 The function to set position array ([x, y]) of point 2.
         * @param setP3 The function to set position array ([x, y]) of point 3.
         * @param lineStyle object defining width and color attributes for line drawing, begin of the form { width: 2, color: "#00FF00" }
         * @constructor
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

        };

             // return the constructor function
        return Polygon;


    })); // require

