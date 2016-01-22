
uniform sampler2D t;
uniform float colorScale;

varying vec2 vUv;
varying float noise;

uniform sampler2D tExplosion;

float random( vec3 scale, float seed ){
    return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}


void main() {

    // noise values can be negative / we need to use its absolute values
    // our noise values might also not be in the full range between 0-1
    // add a scale (brightness) value that is controlled by a uniform variable

    // our goal is to access a color in our texture (explosion.png)
    // therefore we need a texture (uv) coordinate (vec2) that accesses a
    // value in the texture
    //
    // a small noise value should access a dark value in the texture
    // a high noise value should return a light value


    float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );

    vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );
    vec3 color = texture2D( tExplosion, tPos ).rgb;

     gl_FragColor = vec4( color.rgb, 1.0 );

}
	