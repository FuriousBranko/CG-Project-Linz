class ObjectNode extends MaterialNode {
    constructor(
      children,
      material = defaultMaterial,
      translationVec = [0, 0, 0],
      type = "null",
      scaleVec = [1, 1, 1],
      transform = null
    ) {
      children = new RenderSGNode(children);
      super(children);
      this.ambient = material.ambient;
      this.diffuse = material.diffuse;
      this.specular = material.diffuse;
      this.shininess = material.shininess;
      this.emision = material.emision || defaultMaterial.emission;
      this.position = translationVec || vec3.create();
      this.scaleVec = scaleVec || vec3.create();
      this.matrix = mat4.create();
      this.transform = transform;
      this.type = type;
      //uniform name
      this.uniform = "u_material";
      this.updateMatrix();
    }
    setMaterialUniforms(context) {
      const gl = context.gl,
        shader = context.shader;
  
      gl.uniform4fv(
        gl.getUniformLocation(shader, this.uniform + ".ambient"),
        this.ambient
      );
      gl.uniform4fv(
        gl.getUniformLocation(shader, this.uniform + ".diffuse"),
        this.diffuse
      );
      gl.uniform4fv(
        gl.getUniformLocation(shader, this.uniform + ".specular"),
        this.specular
      );
      gl.uniform4fv(
        gl.getUniformLocation(shader, this.uniform + ".emission"),
        this.emission
      );
      gl.uniform1f(
        gl.getUniformLocation(shader, this.uniform + ".shininess"),
        this.shininess
      );
    }
  
    updateMatrix() {
      if (this.transform != null) {
        this.matrix = this.transform;
      } else {
        this.matrix = mat4.multiply(
          this.matrix,
          glm.translate(
            this.position[0],
            this.position[1],
            this.position[2]
          ),
          glm.scale(this.scaleVec[0], this.scaleVec[1], this.scaleVec[2])
        );
      }
    }
  
    render(context) {
      this.setMaterialUniforms(context);
      //backup previous one
      var previous = context.sceneMatrix;
      //set current world matrix by multiplying it
      if (previous === null) {
        context.sceneMatrix = mat4.clone(this.matrix);
      } else {
        context.sceneMatrix = mat4.multiply(mat4.create(), previous, this.matrix);
      }
      //render children
      super.render(context);
      //restore backup
      context.sceneMatrix = previous;
    }
  }