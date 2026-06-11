#version 330 core

layout (location = 0) in vec2 in_position;

uniform vec2 u_scale;

void main() {
    gl_Position = vec4((in_position - 9.0) * u_scale, 0.0, 1.0);
}
