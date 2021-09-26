class Paint {
  constructor() {
    this.canvas = document.getElementById("broad");
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = 650;
    this.ctx = this.canvas.getContext("2d");
    this.color = "#ff0000";
    this.tool = "pen";
    this.lineWidth = 5;
    // listen mouse event
    this.listenEvent();

    this.currentPos = {
      x: 0,
      y: 0,
    };

    this.startPos = {
      x: 0,
      y: 0,
    };
    this.drawing = false;
    this.drawLine(10, 10, 100, 100);

    //store array
    this.store_array = [];
    this.index = -1;
    this.image = null;
    this.image_tmp = null;
  }

  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  mousedown(event) {
    let mousePos = this.getMousePos(event);
    this.startPos = this.getMousePos(event);
    this.drawing = true;
    this.image_tmp = new Image();
    this.image_tmp.src = this.canvas.toDataURL("image/bmg", 1.0);
  }
  mousemove(event) {
    let mousePos = this.getMousePos(event);
    if (this.drawing) {
      switch (this.tool) {
        case "pen":
          this.drawLine(this.currentPos, mousePos);
          break;
        case "line":
          this.setDrawLine();
          this.drawLine(this.startPos, mousePos);
          break;
        case "rect":
          this.setDrawLine();
          this.drawRect(this.startPos, mousePos);
          break;
        case "tria":
          this.setDrawLine();
          this.drawTraingle(this.startPos, mousePos);
          break;
      }
    }
    this.currentPos = mousePos;
  }
  mouseup(event) {
    this.drawing = false;
    this.ctx.stroke();
    this.ctx.closePath();
    //push in store
    this.store_array.push(
      this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );
    this.index += 1;
    this.storeCanvas();
  }
  listenEvent() {
    this.canvas.addEventListener("mousedown", (event) => this.mousedown(event));
    this.canvas.addEventListener("mousemove", (event) => this.mousemove(event));
    this.canvas.addEventListener("mouseup", (event) => this.mouseup(event));
  }
  // ve ngau nhien
  drawLine(startPos, endPos) {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(startPos.x, startPos.y);
    this.ctx.lineTo(endPos.x, endPos.y);
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }
  //ve hinh chu nhat
  drawRect(startPos, endPos) {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.rect(
      startPos.x,
      startPos.y,
      endPos.x - startPos.x,
      endPos.y - startPos.y
    );
    this.ctx.stroke();
  }
  storeCanvas() {
    if (typeof localStorage != null) {
      localStorage.setItem("imgCanvas", this.canvas.toDataURL());
    } else {
      window.alert("Your browser does not support local storage");
    }
  }
  loadCanvas() {
    if (localStorage.getItem("imgCanvas") != null) {
      this.image = new Image();
      this.image.onload = () => {
        this.ctx.drawImage(this.image, 0, 0);
      };
      this.image.src = localStorage.getItem("imgCanvas");
    }
  }
  clear_canvas() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.storeCanvas();
    this.store_array = [];
    this.index = -1;
  }
  //undo
  undo() {
    if (this.index <= 0) {
      this.clear_canvas();
    } else {
      this.store_array.pop();
      this.index -= 1;
      this.ctx.putImageData(this.store_array[this.index], 0, 0);
      this.storeCanvas();
    }
  }
  setDrawLine() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.image_tmp,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  //save canvas
  save() {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(this.canvas.msToBlob(), "canvas-image.png");
    } else {
      const a = document.createElement("a");
      a.href = this.canvas.toDataURL();
      a.download = "canvas-image.png";
      a.click();
      document.body.removeChild(a);
    }
  }
}
var p = new Paint();
p.loadCanvas();

function changeTool(tool) {
  p.tool = tool;
}
function undo() {
  p.undo();
}

function save() {
  p.save();
}

function changeColor(clor) {
  p.color = clor;
}
