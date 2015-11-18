/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var ParametricSurface = function (posFunc, config) {

            var umin = config.umin;
            var umax = config.umax;
            var vmin = config.vmin;
            var vmax = config.vmax;
            var uSegments = config.uSegments;
            var vSegments = config.vSegments;

            this.positions = new Float32Array(uSegments * vSegments);
            this.colors = new Float32Array(uSegments * vSegments);

            var color = new THREE.Color();

            for (var i = 0; i < uSegments; i++) {
                var u = Math.floor(((umax - umin) / uSegments) * i);
                for (var j = 0; j < vSegments; j++) {
                    var v = Math.floor(((vmax - vmin) / uSegments) * j);
                    var x = Math.sin(u) * Math.sin(v);
                    var y = Math.cos(u) * Math.sin(v);
                    var z = Math.cos(v);
                    var position = [x, y, z];
                    this.positions[i * j] = position;
                }
            }

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

        };

        return ParametricSurface;
    }));

