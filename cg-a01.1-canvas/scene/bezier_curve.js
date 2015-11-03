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
define(["util", "vec2", "Scene", "PointDragger", "Polygon"],
    (function(util,vec2,Scene,PointDragger, Polygon) {

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
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.moveTo(this.p1[0], this.p1[1]);
                context.quadraticCurveTo(this.p2[0], this.p2[1], this.p3[0], this.p3[1]);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

            };

            // TODO Bezier Hit Function
            // TODO Bezier Polygon
            // test whether the mouse position is on this line segment
            this.isHit = function(context, pos) {
                //var poly = new Polygon(this.p1, this.p2, this.p3, this.lineStyle);
                //poly.draw(context);
                //console.log('Clicked: ', pos);
                //var retValue = context.isPointInPath(pos[0], pos[1]);
                //console.log('Return value: ', retValue);
                //return retValue;
                return true;
            };

            this.createPolygon = function() {
                var polyStyle = { width: "1", color: this.lineStyle.color }
                var polys = [];
                var _bezier = this;

                var getP1 = function() {
                    return _bezier.p1;
                };

                var getP2 = function() {
                    return _bezier.p2;
                };

                var getP3 = function() {
                    return _bezier.p3;
                }

                var setP1 = function(e) {
                    _bezier.p1 = e.position;
                };

                var setP2 = function(e) {
                    _bezier.p2 = e.position;
                };

                var setP3 = function(e) {
                    _bezier.p3 = e.position;
                }

                polys.push(new Polygon(getP1, getP2, getP3, setP1, setP2, setP3, polyStyle));

                return polys;
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
                    return _bezier.p1;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos2Dragger = function() {
                    return _bezier.p2;
                };

                /**
                 * Callback to get the position of the Middle dragger.
                 * @returns {*|number[]}
                 */
                var getPos3Dragger = function() {
                    return _bezier.p3;
                };

                var setP1 = function(dragEvent) {
                    _bezier.p1 = dragEvent.position;
                };
                var setP2 = function(dragEvent) {
                    _bezier.p2 = dragEvent.position;
                };
                var setP3 = function(dragEvent) {
                    _bezier.p3 = dragEvent.position;
                };

                draggers.push(new PointDragger(getPos1Dragger, setP1, draggerStyle));
                draggers.push(new PointDragger(getPos2Dragger, setP2, draggerStyle));
                draggers.push(new PointDragger(getPos3Dragger, setP3, draggerStyle));


                return draggers;

            }
        };



        // this module only exports the constructor for StraightLine objects
        return Bezier_curve;

    })); // define

    
