// Scene Graph
function createSceneGraph(gl, resources) {
    //create scenegraph
    const root = new ShaderSGNode(createProgram(gl, resources.vs, resources.fs));
  
    function createLightSphere() {
      return new ShaderSGNode(
        createProgram(gl, resources.vs_single, resources.fs_single),
        [new RenderSGNode(makeSphere(0.2, 10, 10))]
      );
    }
    //lighting nodes
    {
      //creates ambient light
      let light = new LightNode();
      light.uniform = "u_light";
      light.ambient = [1, 1, 1, 1];
      light.diffuse = [1, 1, 1, 1];
      light.specular = [1, 1, 1, 1];
      light.position = [0, 300, 0.28]; //2
      //rotatelight = new TransformationSGNode(mat4.create(), [light]);
      root.append(light);
    }
  
    {
      // moving light obj as well as our fully specified obj
      let HCObject = new ObjectNode(returnOBJ(gemVertices,gemNormals,gemTexture,gemIndices), Gold);
      scaleHCOObject = new TransformationSGNode(glm.transform({scale: [0.3,0.3,0.3]}), [HCObject])
      let light2 = new LightNode();
      light2.uniform = "u_light2";
      light2.ambient = [0, 0, 0, 1];
      light2.diffuse = [1, 1, 1, 1];
      light2.specular = [1, 1, 1, 1];
      light2.position = [3, 4, 1]; //2
      light2.append(scaleHCOObject);
      rotateLight2 = new TransformationSGNode(mat4.create(), [light2]);
      root.append(rotateLight2);
    }
  
    {
      //spotlight
      let light3 = new LightNode();
      light3.uniform = "u_light3";
      light3.ambient = [1, 0, 0, 1];
      light3.diffuse = [1, 0, 0, 1];
      light3.specular = [1, 0, 0, 1];
      light3.position = [0, 5, 0];
      light3.cutoffAngle = glm.deg2rad(15);
      light3.spotDir = [0,-1,0];
      root.append(light3)
    }
    
    //goat scene graph with main body and both sets of legs
    {
      let goat = new ObjectNode(resources.goat, Gold, goatStartPos);
      moveGoat = new TransformationSGNode(glm.transform({ rotateY: 90, }), [goat]);
      root.append(moveGoat);
    }
  
    {
      let frontLegs = new ObjectNode(resources.legs, defaultMaterial, goatStartPos);
      moveFLegs = new TransformationSGNode(mat4.create(), [frontLegs]);
      moveGoat.append(
        moveFLegs
      );
      let backLegs = new ObjectNode(resources.legs, defaultMaterial, backLStartPos);
      moveBLegs = new TransformationSGNode(mat4.create(), [backLegs]);
      moveGoat.append(
       moveBLegs
      );

    }


    // generates forest and bushes randomly over any size floor section. (generateForestLocations() in utils/utilites.js)
    {
      treeArray = [resources.tree_high, resources.tree_mid, resources.tree_low];
      bushArray = [resources.bush_high, resources.bush_mid, resources.bush_low];
      generateForestLocations(true);
      for (i = 0; i < TreePositions.length; i++) {
        let tree = new LevelOfDetailNode(
          'tree',
          FallSelector[TreePositions[i][1]],
          TreePositions[i][0],
          treeArray);
        root.append(tree);

      }
      for (i = 0; i < BushPositions.length; i++) {
        let bush = new LevelOfDetailNode(
          'bush',
          PlantMaterial,
          BushPositions[i],
          bushArray);
        root.append(bush);
      }
    }
  
    //create constant ratio sizes floor section
    {
      let LeftSection = new ObjectNode(makeRect(grassWidth, floorLength), Grass);
      root.append(
        new TransformationSGNode(
          glm.transform({ translate: [-grassWidth - pathWidth, -1.5, 0], rotateX: -90 }),
          [LeftSection]
        )
      );
    }
    {
      let PathSection = new ObjectNode(makeRect(pathWidth, floorLength), PathMaterial);
      root.append(
        new TransformationSGNode(
          glm.transform({ translate: [0, -1.5, 0], rotateX: -90 }),
          [PathSection]
        )
      );
    }
  
    {
      let RightSection = new ObjectNode(makeRect(grassWidth, floorLength), Grass);
      root.append(
        new TransformationSGNode(
          glm.transform({ translate: [grassWidth+ pathWidth, -1.5, 0], rotateX: -90 }),
          [RightSection]
        )
      );
    }
  
    return root;
  }
  