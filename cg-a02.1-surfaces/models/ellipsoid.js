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

        var Ellipsoid = function (a, b, c, config) {

            this.config = config;

            var EllipsoidFunction = function(u, v) {
                var x = Math.sin(u) * Math.sin(v) * a;
                var y = Math.cos(u) * Math.sin(v) * b;
                var z = Math.cos(v) * c;
                return[x, y, z]
            };

            var parametricSurface = new ParametricSurface(EllipsoidFunction, this.config);

            this.positions = parametricSurface.getPositions();
            this.colors = parametricSurface.getColors();

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

        };

        return Ellipsoid;
    }));

