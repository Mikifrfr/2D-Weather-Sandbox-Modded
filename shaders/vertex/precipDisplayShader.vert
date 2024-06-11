#version 300 es
precision highp float;

in vec2 dropPosition;
in vec2 mass; // [0] water   [1] ice
in float density;

out vec2 position_out;
out vec2 mass_out;
out float density_out;

uniform vec2 texelSize;
uniform vec2 aspectRatios; // sim   canvas
uniform vec3 view;         // Xpos  Ypos    Zoom

void main()
{
    // Apply view transformations
    vec2 outpos = dropPosition + vec2(view.x, view.y * aspectRatios[0]);
    outpos *= view[2]; // Apply zoom
    outpos.y *= aspectRatios[1] / aspectRatios[0]; // Correct aspect ratio for y-coordinate

    // Set the position for the vertex
    gl_Position = vec4(outpos, 0.0, 1.0);

    // Define the point size based on zoom and aspect ratio
    float size = 4.0 * view[2] / aspectRatios[0];
    gl_PointSize = size;

    // Pass variables to fragment shader
    position_out = dropPosition;
    mass_out = mass;
    density_out = density;
}
