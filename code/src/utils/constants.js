//Constant Definitions
const chunkSize = 10;
const floorLength = 36 * chunkSize;
const grassWidth = 3 * chunkSize;
const pathWidth = 1 * chunkSize;
const PlantGen = {
    trees: 1,
    bushes: 1
};

const translationMult = 0.4;
const translationMultVec = [translationMult, translationMult, translationMult];
const rotationMult = 0.15;
const goatStartPos = [1, -1.5, 0];
const backLStartPos = vec3.add(vec3.create(),[-1.9, 0, 0], goatStartPos);
const cameraLookVec = vec3.add(vec3.create(), vec3.create(), [0,0,-1]);
const cameraStartPosition = [0, 10, 40];
const cameraStartCenter =   vec3.add(vec3.create(), goatStartPos, vec3.create())//[0, 15, 5];
// const 

//Material Definitions
var defaultMaterial = {
    ambient: [0.2, 0.2, 0.2, 1.0],
    diffuse: [0.8, 0.8, 0.8, 1.0],
    specular: [0, 0, 0, 1],
    emission: [0, 0, 0, 1],
    shininess: 0.0,
  };
  var PlantMaterial = {
    ambient: [0, 0.05, 0, 1],
    diffuse: [0.4, 0.5, 0.4, 1],
    specular: [0.04, 0.7, 0.04, 1],
    emision: [0, 0, 0, 1],
    shininess: 20,
  };
  var PathMaterial = {
    ambient: [0, 0, 0, 1],
    diffuse: [0.1, 0.1, 0.1, 1],
    specular: [0.5, 0.5, 0.5, 1],
    emision: [0,0,0,1],
    shininess: 3,
  };
  var Grass = {
    ambient: [0, 0.1, 0.02, 1],
    diffuse: [0.1, 0.1, 0.1, 1],
    specular: [0.0, 0.2, 0.05, 1],
    shininess: 1,
  };
  var Gold = {
    ambient: [0.24725, 0.1995, 0.0745, 1],
    diffuse: [0.75164, 0.60648, 0.22648, 1],
    specular: [0.628281, 0.555802, 0.366065, 1],
    shininess: 50,
  };
  var RedLeaves = {
    ambient: [59/255,6/255,6/255,1],
    diffuse: [90/255,9/255,9/255,1],
    specular: [175/255,16/255,16/255,1],
    shininess: 1,
  };
  var OrangeLeaves = {
    ambient: [105/255,71/255,15/255,1],
    diffuse: [133/255,96/255,21/255,1],
    specular: [181/255,126/255,16/255,1],
    shininess: 1,
  };
  var FallSelector = [OrangeLeaves, PlantMaterial, RedLeaves];

  const camera = {
    rotation: {
      x: 0,
      y: 0,
    },
    direction: {
      x: 0,
      y: 0,
      z: 0,
    },
  };

  //Hand Crafted Object

  var gemVertices = new Float32Array([
    //top face ( pyramid )
     0, 2, 0,  -1, 1, 1,  1, 1, 1,    //front face
     0, 2, 0,   1, 1, 1,  1, 1,-1,    //right face
     0, 2, 0,   1, 1,-1, -1, 1,-1,    // back face
     0, 2, 0,  -1, 1,-1, -1, 1, 1,    //left face

    // Front face cube
    -1, 0, 1,   1, 0, 1,  1, 1, 1, -1, 1, 1,
    // Back face cube
    -1, 0,-1,  -1, 1,-1,  1, 1,-1,  1, 0,-1,
    // Bottom face cube 
    -1, 0, -1,  1, 0,-1,  1, 0, 1, -1, 0, 1,
    // Right face cube
     1, 0, -1,  1, 1,-1,  1, 1, 1,  1, 0, 1,
    // Left face cube
    -1, 0, -1, -1, 0, 1, -1, 1, 1, -1, 1,-1

  ]);

  // umm so i only found this for cube idk if i have to do it for the pyramid too
  var gemIndices =  new Uint8Array([ 
    0,1,2,
    3,4,5,
    6,7,8,
    9,10,11,
    12,13,14,  12,14,15,
    16,17,18,  16,18,19,
    20,21,22,  20,22,23,
    24,25,26,  24,26,27,
    28,29,30,  28,30,31
  ]);

  //manually calculated using https://www.wolframalpha.com/
  var gemNormals = new Float32Array([
    //top Pyramid
    //Pyramid Front Face
    0.0,  2.0,  2.0,
    //Pyramid Right Face
    2.0,  2.0,  0.0,
    //Pyramid Back Face
    0.0,  2.0, -2.0,
    //Pyramid Left Face
    -2.0, 2.0,  0.0,

    //Cube Front Face
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    
    //Cube Back Face
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
   
    //Cube Bottom Face
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,

    //Cube Right Face
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

    //Cube Left Face
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,


  ]);
  var gemTexture = [0, 0, 1, 0, 1, 1, 0, 1];
  
  var gl = null;
  var root = null;
  var isInteractionInit = false;
  var rotateLight, rotateLight2, translateNode, moveGoat, moveFLegs, moveBLegs;
  var cameraMovementPos = vec3.create();
  var camPosition = vec3.create();
  var camCenter = vec3.create();
  var goatMovementVec = [0, 0, 1];
  var camTiltStart = [0, 15, 5];
  var upVec = [0, 1, 0];
  var TreePositions = [];
  var BushPositions = [];
  var timm = 0;
  var tim = 0;
  var cam = 0;
  var loggedViewMatrix = mat4.create();