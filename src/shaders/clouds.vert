#version 330 core

layout (location = 0) in vec3 in_position;
layout (location = 1) in float in_shading;

uniform mat4 m_proj;
uniform mat4 m_view;
uniform int center;
uniform float u_time;
uniform float cloud_scale;
uniform vec2 u_offset;

out float shading;

void main() {
    vec3 pos = vec3(in_position);
    pos.xz -= center;
    pos.xz *= cloud_scale;
    pos.xz += center;

    float time = 300 * sin(0.01 * u_time);
    pos.xz += time;
    pos.xz += u_offset;
    shading = in_shading / 255.0;
    gl_Position = m_proj * m_view * vec4(pos, 1.0);
}
