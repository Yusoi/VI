#version 430 core

//input
in Data{
    vec2 texCoords;
} DataIn;

//uniform input
uniform mat4 m_p;
uniform sampler2D gPosition;
uniform sampler2D gNormal;
uniform sampler2D texNoise;

layout(std430, binding = 1) buffer buffer1{
	vec3 samples[];
};

//output to renderTarget
layout (location = 0) out float ssaoInput;
//out vec3 ssaoInput;

// parameters
int kernelSize = 48;
float radius = 0.5;
float bias = 0.025;

// tile noise texture over screen based on screen dimensions divided by noise size
const vec2 noiseScale = vec2(1024.0/4.0, 1024.0/4.0); 

void main()
{
    // get input for SSAO algorithm
    vec3 fragPos = texture(gPosition, DataIn.texCoords).xyz;
    vec3 normal = texture(gNormal, DataIn.texCoords).rgb;
    vec3 randomVec = normalize(texture(texNoise, DataIn.texCoords * noiseScale).xyz);
    // create TBN change-of-basis matrix: from tangent-space to view-space
    vec3 tangent = normalize(randomVec - normal * dot(randomVec, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 TBN = mat3(tangent, bitangent, normal);
    // iterate over the sample kernel and calculate occlusion factor
    float occlusion = 0.0;
    for(int i = 0; i < kernelSize; ++i)
    {
        // get sample position
        vec3 cur_sample = TBN * samples[i].xyz; // from tangent to view-space
        cur_sample = fragPos + cur_sample * radius; 
        
        // project sample position (to sample texture to get position on screen/texture)
        vec4 offset = vec4(cur_sample, 1.0);
        offset = m_p * offset; // from view to clip-space
        offset.xyz /= offset.w; // perspective divide
        offset.xyz = offset.xyz * 0.5 + 0.5; // transform to range 0.0 - 1.0
        
        // get sample depth
        float sampleDepth = texture(gPosition, offset.xy).z; // get depth value of kernel sample
        
        // range check & accumulate
        float rangeCheck = smoothstep(0.0, 1.0, radius / abs(fragPos.z - sampleDepth));
        occlusion += (sampleDepth >= cur_sample.z + bias ? 1.0 : 0.0) * rangeCheck;           
    }

    occlusion = 1-(occlusion / kernelSize);

    ssaoInput = occlusion;
}