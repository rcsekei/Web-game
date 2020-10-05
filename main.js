const display = document.getElementById("display");
let time = new Date();
var fontSize = 30;
const Easy = [
    [0, 0, 0, 2, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 2, 0, 0],
    [3, 0, 0, 3, 0],
    [1, 0, 0, 0, 0]
]
const Medium = [
    [2, 0, 0, 9, 0, 0, 0, 5, 0],
    [1, 0, 0, 8, 0, 11, 0, 0, 5],
    [0, 2, 0, 0, 6, 0, 7, 0, 0],
    [0, 0, 0, 0, 0, 11, 0, 10, 0],
    [0, 0, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 3, 6],
    [0, 9, 0, 4, 8, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 10, 3]
]
const Hard = [
    [1, 0, 0, 0, 3, 0, 5, 0, 2],
    [0, 0, 0, 0, 0, 0, 8, 5, 0],
    [7, 4, 0, 6, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0, 3, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0, 8]
]
const c = [
    ["rgba(244,67,54,0.5)", 13],
    ["rgba(0,150,136,0.5)", 13],
    ["rgba(255,193,7,0.5)", 13],
    ["rgba(33,150,243,0.5)", 13],
    ["rgba(233,30,99,0.5)", 13],
    ["rgba(96,125,141,0.5)", 13],
    ["rgba(156,39,176,0.5)", 13],
    ["rgba(76,175,80,0.5)", 13],
    ["rgba(255,87,30,0.5)", 13],
    ["rgba(158,158,158,0.5)", 13],
    ["rgba(205,220,57,0.5)", 13],
    ["rgba(121,85,72,0.5)", 13]
];


class Draw {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.mousePressed = false;
        var fontsize = 30;
        var fontface = 'verdana';
        this.ctx.font = fontsize + 'px ' + fontface;
        this.ctx.textAlign = "right";
        this.size = null;
        this.isColored = [];
        this.tiles = [];
        this.rowCount = null;
        this.colCount = null;
        this.step = 0;
        this.previous = [];
        this.colorCounter = 0;
        this.lineColor = "";
        this.start = [100, 100];
        this.end = [];
        this.way = [];
        this.step = 0;
        this.lines = [];
        this.lineCounter = 0;
        this.saveColor = [];
        this.saveColorHelper = [];
        this.w = 0;
        this.h = 0;

