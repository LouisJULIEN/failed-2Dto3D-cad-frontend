CONSTANTS = {
    originColor: 0x000000,
    projection_xy: 'red',
    projection_xz: 'green',
    projection_yz: 'blue',
}

class Draw3DReconstructed {

    constructor(domId) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xdedede);
        const htmlDOMReconstruction = document.getElementById(domId);
        this.camera = new THREE.PerspectiveCamera(75,
            htmlDOMReconstruction.offsetWidth / htmlDOMReconstruction.offsetHeight,
            0.1, 1000);
        this.camera.position.set(100, 100, 500);
        this.camera.lookAt(300, 300, 300);
        this.showProjectionPlanes = false;

        this.renderGroups = {
            '3D': new THREE.Group(),
            'xy': new THREE.Group(), // projected planes
            'xz': new THREE.Group(), // projected planes
            'yz': new THREE.Group(), // projected planes
            'visualGuides': new THREE.Group(),
        }
        for (let aRenderGroup of Object.values(this.renderGroups)) {
            this.scene.add(aRenderGroup);
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(htmlDOMReconstruction.offsetWidth, htmlDOMReconstruction.offsetHeight);
        htmlDOMReconstruction.appendChild(this.renderer.domElement);

        // OrbitControls makes it possible to rotate around the object with the mouse
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.drawVisualGuides();
    }

    drawVisualGuides() {
        const origin = new THREE.Vector3(0, 0, 0);
        const redPointColor = new THREE.PointsMaterial({color: CONSTANTS['originColor']})
        const originVertex = new THREE.BufferGeometry().setFromPoints([origin]);
        const threeDPointsOrigin = new THREE.Points(originVertex, redPointColor);
        this.renderGroups['visualGuides'].add(threeDPointsOrigin);

        const planeByPlane = {
            'xy': {
                normal: new THREE.Vector3(0, 0, 1),
                color: CONSTANTS['projection_xy']
            },
            'xz': {
                normal: new THREE.Vector3(0, 1, 0),
                color: CONSTANTS['projection_xz']
            },
            'yz': {
                normal: new THREE.Vector3(1, 0, 0),
                color: CONSTANTS['projection_yz']
            },
        }

        // projection planes
        if (this.showProjectionPlanes) {
            for (let planeData of Object.values(planeByPlane)) {
                const plane = new THREE.Plane(planeData['normal']);
                const constructedPlane = new THREE.PlaneHelper(plane, 10, planeData["color"]);
                this.renderGroups['visualGuides'].add(constructedPlane);
            }
        }
    }

    drawReconstructed(input) {
        // erase existing points
        while (this.scene.children.length) {
            this.scene.remove(this.renderGroups['3D'].children[0]);
        }

        const reconstructed3DVertices = {};
        for (const [aPointId, aPointData] of Object.entries(input['reconstructed']['vertices'])) {
            reconstructed3DVertices[aPointId] = new THREE.Vector3(aPointData.x, aPointData.y, aPointData.z)
        }

        const redPointColor = new THREE.PointsMaterial({color: 0xf05d4a})
        const threeDVertices = new THREE.BufferGeometry().setFromPoints(Object.values(reconstructed3DVertices));
        const threeDPoints = new THREE.Points(threeDVertices, redPointColor);
        this.renderGroups['3D'].add(threeDPoints);

        const reconstructed3DEdges = {};
        const blueLineColor = new THREE.LineBasicMaterial({color: 0x5da5ab});
        for (const [anEdgeId, anEdgeData] of Object.entries(input['reconstructed']['edges'])) {
            const edgeVertices = [];
            for (const aVertexId of anEdgeData['threeDPointsIds']) {
                edgeVertices.push(reconstructed3DVertices[aVertexId]);
            }
            const edge = new THREE.BufferGeometry().setFromPoints(edgeVertices);
            reconstructed3DEdges[anEdgeId] = new THREE.Line(edge, blueLineColor);
        }


        if (Object.keys(reconstructed3DEdges).length > 0) {
            this.renderGroups['3D'].add(...Object.values(reconstructed3DEdges));
        }
    }

    drawProjection(projectionPlane, projectionData) {
        // remove existing projection data
        while (this.renderGroups[projectionPlane].children.length > 0) {
            this.renderGroups[projectionPlane].remove(this.renderGroups[projectionPlane].children[0])
        }

        const projectedVertices = {};
        for (const [aPointId, aPointData] of Object.entries(projectionData['vertices'])) {
            projectedVertices[aPointId] = new THREE.Vector3(aPointData.x, aPointData.y, aPointData.z)
        }

        const projectedPointColor = new THREE.PointsMaterial({color: CONSTANTS['projection_' + projectionPlane]})
        const threeDVertices = new THREE.BufferGeometry().setFromPoints(Object.values(projectedVertices));
        const threeDPoints = new THREE.Points(threeDVertices, projectedPointColor);

        this.renderGroups[projectionPlane].add(threeDPoints);

        const projectedEdges = {};
        const projectedLineColor = new THREE.LineBasicMaterial({color: CONSTANTS['projection_' + projectionPlane]});
        for (const [anEdgeId, anEdgeData] of Object.entries(projectionData['edges'])) {
            const edgeVertices = [];
            for (const aVertexId of anEdgeData['verticesIds']) {
                edgeVertices.push(projectedVertices[aVertexId]);
            }
            const edge = new THREE.BufferGeometry().setFromPoints(edgeVertices);
            projectedEdges[anEdgeId] = new THREE.Line(edge, projectedLineColor);
        }

        if (Object.keys(projectedEdges).length > 0) {
            this.renderGroups[projectionPlane].add(...Object.values(projectedEdges));
        }

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    // https://threejs.org/manual/#en/picking

}