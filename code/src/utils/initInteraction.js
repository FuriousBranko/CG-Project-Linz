// Handle all Human Interactions
function initInteraction(canvas) {
    const mouse = {
      pos: { x: 0, y: 0 },
      leftButtonDown: false,
    };
    function toPos(event) {
      //convert to local coordinates
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    canvas.addEventListener("mousedown", function (event) {
      mouse.pos = toPos(event);
      mouse.leftButtonDown = event.button === 0;
    });
    canvas.addEventListener("mousemove", function (event) {
      const pos = toPos(event);
      const delta = { x: mouse.pos.x - pos.x, y: mouse.pos.y - pos.y };
      //TASK 0-1 add delta mouse to camera.rotation if the left mouse button is pressed
      if (mouse.leftButtonDown) {
        //may want to remove this for final view?
        camera.rotation.x += delta.x * rotationMult;
        camera.rotation.y += delta.y * rotationMult / 2;
      }
      mouse.pos = pos;
    });
    canvas.addEventListener("mouseup", function (event) {
      mouse.pos = toPos(event);
      mouse.leftButtonDown = false;
    });
    document.addEventListener("keypress", function (event) {
      if (event.code === "KeyR") {
        //reset camera rotation and distance from starting position
        resetCamera();
      }
      if (event.code === "KeyW") {
        //move forward
        moveCamera('W');
      }
      if (event.code === "KeyS") {
        //move back
        moveCamera('S');
      }
      if (event.code === "KeyA") {
        //move left
        moveCamera('A');
      }
      if (event.code === "KeyD") {
        //move right
        moveCamera('D');
      }
      if (event.code === "KeyT") {
        //move up
        cameraMovementPos = vec3.add(vec3.create(), cameraMovementPos, vec3.multiply(vec3.create(),[0,1,0], translationMultVec));
      }
      if (event.code === "KeyG") {
        //move down
        if (camPosition[1] >= 0) {
          cameraMovementPos = vec3.subtract(vec3.create(), cameraMovementPos, vec3.multiply(vec3.create(),[0,1,0], translationMultVec));
        }
      }
    });
    isInteractionInit = true;
  }