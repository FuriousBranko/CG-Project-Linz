class Explosion extends SGNode {
    constructor(numParticles, basePosition, startTime){
        super([]);
        this.numParticles = numParticles;
        this.basePosition = basePosition;
        this.startTime = startTime;
        this.ticks = 0;
        this.initArrays()
    }
    
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

    setDirection(index, direction){
        this.directionVectors[index] = direction;
    }

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

    render(context){
    
    }

}