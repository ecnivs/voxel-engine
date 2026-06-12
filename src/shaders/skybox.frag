#version 330 core

layout (location = 0) out vec4 fragColor;

in vec2 ndc;

uniform vec3 u_forward;
uniform vec3 u_right;
uniform vec3 u_up;
uniform vec2 u_tan;
uniform vec3 bg_color;

const vec3 zenith_color = vec3(0.22, 0.48, 0.86);
const vec3 sun_color = vec3(1.0, 0.97, 0.88);
const vec3 sun_dir = vec3(0.5698, 0.6838, -0.4558);

void main() {
    vec3 ray = normalize(u_forward + ndc.x * u_tan.x * u_right + ndc.y * u_tan.y * u_up);

    float t = clamp(ray.y, 0.0, 1.0);
    vec3 col = mix(bg_color, zenith_color, pow(t, 0.6));

    float sun_amt = clamp(dot(ray, sun_dir), 0.0, 1.0);
    float disc = smoothstep(0.9994, 0.9998, sun_amt);
    float glow = pow(sun_amt, 400.0) * 0.5;
    col = mix(col, sun_color, clamp(disc + glow, 0.0, 1.0));

    fragColor = vec4(col, 1.0);
}
