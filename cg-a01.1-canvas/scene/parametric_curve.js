/*
 *
 * Module: parametric_curve
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", ],
    (function(util, vec2, Scene) {


        "use strict";

        /**
         * A parametric curve. Cannot be dragged or moved.
         *
         * @param xT The function for the x values.
         * @param yT The function for the y values.
         * @param minT The minimum t.
         * @param maxT The maximum t.
         * @param segments Number of segments.
         * @param lineStyle Object defining width and color attributes for line drawing, begin of the form { width: 2, color: "#00FF00" }
         * @constructor
         */
        var Parametric_curve = function(xT, yT, minT, maxT, segments, lineStyle) {
            console.log("Creating parametric curve with x(t)=", xT, ", y(t)=", yT, ", minT=", minT, "maxT=", maxT, ",", segments, "segments and linestyle", lineStyle);

            /**
             * Function for the x values.
             */
            this.xT = xT;

            /**
             * Function for the y values.
             */
            this.yT = yT;

            /**
             * Value of minT.
             */
            this.minT = minT;

            /**
             * Value of maxT.
             */
            this.maxT = maxT;

            /**
             * Number of segments.
             * @type {*|number}
             */
            this.segments = segments || 10;

            /**
             * Array of the points of the parametric curve.
             * @type {Array} [x, y]
             */
            this.pointList = [];

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


            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                this.pointList = [];

                var abstand = (this.maxT - this.minT) / this.segments;
                //console.log('Abstand: ', abstand);

                // calculate points
                for( var i = 0; i <= this.segments; i++){
                    // t seems to be not used, but it is used in eval() function
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

            // test whether the mouse position is on this line segment
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

            // return empty list
            this.createDraggers = function() {
                var draggers = [];
                return draggers;
            };
        };

        // this module only exports the constructor for StraightLine objects
        return Parametric_curve;

    })); // define

    
