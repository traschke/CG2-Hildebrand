precision mediump float;

// = object.matrixWorld
//uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
//uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
//uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
//uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
//uniform mat3 normalMatrix;

// = camera position in world space
//uniform vec3 cameraPosition;

// default vertex attributes provided by Geometry and BufferGeometry
//attribute vec3 position;
//attribute vec3 normal;
//attribute vec2 uv;
//attribute vec2 uv2;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;

varying mat4 threeProjectionMatrix;


void main() {
    mat4 modelViewProjectionMatrix = projectionMatrix * modelViewMatrix;

    ecPosition = modelViewMatrix * vec4(position, 1.0);
    ecNormal = normalize(normalMatrix * normal);
    //TODO Calculate vUv

    threeProjectionMatrix = projectionMatrix;

    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
}

