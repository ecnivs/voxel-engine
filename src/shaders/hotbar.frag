#version 330 core

layout (location = 0) out vec4 fragColor;

in vec2 uv;
flat in float code;
flat in float slot;

uniform sampler2DArray u_texture_array_0;
uniform float u_selected;

const vec3 gamma = vec3(2.2);
const vec3 inv_gamma = 1.0 / gamma;

// code 0 = slot frame, 1 = selector overlay,
// 8 + id / 16 + id / 24 + id = icon top / left / right face.

void main() {
    int c = int(code + 0.5);
    bool selected = abs(slot - u_selected) < 0.5;

    if (c == 0) {
        vec2 p = uv * 12.0;
        float b = min(min(p.x, p.y), min(12.0 - p.x, 12.0 - p.y));
        if (b < 0.5) {
            fragColor = vec4(0.35, 0.35, 0.35, 0.9);
        } else if (b < 1.0) {
            fragColor = vec4(0.08, 0.08, 0.08, 0.9);
        } else {
            fragColor = vec4(0.0, 0.0, 0.0, 0.45);
        }
    } else if (c == 1) {
        if (!selected) discard;
        vec2 p = uv * 14.0;
        float b = min(min(p.x, p.y), min(14.0 - p.x, 14.0 - p.y));
        if (b > 1.0) discard;
        fragColor = vec4(0.92, 0.92, 0.92, 1.0);
    } else {
        int face = c / 8 - 1;
        int id = c - (c / 8) * 8;

        // Atlas columns per layer: top, side, bottom.
        float off = (face == 0) ? 0.0 : 1.0 / 3.0;
        float shade = (face == 0) ? 1.0 : ((face == 1) ? 0.8 : 0.6);
        vec2 face_uv = vec2(uv.x / 3.0 + off, uv.y);
        vec3 col = texture(u_texture_array_0, vec3(face_uv, float(id))).rgb;
        col = pow(pow(col, gamma) * shade, inv_gamma);
        fragColor = vec4(col, 1.0);
    }
}
