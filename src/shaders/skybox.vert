#version 330 core

out vec2 ndc;

void main() {
    vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
    ndc = pos;
    gl_Position = vec4(pos, 0.0, 1.0);
}
