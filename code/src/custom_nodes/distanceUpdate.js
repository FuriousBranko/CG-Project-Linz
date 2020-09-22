class LevelOfDetailNode extends SGNode {
  constructor(type, style, position, models) {
    super();
    this.type = type;
    this.style = style;
    this.position = position;
    this.models = models;
    this.setLevelofDetail(); // set initial model
  }

  render(context) {
    this.setLevelofDetail();
    super.render(context);
  }

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
}
