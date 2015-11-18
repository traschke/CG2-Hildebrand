/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three", 'parametric'],
    (function(THREE, ParametricSurface) {

        "use strict";

        var Cosine = function (a, b, c, config) {

            this.config = config;

            /*var HornFunction = function(u, v) {
                var x = (a + u * Math.cos(v)) * Math.sin(b * Math.PI * u);
                var y = (a + u * Math.cos(v)) * Math.cos(b * Math.PI * u) + c * u;
                var z = u * Math.sin(v);
                return[x, y, z]
            };*/

            var HornFunction = function(u, v) {
                var x = Math.cos(u) * a;
                var y = Math.cos(v) * b;
                var z = Math.cos(u + v) * c;
                return[x, y, z]
            };

            var parametricSurface = new ParametricSurface(HornFunction, this.config);

            this.positions = parametricSurface.getPositions();
            this.colors = parametricSurface.getColors();

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

        };

        return Cosine;
    }));

