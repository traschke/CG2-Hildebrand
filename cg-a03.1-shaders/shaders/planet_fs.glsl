precision mediump float;

//THREE.js built-in
//uniform mat4 viewMatrix;
//uniform vec3 cameraPosition;

// uniform lights (we only have the sun)
uniform vec3 directionalLightColor[1];
uniform vec3 directionalLightDirection[1];

uniform vec3 ambientLightColor[1];

// uniform material constants k_a, k_d, k_s, alpha
uniform vec3 diffuseMaterial;
uniform vec3 specularMaterial;
uniform vec3 ambientMaterial;
uniform float shininessMaterial;

// uniform sampler2D textures
uniform sampler2D textureDay;
uniform sampler2D textureCloud;
uniform sampler2D textureNight;
uniform sampler2D textureTopo;

// three js only supports int no bool
// if you want a boolean value in the shader, use int
uniform int showDayTexture;
uniform int showNightTexture;
uniform int showCloudTexture;

// data from the vertex shader
varying vec4 ecPosition;
varying vec3 ecNormal;
// Texture coordinates vUv
varying vec2 vUv;
varying mat4 threeProjectionMatrix;


/*
void main() {


    // get color from different textures
    //vec3 color = texture2D(textureUniform, texCoord).rgb;
   
    // normalize normal after projection
    
    // do we use a perspective or an orthogonal projection matrix?
    //bool usePerspective = projectionMatrix[2][3] != 0.0;
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    
    // calculate color using phong illumination
    // depending on GUI checkbox:
    // color from night texture and clouds are added to ambient term (instead of ambient material k_a)
    // color from day texture are added to diffuse term (instead of diffuse material k_d)

    // Note: the texture value might have to get rescaled (gamma corrected)
    //       e.g. color = pow(color, vec3(0.6))*2.0;
    
    // vector from light to current point
    vec3 l = normalize(directionalLightDirection[0]);

    
    // diffuse contribution
    vec3 diffuseCoeff = (daytimeTextureBool == 1 )? dayCol : diffuseMaterial;
    // clouds at day?
    if(cloudsTextureBool == 1) {
        diffuseCoeff = (1.0-cloudsCol)*diffuseCoeff + cloudsCol*vec3(1,1,1);
    }
    // final diffuse term for daytime
    vec3 diffuse =  diffuseCoeff * directionalLightColor[0] * ndotl;

    // ambient part contains lights; modify depending on time of day
    // when ndotl == 1.0 the ambient term should be zero

    vec3 color = ambient + diffuse + specular;

    gl_FragColor = vec4(color, 1.0);

*/

vec3 phong(vec3 p, vec3 v, vec3 n,
           vec3 ambientColor, vec3 diffuseColor, vec3 specularColor, float shininess,
           vec3 textureDayColor, vec3 textureNightColor, vec3 textureCloudColor,
           vec3 directionalLightPos, vec3 directionalLightColor, vec3 ambientLightColor,
           int showDayTexture, int showNightTexture, int showCloudTexture) {
    // Check if backface
    if (dot(n, v) < 0.0) {
        return vec3(0, 0, 0);
    }

    // Vector from viewpoint to light
    vec3 toLight = normalize(directionalLightPos);
    // Reflect light
    vec3 reflect = reflect(toLight, n);

    float nDotL = dot(n, -toLight);
    float rDotV = max(dot(reflect, v), 0.0);

    float multiplier = (0.0 - clamp(nDotL, 0.0, 0.5) + 0.5) * 2.0;


    vec3 ambi;
    if (showNightTexture == 1) {
        ambi = textureNightColor * ambientLightColor;
    } else {
        ambi = ambientColor * ambientLightColor;
    }

    vec3 diff;
    if (showDayTexture == 1) {
        diff = textureDayColor * directionalLightColor * nDotL;
    } else {
        diff = diffuseColor * directionalLightColor * nDotL;
    }

    // Mix clouds for night with ambient color (-textureCloudColor for black clouds)
    // Mix clouds for day with diffuse color
    if (showCloudTexture == 1) {
        ambi = mix(ambi, -textureCloudColor * ambientLightColor * multiplier, textureCloudColor.x);
        diff = mix(diff, textureCloudColor * nDotL * 1.5, textureCloudColor.x);
    }

    vec3 spec = specularColor * directionalLightColor * pow(rDotV, shininess);

    // Check if light is behind the surface
    if (nDotL <= 0.0) {
        return ambi;
    }

    return ambi + diff + spec;
}

void main() {
    bool useOtho = threeProjectionMatrix[2][3] == 0.0;

    vec3 viewDirEc = useOtho ? vec3(0, 0, 1) : normalize(-ecPosition.xyz);

    vec3 textureDayColor = texture2D(textureDay, vUv).rgb * 1.5;
    vec3 textureNightColor = texture2D(textureNight, vUv).rgb * 1.5;
    vec3 textureCloudColor = texture2D(textureCloud, vUv).rgb;

    vec3 color = phong(ecPosition.xyz, ecNormal, viewDirEc,
                       ambientMaterial, diffuseMaterial, specularMaterial, shininessMaterial,
                       textureDayColor, textureNightColor, textureCloudColor,
                       normalize(directionalLightDirection[0]), directionalLightColor[0], ambientLightColor[0],
                       showDayTexture, showNightTexture, showCloudTexture);
    gl_FragColor = vec4(color, 1.0);
}