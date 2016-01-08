precision mediump float;

//THREE.js built-in
//uniform mat4 viewMatrix;
//uniform vec3 cameraPosition;

uniform vec3 diffuseMaterial;
uniform vec3 specularMaterial;
uniform vec3 ambientMaterial;
uniform float shininessMaterial;

uniform vec3 ambientLight;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;

void main() {
    //bool useOrtho = projectionMatrix[2][3] == 0;
    //vec3 viewDir = useOrtho ? vec3(0, 0, 1) : normalize(-ecPosition.xyz);
    //gl_FragColor = vec4(phong(ecPosition, ecNormal, viewDir), 1.0);

    gl_FragColor = vec4(diffuseMaterial, 1.0);
}

vec3 phong(vec3 p, vec3 v, vec3 n, vec3 lightPos, vec3 lightColor) {
    if(dot(v,n) < 0.0)
        return vec3(0,0,0); // back-face

    vec3 toLight = normalize(lightPos - p);
    vec3 reflectLight = reflect(-toLight, n);

    float ndots = max( dot(toLight,n), 0.0);
    float rdotv = max( dot(reflectLight, v), 0.0);

    vec3 ambi = ambientMaterial * ambientLight;
    vec3 diff = diffuseMaterial * ndots * lightColor;
    vec3 spec = specularMaterial * pow(rdotv, shininessMaterial ) * lightColor;

    return ambi + diff + spec;
}
