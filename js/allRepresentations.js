class AllRepresentations {
    constructor(projectionNamePrefix) {
        this.projectionXY = new TwoDProjection(projectionNamePrefix + '-xy', 'z');
        this.projectionXZ = new TwoDProjection(projectionNamePrefix + '-xz', 'y');
        this.projectionYZ = new TwoDProjection(projectionNamePrefix + '-yz', 'x');

        this.reconstruction3D = new Draw3DReconstructed('reconstruction-3D');
        this.reconstruction3D.animate();

        document.getElementById('btn-reconstruct-3D').addEventListener('click', this.reconstructInThreeD.bind(this))


        let a = {
            "dandling": {
                "edges": {},
                "vertices": {}
            },
            "reconstructed": {
                "edges": {
                    "two-108": {
                        "ancestorsIds": [
                            "two-104",
                            "two-108"
                        ],
                        "id": "two-108",
                        "threeDPointsIds": [
                            "10008",
                            "10042"
                        ]
                    },
                    "two-112": {
                        "ancestorsIds": [
                            "two-100",
                            "two-112"
                        ],
                        "id": "two-112",
                        "threeDPointsIds": [
                            "10022",
                            "10052"
                        ]
                    },
                    "two-116": {
                        "ancestorsIds": [
                            "two-114",
                            "two-116"
                        ],
                        "id": "two-116",
                        "threeDPointsIds": [
                            "10008",
                            "10022"
                        ]
                    },
                    "two-118": {
                        "ancestorsIds": [
                            "two-102",
                            "two-118"
                        ],
                        "id": "two-118",
                        "threeDPointsIds": [
                            "10022",
                            "10042"
                        ]
                    },
                    "two-120": {
                        "ancestorsIds": [
                            "two-110",
                            "two-120"
                        ],
                        "id": "two-120",
                        "threeDPointsIds": [
                            "10042",
                            "10052"
                        ]
                    },
                    "two-122": {
                        "ancestorsIds": [
                            "two-106",
                            "two-122"
                        ],
                        "id": "two-122",
                        "threeDPointsIds": [
                            "10008",
                            "10052"
                        ]
                    }
                },
                "vertices": {
                    "10006": {
                        "ancestorsIds": [
                            "two-113",
                            "two-115",
                            "two-99"
                        ],
                        "id": "10006",
                        "x": 20.0,
                        "y": 20.0,
                        "z": 60.0
                    },
                    "10008": {
                        "ancestorsIds": [
                            "two-105",
                            "two-107",
                            "two-115"
                        ],
                        "id": "10008",
                        "x": 20.0,
                        "y": 20.0,
                        "z": 20.0
                    },
                    "10022": {
                        "ancestorsIds": [
                            "two-101",
                            "two-113",
                            "two-117"
                        ],
                        "id": "10022",
                        "x": 20.0,
                        "y": 60.0,
                        "z": 60.0
                    },
                    "10024": {
                        "ancestorsIds": [
                            "two-103",
                            "two-107",
                            "two-117"
                        ],
                        "id": "10024",
                        "x": 20.0,
                        "y": 60.0,
                        "z": 20.0
                    },
                    "10036": {
                        "ancestorsIds": [
                            "two-101",
                            "two-111",
                            "two-119"
                        ],
                        "id": "10036",
                        "x": 60.0,
                        "y": 60.0,
                        "z": 60.0
                    },
                    "10042": {
                        "ancestorsIds": [
                            "two-103",
                            "two-109",
                            "two-119"
                        ],
                        "id": "10042",
                        "x": 60.0,
                        "y": 60.0,
                        "z": 20.0
                    },
                    "10052": {
                        "ancestorsIds": [
                            "two-111",
                            "two-121",
                            "two-99"
                        ],
                        "id": "10052",
                        "x": 60.0,
                        "y": 20.0,
                        "z": 60.0
                    },
                    "10058": {
                        "ancestorsIds": [
                            "two-105",
                            "two-109",
                            "two-121"
                        ],
                        "id": "10058",
                        "x": 60.0,
                        "y": 20.0,
                        "z": 20.0
                    }
                }
            }
        };
        this.reconstruction3D.drawReconstructed(a)


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