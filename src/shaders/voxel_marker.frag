#version 330 core

layout (location = 0) out vec4 fragColor;

in vec3 marker_color;
in vec2 uv;

uniform sampler2D u_texture_0;
uniform float u_progress;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
    return vec2(hash21(p), hash21(p + 17.17));
}

float crack(vec2 face_uv, float stage) {
    vec2 p = (floor(face_uv * 16.0) + 0.5) / 16.0;
    vec2 g = p * 3.0;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float f1 = 8.0;
    float f2 = 8.0;
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 n = vec2(i, j);
            vec2 r = n + hash22(id + n) - f;
            float d = dot(r, r);
            if (d < f1) {
                f2 = f1;
                f1 = d;
            } else if (d < f2) {
                f2 = d;
            }
        }
    }
    float edge = sqrt(f2) - sqrt(f1);
    float width = 0.03 + 0.13 * stage;
    float reach = 0.2 + 0.85 * stage;
    float line = step(edge, width);
    float radial = step(length(p - 0.5), reach);
    float jag = step(0.2, hash21(p * 16.0));
    return line * radial * jag;
}

void main() {
    vec4 tex = texture(u_texture_0, uv);
    tex.rgb += marker_color;
    float frame_alpha = (tex.r + tex.b > 1.0) ? 0.0 : 1.0;

    // Quantize to 10 discrete stages, destroy_stage_0..9 style.
    float stage = floor(u_progress * 10.0) / 10.0;
    float crack_alpha = 0.0;
    if (u_progress > 0.0) {
        crack_alpha = crack(uv, stage) * 0.8;
    }

    if (crack_alpha > 0.0) {
        vec3 crack_col = vec3(0.05 + 0.15 * hash21(floor(uv * 16.0)));
        fragColor = vec4(crack_col, crack_alpha);
    } else if (frame_alpha > 0.0) {
        fragColor = vec4(tex.rgb, 1.0);
    } else {
        discard;
    }
}
