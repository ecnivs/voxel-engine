#version 330 core

layout (location = 0) in vec2 in_position;
layout (location = 1) in vec4 in_aux;

uniform vec2 u_scale;
uniform vec2 u_offset;

out vec2 uv;
flat out float code;
flat out float slot;

void main() {
    uv = in_aux.xy;
    code = in_aux.z;
    slot = in_aux.w;
    gl_Position = vec4(in_position * u_scale + u_offset, 0.0, 1.0);
}
