const DEFAULT_VERTEX_SHADER_SOURCE = `
attribute vec4 pos;
attribute vec3 normal;
attribute vec2 tex;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalTransformMatrix;

varying highp vec3 fNormal;
varying highp vec2 fTex;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * pos;
  fNormal = uNormalTransformMatrix * normal;
  fTex = tex;
}
`;

const DEFAULT_FRAGMENT_SHADER_SOURCE = `
varying highp vec3 fNormal;
varying highp vec2 fTex;

void main() {
    highp vec3 lightDirection = vec3(0.0, 0.0, 1.0);
    highp float cos = dot(fNormal, lightDirection);

    highp vec3 pixelColor = vec3(1.0, 1.0, 0.0) * cos;

    gl_FragColor = vec4(pixelColor, 1.0);
}
`;