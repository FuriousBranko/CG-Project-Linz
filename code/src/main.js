/**
 * the OpenGL context
 * @type {WebGLRenderingContext}
 */ 
 
//Constant Definitions and Materials in constants.js

loadResources({
  vs: "src/shader/phong.vs.glsl",
  fs: "src/shader/phong.fs.glsl",
  vs_single: "src/shader/single.vs.glsl",
  fs_single: "src/shader/single.fs.glsl",
  bush_low: "src/models/bush1.obj",
  bush_mid: "src/models/bush2.obj",
  bush_high: "src/models/bush3.obj",
  tree_low: "src/models/tree1.obj",
  tree_mid: "src/models/tree2.obj",
  tree_high: "src/models/tree3.obj",
  goat: "src/models/Topgoat.obj",
  legs: "src/models/frontLeggoat.obj",
}).then(function (resources) {
  init(resources);
  render(0);
});

//Initialization
function init(resources) {
  gl = createContext();
  gl.enable(gl.DEPTH_TEST);
  root = createSceneGraph(gl, resources);
}

// Render function
function render(timeInMilliseconds) {
  console.log(timeInMilliseconds);
  //add cameraMovePos to initial camera start position
  camPosition = vec3.add(vec3.create(), cameraStartPosition, cameraMovementPos);
  //add cameraMovePos to center to stop from tracking the origin after movement
  camCenter = vec3.add(vec3.create(), cameraStartCenter, cameraMovementPos);

  //pull current goat obj position from matrix and turn into a vec form we can use for updating the camera
  goatFollowVec = vec3.create();
  goatFollowVec[0] = moveGoat.matrix[12];
  goatFollowVec[1] = moveGoat.matrix[13];
  goatFollowVec[2] = moveGoat.matrix[14];
  // inital camera pan and follow for inital frame position
  if(timeInMilliseconds <= 10000){
    vec3.add(camPosition, goatFollowVec, camPosition);
    vec3.add(camCenter, camCenter, goatFollowVec);
  }
  // change camera view to front view
  else if( timeInMilliseconds > 10000 && timeInMilliseconds <= 20000){

    camPosition = [4,5,-50];

    vec3.add(camCenter, camCenter, goatFollowVec);
  } 
  // change camera view to front "birds eye" view
  else if(timeInMilliseconds > 20000 && timeInMilliseconds <= 25000){
    camPosition = [1, 15 , -100];
    vec3.add(camCenter, camCenter, goatFollowVec);
  }
  // change camera view to side view
  else if(timeInMilliseconds > 25000 && timeInMilliseconds < 30000 ){

    if(camCenter[1] < 0){
    vec3.add(camCenter, camCenter, [0, 3, 0]);
    }
    camPosition = [15 ,5 , goatFollowVec[2]];
    vec3.add(camCenter, camCenter, goatFollowVec);

  }
  else{
    if ( cam == 0){
      vec3.add(camPosition, goatFollowVec, camPosition);
      vec3.add(camCenter, camCenter, goatFollowVec);
      cam =1;
    }

  }


  //create window and set backround color to light grey
  checkForWindowResize(gl);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.7, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const context = createSGContext(gl);

  context.projectionMatrix = mat4.perspective(
    mat4.create(),
    glm.deg2rad(30),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.01,
    200
  );

  //Tilting Animation
  if (timeInMilliseconds <= 5000) {
    let Ys = [camCenter[0], 50 - timeInMilliseconds / 100, camCenter[2]];
    context.viewMatrix = mat4.lookAt(mat4.create(), camPosition, Ys, upVec);
    //console.log(Ys);
    if( tim  == 0){
      moveBLegs.matrix = mat4.multiply(
        moveBLegs.matrix,
        moveBLegs.matrix,
        glm.translate(0, 5 * 0.15 * translationMult, 0)
      );

      tim = 1;
      }
  } else {

    if (isInteractionInit == false && timeInMilliseconds >= 30) {
      initInteraction(gl.canvas);
    }
    // create view matrix from current position and lookat
    context.viewMatrix = mat4.lookAt(
      mat4.create(),
      camPosition,
      camCenter,
      upVec
    );
    
    //multiply viewMatrix by the interaction rotation values
    context.viewMatrix = mat4.multiply(
      mat4.create(),
      glm.transform({rotateY: -camera.rotation.x, rotateX: -camera.rotation.y}),
      context.viewMatrix
    );

    // translate goat SG obj forward
    moveGoat.matrix = mat4.multiply(
      moveGoat.matrix,
      moveGoat.matrix,
      glm.translate(0.2 * translationMult, 0, 0)
    );

    // animate goat SN obj legs
    if ( timeInMilliseconds <= 30000){
    if( timm < 5){
      moveFLegs.matrix = mat4.multiply(
        moveFLegs.matrix,
        moveFLegs.matrix,
        glm.translate(0, 0.1 * translationMult, 0)
      );
      moveBLegs.matrix = mat4.multiply(
        moveBLegs.matrix,
        moveBLegs.matrix,
        glm.translate(0, -0.1 * translationMult, 0)
      );
      timm++;
    }
    else{
      moveFLegs.matrix = mat4.multiply(
        moveFLegs.matrix,
        moveFLegs.matrix,
        glm.translate(0, -0.1 * translationMult, 0)
      );
      moveBLegs.matrix = mat4.multiply(
        moveBLegs.matrix,
        moveBLegs.matrix,
        glm.translate(0, 0.1 * translationMult, 0)
      );
      timm++;
      if( timm == 10){
        timm = 0;
      }
    }

  }
  else{
    //after 30 seconds remove the goat obj "from explosion" 
    root.remove(moveGoat);
    root.remove(rotateLight2);
  }
}

  rotateLight2.matrix = glm.transform({rotateY: timeInMilliseconds * 0.05, translate: goatFollowVec});
  root.render(context);

  requestAnimationFrame(render);
}