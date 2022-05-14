class AllRepresentations {
    constructor(projectionNamePrefix) {
        this.projectionXY = new TwoDProjection(projectionNamePrefix + '-xy', 'z');
        this.projectionXZ = new TwoDProjection(projectionNamePrefix + '-xz', 'y');
        this.projectionYZ = new TwoDProjection(projectionNamePrefix + '-yz', 'x');

        this.reconstruction3D = new Draw3DReconstructed('reconstruction-3D');
        this.reconstruction3D.animate();

        document.getElementById('btn-reconstruct-3D').addEventListener('click', this.reconstructInThreeD.bind(this))

        // for testing purpose
        // let a = JSON.parse('{"reconstructed": {"edges": {"100000": {"id": "100000", "ancestorsIds": ["21", "7"], "threeDPointsIds": ["10000", "10006"]}, "100001": {"id": "100001", "ancestorsIds": ["22", "3"], "threeDPointsIds": ["10006", "10016"]}, "100002": {"id": "100002", "ancestorsIds": ["23", "7"], "threeDPointsIds": ["10016", "10022"]}, "100003": {"id": "100003", "ancestorsIds": ["24", "3"], "threeDPointsIds": ["10000", "10022"]}, "100004": {"id": "100004", "ancestorsIds": ["1", "26"], "threeDPointsIds": ["10000", "10026"]}, "100005": {"id": "100005", "ancestorsIds": ["1", "27"], "threeDPointsIds": ["10006", "10026"]}, "100006": {"id": "100006", "ancestorsIds": ["2", "28"], "threeDPointsIds": ["10016", "10026"]}, "100007": {"id": "100007", "ancestorsIds": ["2", "29"], "threeDPointsIds": ["10022", "10026"]}}, "vertices": {"10000": {"id": "10000", "ancestorsIds": ["1", "11", "21"], "x": 0.0, "y": 0.0, "z": 0.0}, "10006": {"id": "10006", "ancestorsIds": ["1", "13", "22"], "x": 0.0, "y": 2.0, "z": 0.0}, "10016": {"id": "10016", "ancestorsIds": ["13", "23", "3"], "x": 2.0, "y": 2.0, "z": 0.0}, "10022": {"id": "10022", "ancestorsIds": ["11", "24", "3"], "x": 2.0, "y": 0.0, "z": 0.0}, "10026": {"id": "10026", "ancestorsIds": ["12", "2", "25"], "x": 1.0, "y": 1.0, "z": 2.0}}}, "dandling": {"edges": {}, "vertices": {}}}');
        // this.reconstruction3D.drawReconstructed(a)
    }

    exportJSON() {
        return {
            xy: this.projectionXY.exportJSON(),
            xz: this.projectionXZ.exportJSON(),
            yz: this.projectionYZ.exportJSON(),
        }
    }

    reconstructInThreeD() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:5000/reconstruct', true);

        xhr.setRequestHeader("Content-Type", "application/json");

        let r = this.reconstruction3D;

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                r.drawReconstructed(JSON.parse(this.response))
            }
        }
        xhr.send(JSON.stringify(this.exportJSON()));

    }
}