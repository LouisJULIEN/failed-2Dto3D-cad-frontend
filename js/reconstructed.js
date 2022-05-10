class Draw3DReconstructed {

    constructor(domId) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xdedede);
        const htmlDOMReconstruction = document.getElementById(domId);
        this.camera = new THREE.PerspectiveCamera(75,
            htmlDOMReconstruction.offsetWidth / htmlDOMReconstruction.offsetHeight,
            0.1, 1000);
        this.camera.position.set(0, 0, -30);
        this.camera.lookAt(0, 0, 0);


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(htmlDOMReconstruction.offsetWidth, htmlDOMReconstruction.offsetHeight);
        htmlDOMReconstruction.appendChild(this.renderer.domElement);

        // OrbitControls makes it possible to rotate around the object with the mouse
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    }


    drawReconstructed(input) {
        const reconstructed3DVertices = {};
        for (const [aPointId, aPointData] of Object.entries(input['reconstructed']['vertices'])) {
            reconstructed3DVertices[aPointId] = new THREE.Vector3(aPointData.x, aPointData.y, aPointData.z)
        }

        const redPointColor = new THREE.PointsMaterial({color: 0xf05d4a})
        const threeDVertices = new THREE.BufferGeometry().setFromPoints(Object.values(reconstructed3DVertices));
        const threeDPoints = new THREE.Points(threeDVertices, redPointColor);
        this.scene.add(threeDPoints);

        const reconstructed3DEdges = {};
        const blueLineColor = new THREE.LineBasicMaterial({color: 0x5da5ab});
        for (const [anEdgeId, anEdgeData] of Object.entries(input['reconstructed']['edges'])) {
            const edgeVertices = [];
            for (const aVertexId of anEdgeData['verticesIds']) {
                edgeVertices.push(reconstructed3DVertices[aVertexId]);
            }
            const edge = new THREE.BufferGeometry().setFromPoints(edgeVertices);
            reconstructed3DEdges[anEdgeId] = new THREE.Line(edge, blueLineColor);
        }
        this.scene.add(...Object.values(reconstructed3DEdges));
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    // https://threejs.org/manual/#en/picking

}