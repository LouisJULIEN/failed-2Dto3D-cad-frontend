class TwoDProjection {

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
        this.currentContent = this.two.makeGroup();  // stuff to highlight as selected
        this.currentShape = null;

        this.drawBackgroundGrid()

        let domElement = this.two.renderer.domElement;

        domElement.addEventListener('mouseup', this.mouseUp.bind(this), false);
        domElement.addEventListener('mousedown', this.mouseDown.bind(this), false);
        domElement.addEventListener('dblclick', this.doubleClick.bind(this), false);
        domElement.addEventListener('mousemove', this.mouseMove.bind(this), false);
    }

    exportJSON() {
        let vertices = {};
        for (const aVertex of this.currentContent.getByType(Two.Circle)) {
            vertices[aVertex.id] = aVertex.toObject();
        }
        //
        let edges = {};
        for (const anEdge of this.currentContent.getByType(Two.Path)) {
            // filter out circles
            if(!anEdge.curved) {
                edges[anEdge.id] = anEdge.toObject();
            }
        }

        return {
            [this.currentShape._id]: {
                type: 'polygon',
                vertices,
                edges,
            }
        };
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
        this.currentShape.curved = false;
        this.currentShape.linewidth = 2;
        this.currentShape.noFill();

        this.currentContent.add(this.currentShape);
    }

    addVertexToCurrentShape(xPos, yPos) {
        // TODO: check if crossing an existing path

        // create new Path each time
        let createdAnchor = new Two.Anchor(xPos, yPos, 0, 0, 0, 0);
        createdAnchor.className = "projection-point";

        // create a circle to highlight where the point was created
        let createdCircle = new Two.Circle(xPos, yPos, 4)
        createdCircle.className = "projection-point";
        createdCircle.targetAnchor = createdAnchor;
        this.currentContent.add(createdCircle);

        createdAnchor.targetCircle = createdCircle;
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
        }
        this.draggedElement = null;
    }

    mouseMove(e) {
        if (this.draggedElement) {
            this.isDragging = true;
            const valueX = this.snapValue(e.pageX - this.boxBoundingClientRect.x)
            const valueY = this.snapValue(e.pageY - this.boxBoundingClientRect.y)
            this.draggedElement.position.x = valueX;
            this.draggedElement.position.y = valueY;
            this.draggedElement.targetAnchor.x = valueX;
            this.draggedElement.targetAnchor.y = valueY;
        }
    }


    doubleClick() {
        if (!this.currentShape || this.currentShape.vertices.length <= 2) {
            return;
        }

        this.drawingNewPointsEnabled = false;
        this.currentContent.closed = true;
    }


}