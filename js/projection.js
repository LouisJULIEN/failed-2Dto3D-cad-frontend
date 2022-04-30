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

        this.drawingNewPointsEnabled = true;
        this.isDragging = false;
        this.draggedElement = null;
        this.grideSize = 20;
        this.snapTolerance = 5;

        this.backgroundGrid = this.two.makeGroup();
        this.allHumanDrawnContent = this.two.makeGroup(); // Everything that is drawn black
        this.currentContent = this.two.makeGroup();  // stuff to highlight as selected
        this.currentShape = null;

        this.drawBackgroundGrid()

        let domElement = this.two.renderer.domElement;

        domElement.addEventListener('mouseup', this.mouseUp.bind(this), false);
        domElement.addEventListener('mousedown', this.mouseDown.bind(this), false);
        domElement.addEventListener('dblclick', this.doubleClick.bind(this), false);
        domElement.addEventListener('mousemove', this.mouseMove.bind(this), false);
    }

    drawBackgroundGrid() {
        for (let heightPx = 0; heightPx < this.two.height; heightPx += this.grideSize) {
            let line = new Two.Line(0, heightPx, this.two.width, heightPx);
            line.className = 'background-stroke vertical-line';
            this.backgroundGrid.add(line)
        }
        for (let widthPx = 0; widthPx < this.two.width; widthPx += this.grideSize) {
            let line = new Two.Line(widthPx, 0, widthPx, this.two.height);
            line.className = 'background-stroke vertical-line';
            this.backgroundGrid.add(line)
        }

    }

    createNewCurrentShape() {
        this.currentShape = new Two.Path();
        this.currentShape.linewidth = 2;
        this.currentShape.noFill();

        this.currentContent.vertices = this.currentShape.vertices;
        this.allHumanDrawnContent.add(this.currentShape);
    }

    addVertexToCurrentShape(xPos, yPos) {
        // TODO: check if crossing an existing path
        let createdAnchor = new Two.Anchor(xPos, yPos, 0, 0, 0, 0);
        createdAnchor.className = "projection-point";
        this.currentShape.vertices.push(createdAnchor);
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


    /* EVENT LISTENERS */
    mouseDown(e) {
        this.isDragging = false;
        if (e.target.classList.contains('projection-point')) {
            const elementId = e.target.id;
            this.draggedElement = this.currentContent.getById(elementId);
        }
    }

    mouseUp(e) {
        // we click on a empty space
        // TODO: fix this if
        if (e.target.parentElement.id === this.parentId && this.drawingNewPointsEnabled && !this.isDragging) {

            if (this.currentShape === null) {
                this.createNewCurrentShape();
            }

            let xSnapped = this.snapValue(e.pageX - this.boxBoundingClientRect.x);
            let ySnapped = this.snapValue(e.pageY - this.boxBoundingClientRect.y);


            // create anchor to add as vertex to the current shape
            this.addVertexToCurrentShape(xSnapped, ySnapped)

            // create a circle to highlight where the point was created
            let createdCircle = new Two.Circle(xSnapped, ySnapped, 4)
            createdCircle.className = "projection-point";
            this.currentContent.add(createdCircle);
        }
        this.draggedElement = null;
    }

    mouseMove(e) {
        if (this.draggedElement) {
            this.isDragging = true;
            this.draggedElement.position.x = e.pageX - this.boxBoundingClientRect.x
            this.draggedElement.position.y = e.pageY - this.boxBoundingClientRect.y
        }
    }


    doubleClick() {
        if (!this.currentShape || this.currentShape.vertices.length <= 2) {
            return;
        }

        const firstDrawnPoint = this.currentShape.vertices[0];
        this.addVertexToCurrentShape(firstDrawnPoint.x, firstDrawnPoint.y);
        this.drawingNewPointsEnabled = false
    }


}