# CG Lab Project SS2020
Submission template for the CG lab project at the Johannes Kepler University Linz.

**Explanation:**
This `README.md` needs to be pushed to Github for each of the 3 delivery dates.
For every submission change/extend the corresponding sections by replacing the [TODO] markers.
*In order to meet the deadlines make sure you push everything to your Github repository.*
For more details see the [Moodle page](https://moodle.jku.at/jku/course/view.php?id=8501)


# Concept submission due on 27.03.2020

**Movie Name:** 
A Goat-tastic Forest Adventure.

**Group Members**

| Student ID    | First Name  | Last Name      |
| --------------|-------------|----------------|
| k11944223     | Brennan     | Coslett        |
| k11944219     | Branko      | Sabo           |

**Concept** (Explain the basic story of your movie, i.e., planned scenes, what happens, which objects are used, etc.)
- Objects
    - Trees
    - Underbrush
    - La Cabra (Goat)
- What happens:
    - A peaceful goat is on a nice walk through a forest until he steps on a mine, leading to a large explosion.
- Scenes
    - Walking through forest
    - Explosion Scene

**Special Effects** (Selected special effects must add up to exactly 30 points)

| Selected   | ID | Name                                  | Points |
|------------|----|---------------------------------------|--------|
|    [no]    | S1 | Multi texturing                       | 10     |  
|    [yes]   | S2 | Level of detail                       | 10     |
|    [no]    | S3 | Billboarding                          | 10     |
|    [no]    | S4 | Terrain from heightmap                | 20     |
|    [no]    | S5 | Postprocessing shader                 | 20     |
|    [no]    | S6 | Animated water surface                | 20     |
|    [no]    | S7 | Minimap                               | 20     |
|    [yes]   | S8 | Particle system (rain, smoke, fire)   | 20     |
|    [no]    | S9 | Motion blur                           | 30     |
|    [no]    | SO | Own suggestion (preapproved by email) | [TODO] |


# Intermediate submission due on 24.04.2020
Push your code. Nothing to change here in `README` file.


# Final submission due on 23.06.2020


**Workload**

| Student ID     | Workload (in %) |
| ---------------|-----------------|
| k11944223      | 50          |
| k11944219      | 50          |

**Effects**

| Done     | ID | Name                                                                                                   | Max. Points | Issues/Comments |
|----------|----|--------------------------------------------------------------------------------------------------------|-------------|-----------------|
| [yes] | 1a | Add at least one manually composed object that consists of multiple scene graph nodes.                 | 6           |the goat|
| [yes] | 1b | Animate separate parts of the composed object and also move the composed object itself in the scene.   | 4           |leg/walking animation|
| [yes] | 1c | Use at least two clearly different materials for the composed object.                                  | 3           |Golden body and white legs|
| [yes] | 2a | Create one scene graph node that renders a complex 3D shape. Fully specify properties for this object. | 7           |Sprite that follows the goat as he moves|
| [no] | 2b | Apply a texture to your self-created complex object by setting proper texture coordinates.             | 3           |                 |
| [yes] | 3a | Use multiple light sources.                                                                            | 5           | light sources: global, following fairy, and beginning spot|
| [yes] | 3b | One light source should be moving in the scene.                                                        | 3           |Hand Crafted Object|
| [yes] | 3c | Implement at least one spot-light.                                                                     | 7           |red spot at beginning|
| [yes] | 3d | Apply Phong shading to all objects in the scene.                                                       | 3           |                 |
| [yes] | 4a | Use the WASD-keys to manually control the camera along the viewing direction                           | 6           |                 |
| [yes] | 4b | Use the mouse to control the heading and pitch of the camera relative to the ground.                   | 3           |                 |
| [yes] | 5a | Animations start automatically.                                                                        | 2           |                 |
| [yes] | 5b | Animations are framerate-independent.                                                                  | 3           |                 |
| [yes] | 5c | The camera is animated without user intervention.                                                      | 5           |                 |
| [yes] | S2| Correctly implemented special effect: Level of Detail.                                                     | 10      |description below|
| [no] | S8 | Correctly implemented special effect: Particle System.                                                     | 20      |description below|
| [yes] | SE | Special effects are nicely integrated and well documented                                              | 10          |                 |


**Special Effect Description** (Describe how they work in principle and how you implemented them.)

# Level of Detail:

## Theory
The Moodle description for the level of detail effect is: `"Implement a level-of-detail render node and use three different detail levels of your model. Decide which version to render by using the distance of the object to the camera.  Low resolution (i.e., low polygon count) should be used, if the object is further away from the camera. Make sure the swap is visible at some point during your animated camera flight. Note that this is NOT level of detail for textures."`

We decided that the best way to do this would be to create multiple **.obj** files and to switch between them usisng our render node.
    
## Implimentation
We have implimented the level of detail system as a part of the Scene Graph, **./custom_nodes/distanceUpdate.js** is based on the framework SGNode.

  ```
    constructor(type, style, position, models) {
        super();
        this.type = type;
        this.style = style;
        this.position = position;
        this.models = models;
        this.setLevelofDetail(); // set initial model
    }
  ```
    
   The **Constructor** takes `type`: *whether the input is a tree or a bush*, `style`: *the color of the object*, `position`, `models`: *array of all models the distance function chooses between*.
   
   ```
    render(context) {
    this.setLevelofDetail();
    super.render(context);
    }
  ```
  The LevelOfDetailNode **Render** function sets the level of detail for the attached childen `this.setLevelOfDetail()` and then renders the childen.
 
 ```
    function calcDistance(objVec, eyeVec){
     distance = Math.sqrt(Math.pow(objVec[0] - eyeVec[0],2) + Math.pow(objVec[2] - eyeVec[2],2)
        + Math.pow(objVec[1] - eyeVec[1],2));
    if(distance <= 80){
      return 0;
    }else if(distance > 80 && distance <= 190){
      return 1;
    }else{
      return 2;
    }
    }
 ```
 **calcDistance** takes `objVec`: the position of the object and `eyeVec`: the position of the camera as inputs.
 ![alt text](https://i.ytimg.com/vi/RaL9n2jXyag/maxresdefault.jpg)
 If the distance between the camera and the object is `<= 80` the highest poly .obj is used.<br/>
 If the distance between the camera and the object is `> 80 and <= 190` the medium poly .obj is used.<br/>
 If the distance between the camera and the object is `>190 ` the lowest poly .obj is used.
 ```
   setLevelofDetail() {
    const newDistance = calcDistance(this.position, camPosition);
    if (newDistance !== this.distance) {
      this.distance = newDistance;
      // repalce with new model
      this.children = [
        new ObjectNode(this.models[this.distance], this.style, this.position, this.type),
      ];
    }
  }
 ```
**setLevelOfDetail()** calculates the distance between the position of its child and the position of the camera **calcDistance()** and then if there is a change in distance will replace the current child with a new **ObjectNode** with the same `color`, `position`, and  `type` but with a new `model`
  
# Particle System:

## Theory: 
The moodle description for this effect is `"Examples of particle effects are rain, smoke, or fire. The particle system has to use a basic physics simulation. The animations have to be framerate-independent as well. The particle movements should be implemented in the shader."`

I felt pretty confident in the particle effect physics engine, the particle movement shader implementation was more challenging.

## *Attempted* Implementation:
We have implimented the particle system as a part of the Scene Graph, **./custom_nodes/explosion.js** is based on the framework SGNode.

```
    constructor(numParticles, basePosition, startTime){
        super([]);
        this.numParticles = numParticles;
        this.basePosition = basePosition;
        this.startTime = startTime;
        this.ticks = 0;
        this.initArrays()
    }
```

The **constructor** takes `numParticles`: the the number of particles generated by the explosion, `basePosition` the position from which the explosion happens, and `startTime`: which is passed the `timeInMilliseconds` at the creation of the object. The constructor then calls **this.initArrays()**.

```
    initArray(){

        this.particleActive = [];
        this.particlePositions = [];
        this.directionVectors = [];

        this.particleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particlePositions), gl.STATIC_DRAW);
        
        for(i = 0; i < maximumNumParticles; i++){
            this.setDirection(i, randomDomeDir());
            this.particleActive[i] = 1;
        }
    }
```

**initArray()** creates empty arrays. `this.particleActive`: whether a particle is to be rendered or not, `this.particlePositions`: the position of all particles generated, and `this.directionVectors`: which holds the current direction vectors of all particles.

`this.particleBuffer` section creates a buffer with all of the original particle positions and passes it to the GPU.

the for loop sets a random direction and activates rendering for all particles.

```
  function randomDomeDir(){
    var theta = ((Math.random()*2) -1)*(Math.PI/4);
    var phi = ((Math.random()*2) -1)* Math.PI;
    return vec3.normalize(vec3.create(), vec3.fromValues(Math.sin(theta)*Math.cos(phi),
        Math.cos(theta), Math.sin(theta)* Math.sin(phi)));
  }
```
**./utils/utilities.js** contains **randomDomeDir()** which will calculate a randomized *normalized* direction vector in an upward facing cone.

```
    update(timeInMilliseconds){
        this.ticks = timeInMilliseconds - this.startTime;
        for(i = 0; i < this.numParticles; i++){
            if(this.particlePositions[i][1] <= 0 && this.particleActive[i] != 0){
                this.particleActive[i] = 0;
            }
            else{
            vec3.add(this.numParticles[i], this.numParticles[i], vec3.fromValues(0,-0.05,0));
            }
        }
    }
```

**update()** takes the `timeInMilliseconds` and calculates a number of "ticks" in a framerate independent way by calculating the num milliseconds between the current `timeInMilliseconds` and `this.startTime`. If the particle **Y position** is less than zero and the particle is still active then de-activate otherwise add a constant **gravity** of `[0,-0.05,0]` to the particle as our physics simulation.

### What our implimentation is missing:
 - shader functionality
 - the best way to render the particle
 - how to turn these updates in vector direction and positions in the .js code into something that could be done in the shader
