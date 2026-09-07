#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;
in vec4 fs_Pos;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

float random3(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

float valueNoise3D(vec3 p) {
    vec3 i = floor(p);   // integar vertices point
    vec3 f = fract(p);   // positoin inside a grid

    // Quintic fade
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    // Random values for the 8 corners of a cube
    float n000 = random3(i + vec3(0.0, 0.0, 0.0));
    float n100 = random3(i + vec3(1.0, 0.0, 0.0));
    float n010 = random3(i + vec3(0.0, 1.0, 0.0));
    float n110 = random3(i + vec3(1.0, 1.0, 0.0));
    float n001 = random3(i + vec3(0.0, 0.0, 1.0));
    float n101 = random3(i + vec3(1.0, 0.0, 1.0));
    float n011 = random3(i + vec3(0.0, 1.0, 1.0));
    float n111 = random3(i + vec3(1.0, 1.0, 1.0));

    // tri interpolation
    float nx00 = mix(n000, n100, u.x);
    float nx10 = mix(n010, n110, u.x);
    float nx01 = mix(n001, n101, u.x);
    float nx11 = mix(n011, n111, u.x);
    float nxy0 = mix(nx00, nx10, u.y);
    float nxy1 = mix(nx01, nx11, u.y);
    return mix(nxy0, nxy1, u.z); 
}

const int OCTAVES = 6;
const float PERSISTENCE = 0.5; 

float fbm(vec3 p) {
    float total = 0.0;
    float frequency = 1.0;
    float amplitude = 1.0;
    float maxValue = 0.0; 

    for (int i = 0; i < OCTAVES; i++) {
        total += valueNoise3D(p * frequency) * amplitude;
        maxValue += amplitude;
        frequency *= 2.0;
        amplitude *= PERSISTENCE;
    }
    return total / maxValue;
}

const float NOISE_SCALE = 2.0;

void main()
{
    // Material base color (before shading)

        float n = fbm(fs_Pos.xyz * NOISE_SCALE);

        vec3 colorA = u_Color.rgb;
        vec3 colorB = vec3(0.95, 0.95, 1.0);
        vec3 baseColor = mix(colorA, colorB, n);

        // Calculate the diffuse term for Lambert shading
        float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
        // Avoid negative lighting values
        diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);

        float ambientTerm = 0.2;

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.

        // Compute final shaded color
        out_Col = vec4(baseColor.rgb * lightIntensity, u_Color.a);
}
