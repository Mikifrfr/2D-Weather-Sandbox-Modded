#version 300 es
precision highp float;
precision highp sampler2D;
precision highp isampler2D;

in vec2 fragCoord;
in vec2 texCoord;     // this
in vec2 texCoordXpY0; // right
in vec2 texCoordX0Yp; // up

uniform sampler2D baseTex;
uniform isampler2D wallTex;

uniform float dragMultiplier;

uniform float wind;

uniform vec2 texelSize;

// Atmospheric Physics
uniform float latitude; // latitude in degrees (for Coriolis effect)
uniform float coriolisStrength; // strength of Coriolis effect (0-2)
uniform float pressureGradientStrength; // strength of pressure gradient forces (0-2)
// uniform vec2 resolution;

uniform vec4 initial_Tv[126];

float getInitialT(int y) { return initial_Tv[y / 4][y % 4]; }

layout(location = 0) out vec4 base;
layout(location = 2) out ivec4 wall;

void main()
{
  base = texture(baseTex, texCoord);
  vec4 baseXpY0 = texture(baseTex, texCoordXpY0);
  vec4 baseX0Yp = texture(baseTex, texCoordX0Yp);

  wall = texture(wallTex, texCoord);

  if (wall[1] == 0) // is wall
  {
    base[0] = 0.0;  // velocities in wall are 0
    base[1] = 0.0;  // this will make a wall not let any pressure trough and
                    // thereby reflect any pressure waves back
  } else {

    // The velocity through the cell changes proportionally to the pressure
    // gradient across the cell. It's basically just newtons 2nd law.
    base[0] += base[2] - baseXpY0[2];
    base[1] += base[2] - baseX0Yp[2];

    // ATMOSPHERIC PHYSICS FORCES
    
    // 1. CORIOLIS EFFECT
    // Coriolis parameter: f = 2Ω sin(φ), where Ω is Earth's angular velocity and φ is latitude
    float earthAngularVelocity = 7.2921e-5; // rad/s
    float latitudeRad = radians(latitude);
    float coriolisParameter = 2.0 * earthAngularVelocity * sin(latitudeRad);
    
    // Coriolis force: F = -f × v (cross product)
    // In 2D: Fx = f * Vy, Fy = -f * Vx
    float coriolisForceX = coriolisParameter * base[1] * coriolisStrength * 0.1; // Small multiplier for stability
    float coriolisForceY = -coriolisParameter * base[0] * coriolisStrength * 0.1;
    
    base[0] += coriolisForceX;
    base[1] += coriolisForceY;

    // 2. ENHANCED PRESSURE GRADIENT FORCES
    // Calculate pressure gradients in X and Y directions
    float pressureGradientX = (baseXpY0[2] - base[2]) * pressureGradientStrength * 0.5; // dP/dx
    float pressureGradientY = (baseX0Yp[2] - base[2]) * pressureGradientStrength * 0.5; // dP/dy
    
    // Apply enhanced pressure gradient forces
    base[0] += pressureGradientX;
    base[1] += pressureGradientY;

    // if(texCoord.y > 0.50){
    //   //base[0] *= 0.99995;
    //   base[1] *= 0.99995;
    // }

    base[0] *= 1. - dragMultiplier * 0.0002; // linear drag
    base[1] *= 1. - dragMultiplier * 0.0002;

    // quadratic drag
    // base[0] -= base[0] * base[0] * base[0] * base[0] * base[0] *
    // dragMultiplier; base[1] -= base[1] * base[1] * base[1] * base[1] *
    // base[1] * dragMultiplier;

    base[0] += wind * 0.000001;
  }
}