        this.registerEventListeners();
    }



    registerEventListeners() {
        const easyButton = document.getElementById("easy");
        easyButton.addEventListener("click", function () {
            this.swapScreen()
            this.difficulty = "easy";
            this.tiles = Easy;
            var fontsize = 40;
            var fontface = 'verdana';
            this.ctx.font = fontsize + 'px ' + fontface;
            this.draw();
        }.bind(this));
        const mediumButton = document.getElementById("medium");
        mediumButton.addEventListener("click", function () {
            this.swapScreen()
            this.difficulty = "medium";
            this.tiles = Medium;
            var fontsize = 30;
            var fontface = 'verdana';
            this.ctx.font = fontsize + 'px ' + fontface;
            this.draw();
        }.bind(this));
        const hardButton = document.getElementById("hard");
        hardButton.addEventListener("click", function () {
            this.swapScreen();
            this.difficulty = "hard";
            this.tiles = Hard;
            var fontsize = 30;
            var fontface = 'verdana';
            this.ctx.font = fontsize + 'px ' + fontface;
            this.draw();
        }.bind(this));


        const saveBtn = document.getElementById("save");
        saveBtn.addEventListener("click", function () {
            this.save()
        }.bind(this));

        const loadButton = document.getElementById("load");
        loadButton.addEventListener("click", function () {
            this.load();
        }.bind(this));

        const menuButton = document.getElementById("mainMenu");
        menuButton.addEventListener("click", function () {
            this.swapScreen();
        }.bind(this));

        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);

        this.canvas.onmousedown = function (e) {
            if (e.button == 0) {
                this.mousePressed = true;
                this.connect();
            } else if (e.button == 2) {
                e.preventDefault();
                e.preventDefault();
                this.mousePoz();
                this.deleteColor(this.colCount, this.rowCount);

            }
        }.bind(this);
        this.canvas.onmouseup = function (e) {
            if (e.button == 2) {
                e.preventDefault();
            }
            this.end = [this.colCount, this.rowCount];
            this.step += 1;
            if (this.tiles[this.end[0]][this.end[1]] == this.tiles[this.start[0]][this.start[1]] && (this.step > 2 && this.end[0] != this.start[0] || this.end[1] != this.start[1]) && Math.abs(this.way[this.way.length - 1][0] - this.colCount) + Math.abs(this.way[this.way.length - 1][1] - this.rowCount) <= 1) {
                c[this.colorCounter][1] = this.tiles[this.start[0]][this.start[1]];
                this.connect();
            } else {
                this.earase();
            }
            this.step = 0;
            this.start = [100, 100];
            this.end = [];
            this.way = [];
            this.mousePressed = false;
            if (this.isOver()) {
                console.log("You won!");
                this.win();

            }
        }.bind(this);
        this.canvas.onmousemove = () => {
            if (this.mousePressed) {
                this.color();
            }
        }
        this.canvas.onmouseout = () => {
            this.mousePressed = false;
            this.end = this.previous;
            this.start = [100, 100];
            this.step += 1;
            this.earase();
        }

    }
    draw() {
        this.ctx.fillStyle = "black";
        this.clear();
        if (this.difficulty == "easy") {
            this.w = 34;
            this.h = 30;
            this.size = 5;
            this.rectSize = this.canvas.width / this.size;
            this.ctx.beginPath();
            for (let rows = 1; rows < this.size + 1; rows++) {
                this.colorHelper = []
                this.saveColorHelper = []
                for (let cols = 1; cols < this.size + 1; cols++) {
                    this.saveColorHelper[cols - 1] = 13;
                    this.colorHelper[cols - 1] = false;
                    this.ctx.rect((cols - 1) * this.rectSize, (rows - 1) * this.rectSize, this.rectSize, this.rectSize);
                    this.ctx.stroke();
                    if (this.tiles[rows - 1][cols - 1] != 0 && this.tiles[rows - 1][cols - 1] < 10) {
                        this.ctx.fillText(this.tiles[rows - 1][cols - 1], cols * this.rectSize - this.w, rows * this.rectSize - this.h);
                    } else if (this.tiles[rows - 1][cols - 1] >= 10) {
                        this.ctx.fillText(this.tiles[rows - 1][cols - 1], cols * this.rectSize - (this.w / 2), rows * this.rectSize - this.h);
                    }
                }
                this.saveColor[rows - 1] = this.saveColorHelper;
                this.isColored[rows - 1] = this.colorHelper;
            }
        } else {
            this.w = 15;
            this.h = 12,
                this.size = 9;
            this.rectSize = this.canvas.width / this.size;
            this.ctx.beginPath();
            for (let rows = 1; rows < this.size + 1; rows++) {
                this.colorHelper = [];
                this.saveColorHelper = []
                for (let cols = 1; cols < this.size + 1; cols++) {
                    this.colorHelper[cols - 1] = false;
                    this.saveColorHelper[cols - 1] = 13;
                    this.ctx.rect((cols - 1) * this.rectSize, (rows - 1) * this.rectSize, this.rectSize, this.rectSize);
                    this.ctx.stroke();
                    if (this.tiles[rows - 1][cols - 1] != 0 && this.tiles[rows - 1][cols - 1] < 10) {
                        this.ctx.fillText(this.tiles[rows - 1][cols - 1], cols * this.rectSize - this.w, rows * this.rectSize - this.h);
                    } else if (this.tiles[rows - 1][cols - 1] >= 10) {
                        this.ctx.fillText(this.tiles[rows - 1][cols - 1], cols * this.rectSize - (this.w / 2), rows * this.rectSize - this.h);
                    }
                }
                this.saveColor[rows - 1] = this.saveColorHelper;
                this.isColored[rows - 1] = this.colorHelper;
            }
        }
        this.colorCounter = 0;
    }

    connect() {
        this.mousePoz();
        this.start = [100, 100];
        this.tiles[100] = this.start;
        if (this.mousePressed && this.tiles[this.colCount][this.rowCount] != 0 && !this.isColored[this.rowCount][this.colCount]) {
            this.previous = [this.colCount, this.rowCount];
            this.way[this.step] = this.previous;
            this.start = [this.colCount, this.rowCount];
            if (this.end.length == 0) { this.lineColor = this.nextColor(); }
            this.ctx.fillStyle = this.lineColor;
            this.steps = 0;
            this.move(this.rowCount, this.colCount);
            this.ctx.fillRect(this.rowCount * this.rectSize + 1, this.colCount * this.rectSize + 1, this.rectSize - 2, this.rectSize - 2);
            this.isColored[this.rowCount][this.colCount] = true;
            this.saveColor[this.rowCount][this.colCount] = this.tiles[this.start[0]][this.start[1]];

        }



    }
    color() {
        this.ctx.fillStyle = this.lineColor;
        this.mousePoz();
        if (!this.isColored[this.rowCount][this.colCount] && (this.tiles[this.colCount][this.rowCount] == 0) && (Math.abs(this.rowCount - this.previous[1]) + Math.abs(this.colCount - this.previous[0])) <= 1 && this.start[0] != 100) {
            if ((Math.abs(this.colCount - this.previous[0]) <= 1) && (Math.abs(this.rowCount - this.previous[1]) <= 1)) {
                this.previous = [this.colCount, this.rowCount];
                this.move(this.rowCount, this.colCount);
                this.ctx.fillRect(this.rowCount * this.rectSize + 1, this.colCount * this.rectSize + 1, this.rectSize - 2, this.rectSize - 2);
                this.isColored[this.rowCount][this.colCount] = true;
                this.saveColor[this.rowCount][this.colCount] = this.tiles[this.start[0]][this.start[1]];
            }


        }
        if ((Math.abs(this.rowCount - this.previous[1]) + Math.abs(this.colCount - this.previous[0])) < 2 && this.step >= 2 && this.isColored[this.rowCount][this.colCount]) {
            if (!(this.tiles[this.rowCount][this.colCount] != 0 && this.tiles[this.start[0]][this.start[1]] != this.tiles[this.rowCount][this.colCount])) {
                this.previous = [this.colCount, this.rowCount];
                if (this.way[this.step - 2][0] == this.previous[0] && this.way[this.step - 2][1] == this.previous[1]) {
                    this.deleteLine();
                }
            }
        }
    }
    mousePoz() {
        let rect = this.canvas.getBoundingClientRect();
        this.colCount = Math.floor((event.clientY - rect.top) / this.rectSize);
        this.rowCount = Math.floor((event.clientX - rect.left) / this.rectSize);
        if (this.rowCount >= this.size - 1) this.rowCount = this.size - 1;
        if (this.rowCount <= 0) this.rowCount = 0;

        if (this.colCount >= this.size - 1) this.colCount = this.size - 1;
        if (this.colCount <= 0) this.colCount = 0;
    }
    move(rowCount, colCount) {
        this.way[this.step] = [colCount, rowCount];
        this.step += 1;

    }

    earase() {
        for (let i = 0; i < this.step - 1; i++) {
            let y = this.way[i][0];
            let x = this.way[i][1];
            this.ctx.fillStyle = "lightgray";
            this.ctx.fillRect(x * this.rectSize, y * this.rectSize, this.rectSize, this.rectSize);
            this.fillStyle = "rgba(255,255,255,0)";
            this.ctx.beginPath();
            this.canvas.fillStyle = "black";
            this.ctx.fillStyle = "black";
            this.ctx.rect(x * this.rectSize, y * this.rectSize, this.rectSize, this.rectSize);
            this.ctx.stroke();
            this.isColored[x][y] = false;
            this.saveColor[x][y] = 13;
            if (this.tiles[y][x] != 0 && this.tiles[y][x] < 10) {
                this.ctx.fillText(this.tiles[y][x], (x + 1) * this.rectSize - this.w, (y + 1) * this.rectSize - this.h);
            } else if (this.tiles[y][x] >= 10) {
                this.ctx.fillText(this.tiles[y][x], (x + 1) * this.rectSize - (this.w / 2), (y + 1) * this.rectSize - this.h);
            }
        }
        this.step = 0;
        this.start = [100, 100];
        this.end = [];

    }
    deleteLine() {
        let y = this.way[this.step - 1][0];
        let x = this.way[this.step - 1][1];

        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(x * this.rectSize, y * this.rectSize, this.rectSize, this.rectSize);
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.rect(x * this.rectSize, y * this.rectSize, this.rectSize, this.rectSize);
        this.ctx.stroke();
        this.isColored[x][y] = false;
        this.saveColor[x][y] = 13;
        this.way.pop();
        this.step -= 1;

    }
    deleteColor(colCount, rowCount) {
        if (this.start[0] != undefined && this.start[1] != undefined) {
            let numberOfColor = this.saveColor[rowCount][colCount];
            for (let rows = 0; rows < this.size; rows++) {
                for (let cols = 0; cols < this.size; cols++) {
                    if (this.saveColor[rows][cols] == numberOfColor) {
                        this.ctx.fillStyle = "lightgray";
                        this.ctx.fillRect(rows * this.rectSize, cols * this.rectSize, this.rectSize, this.rectSize);
                        this.ctx.beginPath();
                        this.ctx.fillStyle = "black";
                        this.ctx.rect(rows * this.rectSize, cols * this.rectSize, this.rectSize, this.rectSize);
                        this.ctx.stroke();
                        this.isColored[rows][cols] = false;
                        this.saveColor[rows][cols] = 13;
                        if (this.tiles[cols][rows] != 0 && this.tiles[cols][rows] < 10) {
                            this.ctx.fillText(this.tiles[cols][rows], (rows + 1) * this.rectSize - this.w, (cols + 1) * this.rectSize - this.h);
                        } else if (this.tiles[cols][rows] >= 10) {
                            this.ctx.fillText(this.tiles[cols][rows], (rows + 1) * this.rectSize - (this.w / 2), (cols + 1) * this.rectSize - this.h);
                        }
                    }
                }
            }
        }
    }
    nextColor() {
        do {
            this.colorCounter += 1;
            if (this.colorCounter == 11) {
                this.colorCounter = 0;
            }
        } while (c[this.colorCounter[1] != 13])
        return c[this.colorCounter][0];
    }

    save() {
        switch (this.difficulty) {
            case ("easy"):
                if (localStorage.getItem("saveColorE00") != null) {
                    if (confirm("Biztosan felülírja az előző mentést?")) {
                        for (let rows = 0; rows < this.size; rows++) {
                            for (let cols = 0; cols < this.size; cols++) {
                                localStorage.setItem("saveColorE" + rows + cols, this.saveColor[rows][cols]);
                                localStorage.setItem("isColoredE" + rows + cols, this.isColored[rows][cols]);
                            }
                        }
                    }
                } else {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            localStorage.setItem("saveColorE" + rows + cols, this.saveColor[rows][cols]);
                            localStorage.setItem("isColoredE" + rows + cols, this.isColored[rows][cols]);
                        }
                    }
                }
                break;
            case ("medium"):
                if (localStorage.getItem("saveColorM00") != null) {
                    if (confirm("Biztosan felülírja az előző mentést?")) {
                        for (let rows = 0; rows < this.size; rows++) {
                            for (let cols = 0; cols < this.size; cols++) {
                                localStorage.setItem("saveColorM" + rows + cols, this.saveColor[rows][cols]);
                                localStorage.setItem("isColoredM" + rows + cols, this.isColored[rows][cols]);
                            }
                        }
                    }
                } else {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            localStorage.setItem("saveColorM" + rows + cols, this.saveColor[rows][cols]);
                            localStorage.setItem("isColoredM" + rows + cols, this.isColored[rows][cols]);
                        }
                    }
                }
                break;

            case ("hard"):
                if (localStorage.getItem("saveColorH00") != null) {
                    if (confirm("Biztosan felülírja az előző mentést?")) {
                        for (let rows = 0; rows < this.size; rows++) {
                            for (let cols = 0; cols < this.size; cols++) {
                                localStorage.setItem("saveColorH" + rows + cols, this.saveColor[rows][cols]);
                                localStorage.setItem("isColoredH" + rows + cols, this.isColored[rows][cols]);
                            }
                        }
                    }
                } else {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            localStorage.setItem("saveColorH" + rows + cols, this.saveColor[rows][cols]);
                            localStorage.setItem("isColoredH" + rows + cols, this.isColored[rows][cols]);
                        }
                    }
                }
                break;


        }
    }
    load() {
        switch (this.difficulty) {
            case ("easy"):

                if (localStorage.getItem("saveColorE00") === null) {
                    alert("Nincs mentett játékállás");
                } else {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            this.saveColor[rows][cols] = localStorage.getItem("saveColorE" + rows + cols);
                            if (localStorage.getItem("isColoredE" + rows + cols) == "false") this.isColored[rows][cols] = false;
                            else this.isColored[rows][cols] = true;
                        }
                    }
                    this.reload();
                }
                break;
            case ("medium"):
                if (localStorage.getItem("saveColorM00") != null) {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            this.saveColor[rows][cols] = localStorage.getItem("saveColorM" + rows + cols);
                            if (localStorage.getItem("isColoredM" + rows + cols) == "false") this.isColored[rows][cols] = false;
                            else this.isColored[rows][cols] = true;
                        }
                    }
                    this.reload();
                } else {
                    alert("Nincs mentett játékállás");
                }
                break;
            case ("hard"):
                if (localStorage.getItem("saveColorH00") != null) {
                    for (let rows = 0; rows < this.size; rows++) {
                        for (let cols = 0; cols < this.size; cols++) {
                            this.saveColor[rows][cols] = localStorage.getItem("saveColorH" + rows + cols);
                            if (localStorage.getItem("isColoredH" + rows + cols) == "false") this.isColored[rows][cols] = false;
                            else this.isColored[rows][cols] = true;
                        }
                    }
                    this.reload();
                } else {
                    alert("Nincs mentett játékállás");
                }
                break;
        }
    }
    reload() {
        this.isOver();
        for (let rows = 0; rows < this.size; rows++) {
            for (let cols = 0; cols < this.size; cols++) {
                if (this.saveColor[rows][cols] != 13) {
                    for (let i = 0; i < 12; i++) {
                        if (c[i][1] == this.saveColor[rows][cols]) {
                            this.ctx.fillStyle = c[i][0];
                        }
                    }
                } else {
                    this.ctx.fillStyle = "lightgray";
                }
                this.ctx.fillRect(rows * this.rectSize, cols * this.rectSize, this.rectSize, this.rectSize);
                this.ctx.beginPath();
                this.ctx.fillStyle = "black";
                this.ctx.rect(rows * this.rectSize, cols * this.rectSize, this.rectSize, this.rectSize);
                this.ctx.stroke();
                if (this.tiles[cols][rows] != 0 && this.tiles[cols][rows] < 10) {
                    this.ctx.fillText(this.tiles[cols][rows], (rows + 1) * this.rectSize - this.w, (cols + 1) * this.rectSize - this.h);
                } else if (this.tiles[cols][rows] >= 10) {
                    this.ctx.fillText(this.tiles[cols][rows], (rows + 1) * this.rectSize - (this.w / 2), (cols + 1) * this.rectSize - this.h);
                }
            }
        }
    }



    isOver() {
        let c = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.isColored[i][j]) c++;
            }
        }
        return c == (this.size * this.size);
    }
    win() {
        this.ctx.fillStyle = "rgba(0,0,0,0.5";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "lightgray";
        this.canvas.textAlign = "center";
        this.ctx.fillText("You Won", 320, 235, this.canvas.width);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }
    swapScreen() {
        var y = document.getElementById("homepage");
        if (y.style.display === "none") {
            y.style.display = "block";
        } else y.style.display = "none";

        var x = document.getElementById("display");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else x.style.display = "none";
    }
}
const game = new Draw();