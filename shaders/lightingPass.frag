#version 430
  
//input
in Data{
    vec2 texCoords;
} DataIn;

//uniform input
uniform vec3 l_pos;
uniform vec3 l_color;
uniform float l_linear;
uniform float l_quadratic;
uniform sampler2D gPosition;
uniform sampler2D gNormal;
uniform sampler2D gAlbedoSpec;
uniform sampler2D blurInput;

//output
out vec4 FragColor;

void main()
{
    // retrieve data from gbuffer
    vec3 FragPos = texture(gPosition, DataIn.texCoords).rgb;
    vec3 Normal = texture(gNormal, DataIn.texCoords).rgb;
    vec3 Diffuse = texture(gAlbedoSpec, DataIn.texCoords).rgb;
    float AmbientOcclusion = texture(blurInput, DataIn.texCoords).r;
    // blinn-phong (in view-space)
    vec3 ambient = vec3(0.3 * Diffuse * AmbientOcclusion); // adding the occlusion factor
    vec3 lighting  = ambient; 
    vec3 viewDir  = normalize(-FragPos); // viewpos is (0.0.0) in view-space
    // diffuse
    vec3 lightDir = normalize(l_pos - FragPos);
    vec3 diffuse = max(dot(Normal, lightDir), 0.0) * Diffuse * l_color;
    // specular
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(Normal, halfwayDir), 0.0), 8.0);
    vec3 specular = l_color * spec;
    // attenuation
    float dist = length(l_pos - FragPos);
    float attenuation = 1.0 / (1.0 + l_linear * dist + l_quadratic * dist * dist);
    diffuse  *= attenuation;
    specular *= attenuation;
    lighting += diffuse + specular;

    FragColor = vec4(lighting, 1.0);
}