/*
 *
 * Module: parametric_curve
 *
 */


/* requireJS module definition */
define(["Scene", "PointDragger", "Point", "Line"],
    (function(xT, yT, minT, maxT, segments, Point, Line) {

        "use strict";


        var Parametric_curve = function(xT, yT, minT, maxT, segments, lineStyle) {

            console.log("parametric_curve at :" +
            xT + "," + yT + "," + minT + "," + maxT + "+" + segments);

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();
                var pointList = [];
                var abstand = (maxT - minT) / segments;
                console.log(abstand);

                // berechnung
                for( var x = 0; x < segments; x++){
                    var t = minT + x*abstand;
                    // set points to be drawn
                    console.log("funktion: " + xT)
                    var x1 = eval(xT);
                    var y1 = eval(yT);
                    console.log(x1 + " , " + y1);

                    pointList.push({x:x1, y:y1});
                }

                // zeichenn
                for(var l = 0; l < pointList.length-1; l++){
                    console.log(pointList[l] + " , " + pointList[l+1]);

                   context.moveTo(pointList[l].x,pointList[l].y); 
                   context.lineTo(pointList[l+1].x,pointList[l+1].y); 

                   context.lineWidth = this.lineStyle.width;
                   context.strokeStyle = this.lineStyle.color;
                }

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
        return Parametric_curve;

    })); // define

    
