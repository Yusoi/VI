#version 330

uniform mat4 m_pvm;

in vec4 position;	

out Data {
    vec3 pos;
}

void main(){
    pos = position;
	gl_Position = m_pvm * position;	
}