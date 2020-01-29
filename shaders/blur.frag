#version 330  
//input
in Data{
    vec2 texCoords;
} DataIn;
  
//uniform input
uniform sampler2D ssaoInput;

//output to renderTarget
layout (location = 0) out float blurInput;

void main() {
    vec2 texelSize = 1.0 / vec2(textureSize(ssaoInput, 0));
    float result = 0.0;
    for (int x = -2; x < 2; ++x) 
    {
        for (int y = -2; y < 2; ++y) 
        {
            vec2 offset = vec2(float(x), float(y)) * texelSize;
            result += texture(ssaoInput, TexCoords + offset).r;
        }
    }

    blurInput = result / (4.0 * 4.0);
}  