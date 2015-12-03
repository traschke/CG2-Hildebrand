/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: BufferGeometry
 *
 * BufferGeometry Vertex-Arrays and Vertex-Attributes
 * stored in float32 arrays for the given attributes.
 * In our cases we assume all attributes have
 * numItems*3 size e.g. position (x, y, z), color (r, g, b)
 *
 * BufferGeometry is (at least for now) used to render Points with
 * vertexcolors.
 * Therefore we add a point material (THREE.PointsMaterial) and point container (THREE.Points).
 *
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var BufferGeometry = function (renderMesh, renderWireframe, renderPoints) {

            this.mesh     = undefined;
            this.geometry = new THREE.BufferGeometry();

            this.pointsMaterial = new THREE.PointsMaterial( {
                color: 0xaaaaaa,
                size: 10, vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            });

            this.meshMaterial = new THREE.MeshBasicMaterial( {
                /*color: 0xaaaaaa,*/
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            });

            this.wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                // Due to limitations in the ANGLE layer, on Windows platforms linewidth will always be 1 regardless of the set value.
                wireframeLinewidth: 1
            });

            this.materials = [];
            if (renderMesh) {
                this.materials.push(this.meshMaterial);
            }
            if(renderWireframe) {
                this.materials.push(this.wireframeMaterial);
            }
            if (renderPoints) {
                this.materials.push(this.pointsMaterial);
            }

            /**
             * Adds a vertex attribute, we assume each element has three components, e.g.
             * [position_x0, position_y0, position_z0, position_x1, position_y1, position_z1,...]
             * AddAttribute updates the mesh.
             *
             * @param name vertex attributes name, e.g. position, color, normal
             * @param buffer
             */
            this.addAttribute = function(name, buffer) {
                this.geometry.addAttribute( name, new THREE.BufferAttribute( buffer, 3 ) );
                this.geometry.computeBoundingSphere();
                if (renderPoints) {
                    this.mesh = new THREE.Points(this.geometry, this.pointsMaterial);
                } else {
                    this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.materials);
                }

            };

            this.getMesh = function() {
                return this.mesh;
            };

            this.setIndex = function (indices) {
                this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            }
        };

        return BufferGeometry;
    }));
