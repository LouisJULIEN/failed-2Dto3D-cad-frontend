class HandleProjection {

    constructor(projectionName) {

        let parentDom = document.getElementById(projectionName)
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
        this.activeContent = this.two.makeGroup();  // All the blue interactive elements


        let domElement = this.two.renderer.domElement;
        console.log(domElement);
        domElement.addEventListener('click', this.mouseclick.bind(this), false);
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
        let xSnapped = this.snapValue(e.pageX - this.boxBoundingClientRect.x);
        let ySnapped = this.snapValue(e.pageY - this.boxBoundingClientRect.y);

        let createdPoint = new Two.Circle(xSnapped, ySnapped, 4);
        createdPoint.className = "projection-point";
        this.activeContent.add(createdPoint);
    }


}