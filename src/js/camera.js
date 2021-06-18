class Camera {
    constructor() {
        this.phi = 0.0; // rotation on x,z plane
        this.distance = 6;
    }
    GetPosition() {
        return new vec3(this.distance * Math.sin(this.phi), 0, this.distance * Math.cos(this.phi));
    }
    GetViewMatrix() {
        let pos = this.GetPosition();
        let dir = new vec3(-pos.x, -pos.y, -pos.z).normalize();
        let up = new vec3(0, 1, 0).normalize();
        let right = CrossProduct(dir, up).normalize();

        let mView = CreateViewMatrix(right, up, dir, new vec3(0, 0, 0));
        let mTransform = CreaeteTranslationMatrix(-pos.x, -pos.y, -pos.z); // offset compensation
        return MultMatrix(mView, mTransform);
    }
    Rotate(val) {
        this.phi += val;
    }
}