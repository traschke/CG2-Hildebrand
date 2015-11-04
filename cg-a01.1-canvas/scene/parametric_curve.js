/*
 *
 * Module: parametric_curve
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", ],
    (function(util, vec2, Scene) {


        "use strict";


        var Parametric_curve = function(xT, yT, minT, maxT, segments, lineStyle) {

            // function for x
            this.xT = xT;
            // function for y
            this.yT = yT;

            this.minT = minT;
            this.maxT = maxT;
            this.segments = segments || 10;

            this.pointList = [];

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
            this.drawMarks = false;


            // draw this line into the provided 2D rendering context
            this.draw = function(context) {
                console.log('x(t): ', this.xT);
                console.log('y(t): ', this.yT);

                this.pointList = [];

                var abstand = (this.maxT - this.minT) / this.segments;
                console.log('Abstand: ', abstand);

                // calculate points
                for( var i = 0; i <= this.segments; i++){
                    var t = this.minT + i * abstand;
                    var px = eval(this.xT);
                    var py = eval(this.yT);
                    //console.log(this.xT, ' = ', px);
                    //console.log(this.yT, ' = ', py);

                    this.pointList.push([px, py]);
                }

                // draw actual parametric curve
                context.beginPath();
                context.moveTo(this.pointList[0][0], this.pointList[0][1]);
                for (var i = 1; i < this.pointList.length; i++){
                    context.lineTo(this.pointList[i][0], this.pointList[i][1]);
                }

                // set drawing style for parametric curve
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

                if (this.drawMarks) {
                    // draw tick marks
                    context.beginPath();
                    for (var i = 1; i < this.segments; i++) {
                        var appr = vec2.sub(this.pointList[(i + 1)], this.pointList[(i - 1)]);
                        var norm = [appr[1] * (-1), appr[0]];
                        var normalizedVecN = vec2.mult(norm, (1 / vec2.length(norm)));

                        var tickBegin = vec2.add(this.pointList[i], vec2.mult(normalizedVecN, 10));
                        var tickEnd = vec2.sub(this.pointList[i], vec2.mult(normalizedVecN, 10));

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

            // return empty list
            this.createDraggers = function() {
                var draggers = [];
                return draggers;
            };
        };

        // this module only exports the constructor for StraightLine objects
        return Parametric_curve;

    })); // define

    
