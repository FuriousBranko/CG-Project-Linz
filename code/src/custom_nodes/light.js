/**
 * a light node represents a light including light position and light properties (ambient, diffuse, specular)
 * the light position will be transformed according to the current model view matrix
 */
class LightNode extends TransformationSGNode {
    constructor(position, children, cutoffAngle, spotDir) {
      super(children);
      this.position = position || [0, 0, 0];
      this.ambient = [0, 0, 0, 1];
      this.diffuse = [1, 1, 1, 1];
      this.specular = [1, 1, 1, 1];
      this.cutoffAngle = cutoffAngle || glm.deg2rad(180);
      this.spotDir = spotDir || [0,0,0];
      //uniform name
      this.uniform = "u_light";
    }
  
    /**
     * computes the absolute light position in world coordinates
     */
    computeLightPosition(context) {
      //transform with the current model view matrix
      const modelViewMatrix = mat4.multiply(
        mat4.create(),
        context.viewMatrix,
        context.sceneMatrix
      );
      const pos = [this.position[0], this.position[1], this.position[2], 1];
      return vec4.transformMat4(vec4.create(), pos, modelViewMatrix);
    }
  
    computeSpotDir(context)
    {
      const modelViewMatrix = mat4.multiply(
        mat4.create(),
        context.viewMatrix,
        context.sceneMatrix
      );
      const pos = [this.spotDir[0], this.spotDir[1], this.spotDir[2], 1];
      return vec4.transformMat4(vec4.create(), pos, modelViewMatrix);
    }
  
    setLightUniforms(context) {
      const gl = context.gl,
        shader = context.shader,
        position = this.computeLightPosition(context),
        spotDirection = this.computeSpotDir(context);
  
      //TASK 3-5 set uniforms
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
      // and set position (in eye/camera space) :
      gl.uniform3f(
        gl.getUniformLocation(shader, this.uniform + "Pos"),
        position[0],
        position[1],
        position[2]
      ); // <- u_light + "Pos" == u_lightPos
      gl.uniform1f(
        gl.getUniformLocation(shader, this.uniform + ".cutoffAngle"),
        this.cutoffAngle
      );
      gl.uniform3f(
        gl.getUniformLocation(shader, this.uniform + "spotDir"),
        spotDirection[0],
        spotDirection[1],
        spotDirection[2]
      );  
    }
  
    render(context) {
      this.setLightUniforms(context);
  
      //since this a transformation node update the matrix according to my position
      this.matrix = glm.translate(
        this.position[0],
        this.position[1],
        this.position[2]
      );
  
      //render children
      super.render(context);
    }
  }