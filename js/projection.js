class HandleProjection {

    constructor(projectionName) {

        let parentDom = document.getElementById(projectionName)
        this.parentId = projectionName;
        this.boxBoundingClientRect = parentDom.getBoundingClientRect();

        this.two = new Two({
            type: Two.Types.SVG,
            fullscreen: false,
            autostart: true,
            fitted: true
        }).appendTo(parentDom);


        this.grideSize = 20;
        this.snapTolerance = 5;

        for (let heightPx = 0; heightPx < this.two.height; heightPx += this.grideSize) {
            let line = this.two.makeLine(0, heightPx, this.two.width, heightPx);
            line.className = 'background-stroke vertical-line';
        }
        for (let widthPx = 0; widthPx < this.two.width; widthPx += this.grideSize) {
            let line = this.two.makeLine(widthPx, 0, widthPx, this.two.height);
            line.className = 'background-stroke vertical-line';
        }

        this.allContent = this.two.makeGroup(); // Everything that is drawn black
        this.currentContent = this.two.makeGroup();  // stuff to highlight as selected
        this.currentShape = null;

        let domElement = this.two.renderer.domElement;
        console.log(domElement);
        domElement.addEventListener('click', this.mouseclick.bind(this), false);
    }

    createNewCurrentShape() {
        this.currentShape = new Two.Path();
        this.currentShape.linewidth = 2;
        this.currentShape.noFill();

        this.currentContent.vertices = this.currentShape.vertices;
        this.allContent.add(this.currentShape);
    }

    snapValue(inputValue) {
        let moduloValue = inputValue % this.grideSize;

        if (moduloValue <= this.snapTolerance) {
            // snap to lower value
            return inputValue - moduloValue;
        } else if (moduloValue >= (this.grideSize - this.snapTolerance)) {
            // snap to higher value
            return inputValue + (this.grideSize - moduloValue);
        }

        return inputValue;
    }

    mouseclick(e) {
        // we click on a empty space
        console.log(e.target)
        if (e.target.parentElement.id === this.parentId) {

            if (this.currentShape === null) {
                this.createNewCurrentShape();
            }

            let xSnapped = this.snapValue(e.pageX - this.boxBoundingClientRect.x);
            let ySnapped = this.snapValue(e.pageY - this.boxBoundingClientRect.y);

            // create anchor to add as vertex to the current shape
            let createdAnchor = new Two.Anchor(xSnapped, ySnapped, 0, 0, 0, 0);
            createdAnchor.className = "projection-point";
            this.currentShape.vertices.push(createdAnchor);

            // create a circle to highlight where the point was created
            let createdCircle = new Two.Circle(xSnapped, ySnapped, 4)
            createdCircle.className = "projection-point";
            this.currentContent.add(createdCircle);


        }
    }

}