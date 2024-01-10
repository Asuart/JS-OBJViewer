class Camera {
    constructor() {
        this.position = new vec3(0, 0, -5);
        this.forward = new vec3(0, 0, 1);
        this.mProjection = mat4.CreateProjection(1, 8 * (Math.PI / 180.0), 0.1, 1000.0);
    }

    GetPosition() {
        return new vec3(this.distance * Math.sin(this.phi), 0, this.distance * Math.cos(this.phi));
    }

    GetViewMatrix() {
        let mView = mat4.CreateView(this.position, vec3.Sum(this.position, this.forward), new vec3(0, 1, 0));
        return mat4.Multiply(mat4.CreateTranslation(this.position.x, this.position.y, this.position.z), mView);
    }

    GetProjectionMatrix() {
        return this.mProjection;
    }
}