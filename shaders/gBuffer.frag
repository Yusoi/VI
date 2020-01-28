#version 330

in Data {
	vec3 pos;
	vec2 texCoords;
	//vec3 normal;
	
	//Maybe not needed
	//vec4 eye;
	//vec3 tangent;
	//vec3 bitangent;
	//vec3 l_dir;
	//flat int tex;
} DataIn;

layout (location = 0) out vec3 gPosition;
layout (location = 1) out vec3 gNormal;
layout (location = 2) out vec4 gAlbedoSpec;

uniform sampler2D diffuse, normalMap, specularMap;

void main() {
	//Stores the fragment position vector in the first gbuffer texture
    gPosition = DataIn.pos;

	//Stores per fragment normals
    gNormal = normalize(texture(normalMap, DataIn.texCoords).rgb);

	//Stores the diffuse color in the rgb spectrum of the buffer
	gAlbedoSpec.rgb = texture(diffuse, DataIn.texCoords).rgb;

	//Stores the specular intensity in the alpha channel of the buffer
	gAlbedoSpec.a = texture(specularMap, DataIn.texCoords).r;

	colorOut = gAlbedoSpec;
}