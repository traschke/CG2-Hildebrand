/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: kdtree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "vec2", "Scene", "KdNode", "BoundingBox"],
    (function(KdUtil, vec2, Scene, KdNode, BoundingBox) {

        "use strict";

        /**
         * Creates a kd-tree. The build function is directly called
         * on generation
         *
         * @param pointList
         * @constructor
         */
        var KdTree = function (pointList) {

            /**
             *
             * @param pointList - list of points
             * @param dim       - current axis
             * @param parent    - current parent (starts with root)
             * @param isLeft    - flag if node is left or right child of its parent
             * @returns returns root node after tree is build
             */
            this.build = function(pointList, dim, parent, isLeft) {
                //console.log("This is pointlist of build()-function: ", pointList);

                if (pointList.length === 0) {
                    return undefined;
                }

                // IMPLEMENT!
                // create new node
                var node = new KdNode(dim);

                // find median position in pointList
                var medianPos = KdUtil.median(pointList, dim);
                var medianPoint = pointList[medianPos];
                //console.log("This is the median at pos " + medianPos + ": ", medianPoint);
                
                // compute next axis
                var nextAxis;
                if (dim === 0) {
                    nextAxis = 1;
                } else {
                    nextAxis = 0;
                }

                // set point in node
                node.point = medianPoint;
                
                // compute bounding box for node
                // check if node is root (has no parent)
                // 
                // take a look in findNearestNeighbor why we 
                // need this bounding box!
                var bbox;
                if( !parent ) {
                    // Note: hardcoded canvas size here
                    bbox = new BoundingBox(0, 0, 500, 400, medianPoint, dim);
                } else {
                    // create bounding box and distinguish between axis and which side (left/right) the node is on
                    // 0=x, 1=y
                    if (dim === 0) {
                        if (isLeft) {
                            var newXMin = parent.bbox.xmin;
                            var newXMax = parent.bbox.xmax;
                            var newYMin = parent.bbox.ymin;
                            var newYMax = parent.point.center[1];
                            bbox = new BoundingBox(newXMin, newYMin, newXMax, newYMax, medianPoint, dim);
                        } else {
                            var newXMin = parent.bbox.xmin;
                            var newXMax = parent.bbox.xmax;
                            var newYMin = parent.point.center[1];
                            var newYMax = parent.bbox.ymax;
                            bbox = new BoundingBox(newXMin, newYMin, newXMax, newYMax, medianPoint, dim);
                        }
                    } else {
                        if (isLeft) {
                            var newXMin = parent.bbox.xmin;
                            var newXMax = parent.point.center[0];
                            var newYMin = parent.bbox.ymin;
                            var newYMax = parent.bbox.ymax;
                            bbox = new BoundingBox(newXMin, newYMin, newXMax, newYMax, medianPoint, dim);
                        } else {
                            var newXMin = parent.point.center[0];
                            var newXMax = parent.bbox.xmax;
                            var newYMin = parent.bbox.ymin;
                            var newYMax = parent.bbox.ymax;
                            bbox = new BoundingBox(newXMin, newYMin, newXMax, newYMax, medianPoint, dim);
                        }
                    }
                }
                node.bbox = bbox;

                // create point list left/right and
                var leftChildren = pointList.slice(0, medianPos);
                var rightChildren = pointList.slice(medianPos + 1);

                // call build for left/right arrays
                node.leftChild = this.build(leftChildren, nextAxis, node, true);
                node.rightChild = this.build(rightChildren, nextAxis, node, false);
                
                // return root node
                return node;
            };

            /**
             * Given a query point the function return its nearest neighbor by traversing
             * down the tree
             *
             * @param node - current tree node
             * @param query - query node
             * @param nearestDistance - current nearest distance to query node
             * @param currentBest - current best/nearest node to query node
             * @param dim - current axis (x or y)
             * @returns closest tree node to query node
             */
            this.findNearestNeighbor = function(node, query, nearestDistance, currentBest, dim) {

                if( !node ) {
                    return currentBest;
                }

                var closest = currentBest;
                var closestDistance = nearestDistance;

                var dist = KdUtil.distance(node.point.center, query.center);
                if( dist < nearestDistance ) {
                    closestDistance = dist;
                    closest = node;
                }

                var first, second;
                if (dim == 0) {
                    if ( query.center[0] < node.point.center[0]) {
                        first = node.leftChild;
                        second = node.rightChild;
                    } else {
                        first = node.rightChild;
                        second = node.leftChild;
                    }
                } else {
                    if (query.center[1] < node.point.center[1]) {
                        first = node.leftChild;
                        second = node.rightChild;
                    } else {
                        first = node.rightChild;
                        second = node.leftChild;
                    }
                }

                var nextDim = (dim === 0) ? 1 : 0;
                if( first && first.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(first, query, closestDistance, closest, nextDim);
                    closestDistance = KdUtil.distance(closest.point.center, query.center);
                }

                if( second && second.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(second, query, closestDistance, closest, nextDim);
                }

                return closest;
            };


            //
            this.root = this.build(pointList, 0);
            console.log(" this is the root: ", this.root);

        };

        return KdTree;


    })); // define


