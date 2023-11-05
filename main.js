document.getElementById("open-modal").addEventListener("click", function () {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  document.body.appendChild(overlay);

  const modal = document.createElement("div");
  modal.id = "modal";
  overlay.appendChild(modal);

  const closeButton = document.createElement("button");
  closeButton.id = "close-modal";
  closeButton.innerHTML = "&times;";
  modal.appendChild(closeButton);

  const container = document.createElement("div");
  container.id = "container";
  modal.appendChild(container);

  const imageCanvas = document.createElement("canvas");
  imageCanvas.id = "imageCanvas";
  imageCanvas.width = 400;
  imageCanvas.height = 241;
  container.appendChild(imageCanvas);

  const scratchCanvas = document.createElement("canvas");
  scratchCanvas.id = "scratchCanvas";
  scratchCanvas.width = 400;
  scratchCanvas.height = 241;
  container.appendChild(scratchCanvas);

  initializeCanvas(imageCanvas, scratchCanvas);

  overlay.style.display = "flex";

  closeButton.addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  });
});

function initializeCanvas(imageCanvas, scratchCanvas) {
  const imageCtx = imageCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");

  let isDrawing = false;

  function startDrawing(event) {
    console.log("startDrawing", event.type);
    event.preventDefault();
    isDrawing = true;
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();

    let x, y;
    if (event.type === "touchstart") {
      x = event.touches[0].clientX - scratchCanvas.getBoundingClientRect().left;
      y = event.touches[0].clientY - scratchCanvas.getBoundingClientRect().top;
    } else {
      x = event.offsetX;
      y = event.offsetY;
    }
    scratchCtx.moveTo(x, y);
  }

  function stopDrawing(event) {
    console.log("stopDrawing", event.type); // Add this line
    event.preventDefault(); // Prevent default behavior for both mouse and touch events
    isDrawing = false;
  }

  function draw(event) {
    console.log("draw", event.type);
    if (!isDrawing) return;

    let x, y;
    if (event.type === "touchmove" || event.type === "touchstart") {
      x = event.touches[0].clientX - scratchCanvas.getBoundingClientRect().left;
      y = event.touches[0].clientY - scratchCanvas.getBoundingClientRect().top;
    } else {
      x = event.offsetX;
      y = event.offsetY;
    }

    scratchCtx.lineWidth = 40;
    scratchCtx.lineCap = "round";

    scratchCtx.lineTo(x, y);
    scratchCtx.stroke();
  }

  const image = new Image();
  image.src = "caiado.jpeg";
  image.onload = function () {
    imageCtx.drawImage(
      image,
      0,
      0,
      imageCanvas.width,
      imageCanvas.height,
      0,
      0,
      imageCanvas.width,
      imageCanvas.height
    );

    scratchCtx.fillStyle = "#3f3e3e";
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    scratchCtx.font = "30px Arial";
    scratchCtx.fillStyle = "#ffffff";
    scratchCtx.fillText(
      "A trilha do seu futuro é aqui e agora!",
      25,
      130,
      scratchCanvas.width - 50
    );
  };

  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("touchstart", startDrawing, {
    passive: false,
  });
  scratchCanvas.addEventListener("touchend", stopDrawing, {
    passive: false,
  });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
}
