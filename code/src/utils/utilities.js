function generateForestLocations(randomColors = false) {
  //valid reasons consists of the left and right sides of the path minus a border of 3 units from all directions
    var validRegions = [
      [-(2*grassWidth+pathWidth) + 3,-chunkSize - 3,0,0,-floorLength + 3,floorLength - 3,],
      [chunkSize + 3, (2*grassWidth+pathWidth) - 3, 0, 0, -floorLength + 3, floorLength - 3]
    ];
  
    // for each region "think side" of the path seperate each section into chunks and create pick random locations for trees and bushes
    // between the available maximum and minium X and Z positions for each chunk and pick a random color for the object.
    // these are then pushed to the TreePositions and BushPositions arrays which are then used to generate the scene graphs.
    for (const region of validRegions) {
      var MaxLocationX,
        MaxLocationZ = 0;
      var subRegionsX = Math.abs(region[1] - region[0]) / chunkSize;
      var subRegionsZ = Math.abs(region[5] - region[4]) / chunkSize;
      for (i = 1; i <= subRegionsX + 1; i++) {
        for (j = 1; j <= subRegionsZ + 1; j++) {
          var MinLocationX = region[0] + (i - 1) * chunkSize;
          var tempMaxX = region[0] + i * chunkSize;
          if (tempMaxX <= region[1]) {
            MaxLocationX = tempMaxX;
          } else {
            MaxLocationX = region[1];
          }
          var MinLocationZ = region[4] + (j - 1) * chunkSize;
          var tempMaxZ = region[4] + j * chunkSize;
          if (tempMaxZ <= region[5]) {
            MaxLocationZ = tempMaxZ;
          } else {
            MaxLocationZ = region[5];
          }
          for (k = 0; k < PlantGen.trees; k++) {
            if (randomColors) {
              var color = randomIntFromInterval(0, 2);
            } else {
              color = 2;
            }
            TreePositions.push([
              [
                randomIntFromInterval(MinLocationX, MaxLocationX),
                0.32,
                randomIntFromInterval(MinLocationZ, MaxLocationZ),
              ],
              color,
            ]);
          }
          for (k = 0; k < PlantGen.bushes; k++) {
            BushPositions.push([
              randomIntFromInterval(MinLocationX, MaxLocationX),
              0,
              randomIntFromInterval(MinLocationZ, MaxLocationZ),
            ]);
          }
        }
      }
    }
  }
  
  //from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function resetCamera(){
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    cameraMovementPos = [0,0,0]
  }
  
  function moveCamera(keyPressed)
  {
    keyMoveVector = vec3.create();
    switch(keyPressed){
      case 'W':
        keyMoveVector[2] += -1; 
        break;
      case 'S':
        keyMoveVector[2] += 1 ;
        break;
      case 'A':
        keyMoveVector[0] += -1 ;
        break;
      case 'D':
        keyMoveVector[0] += 1;
      default:
        ;
      }
    vec3.transformMat4(keyMoveVector, keyMoveVector, glm.transform({rotateY: camera.rotation.x, rotateX: camera.rotation.y}));
    vec3.multiply(keyMoveVector, vec3.normalize(vec3.create(),keyMoveVector), translationMultVec);
    vec3.add(cameraMovementPos, cameraMovementPos, keyMoveVector);
    }
  
  function calcDistance(objVec, eyeVec){
     distance = Math.sqrt(Math.pow(objVec[0] - eyeVec[0],2) + Math.pow(objVec[2] - eyeVec[2],2) + Math.pow(objVec[1] - eyeVec[1],2));
    if(distance <= 80){
      return 0;
    }else if(distance > 80 && distance <= 190){
      return 1;
    }else{
      return 2;
    }
  }

  function randomDomeDir(){
    var theta = ((Math.random()*2) -1)*(Math.PI/4);
    var phi = ((Math.random()*2) -1)* Math.PI;
    return vec3.normalize(vec3.create(), vec3.fromValues(Math.sin(theta)*Math.cos(phi), Math.cos(theta), Math.sin(theta)* Math.sin(phi)));
  }

  function returnOBJ( vertecis, normals, textures, index){
    return {
      position: vertecis,
      normal: normals,
      texture: textures,
      index: index
    };
  }