class AllTwoDProjections {
    constructor(projectionNamePrefix) {
        this.projectionXY = new TwoDProjection(projectionNamePrefix + '-xy');
        this.projectionXZ = new TwoDProjection(projectionNamePrefix + '-xz');
        this.projectionYZ = new TwoDProjection(projectionNamePrefix + '-yz');
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

        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                console.log(this.response)
            }
        }
        xhr.send(JSON.stringify(this.exportJSON()));

    }
}