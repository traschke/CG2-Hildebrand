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

        var Funnel = function (a, b, c, config) {

            this.config = config;

            var FunnelFunction = function(u, v) {
                var x = u * Math.cos(v) * a;
                var y = u * Math.sin(v) * b;
                var z = Math.log(u) * c;
                return[x, y, z]
            };

            var parametricSurface = new ParametricSurface(FunnelFunction, this.config);

            this.positions = parametricSurface.getPositions();
            this.colors = parametricSurface.getColors();

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

        };

        return Funnel;
    }));

