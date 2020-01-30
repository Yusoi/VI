#version 430

uniform mat4 m_pvm;

in vec4 position;	
in vec4 texCoord0;

out Data {
    vec3 pos;
    vec2 texCoords;
} DataOut;

void main() {
    DataOut.pos = position.xyz;
    DataOut.texCoords = texCoord0.xy;
	gl_Position = m_pvm * position;	
}