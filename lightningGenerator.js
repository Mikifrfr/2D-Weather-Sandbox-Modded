onmessage = (event) => {
  const msg = event.data;
  let imgElement = generateLightningBolt(msg.width, msg.height);
  postMessage(imgElement);
};

function generateLightningBolt(width, height) {
  const lightningCanvas = new OffscreenCanvas(width, height);
  const ctx = lightningCanvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  function genLightningColor(lineWidth, opacity) {
    const colR = 255;
    const colG = 255;
    const colB = 255;
    let brightness = Math.pow(lineWidth, 1.2);
    brightness = Math.min(brightness, 1.0);
    return `rgba(${colR * brightness}, ${colG * brightness}, ${colB * brightness}, ${opacity})`;
  }

  function drawGlow(x, y, size, alpha) {
    const gradient = ctx.createRadialGradient(x, y, size / 4, x, y, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  function smoothNoise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  ctx.beginPath();

  let startX = width / 2.0;
  let startY = 0;
  let angle = Math.PI / 6.;
  let lineWidth = 5.0;
  const targetAngle = 0.0;

  ctx.moveTo(startX, startY);
  ctx.lineWidth = lineWidth;

  while (startY < height) {
    const noise = (smoothNoise(startX, startY) - 0.5) * 2;
    const nextX = startX + Math.sin(angle) * (lineWidth / 2);
    const nextY = startY + Math.cos(angle) * (lineWidth / 2);

    angle += noise * 1.4;
    angle -= (angle - targetAngle) * 0.1;

    ctx.lineTo(nextX, nextY);
    startX = nextX;
    startY = nextY;

    if (Math.random() < 0.015 * (1. - nextY / height)) {
      ctx.strokeStyle = genLightningColor(lineWidth, 1.0);
      ctx.stroke();
      drawBranch(nextX, nextY, targetAngle + (Math.random() - 0.5) * 2.5, lineWidth * 0.5 * Math.random());
      ctx.beginPath();
      ctx.moveTo(nextX, nextY);
      ctx.lineWidth = lineWidth;
    }

    drawGlow(startX, startY, lineWidth * 2, 1.0);
  }
  ctx.strokeStyle = genLightningColor(lineWidth, 1.0);
  ctx.stroke();

  return ctx.getImageData(0, 0, width, height);

  function drawBranch(startX, startY, targetAngle, lineWidth) {
    let angle = targetAngle;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineWidth = lineWidth;

    while (startY < height) {
      const noise = (smoothNoise(startX, startY) - 0.5) * 2;
      const nextX = startX + Math.sin(angle) * (lineWidth / 2);
      const nextY = startY + Math.cos(angle) * (lineWidth / 2);

      angle += noise * 0.7;
      angle -= (angle - targetAngle) * 0.1;

      ctx.lineTo(nextX, nextY);
      startX = nextX;
      startY = nextY;

      if (Math.random() < 0.02) {
        ctx.strokeStyle = genLightningColor(lineWidth, 0.8);
        ctx.stroke();
        lineWidth -= 0.1;

        if (lineWidth < 0.1) return;

        if (Math.random() < 0.1) {
          drawBranch(nextX, nextY, targetAngle + (Math.random() - 0.5) * 1.5, lineWidth);
        }

        ctx.beginPath();
        ctx.moveTo(nextX, nextY);
        ctx.lineWidth = lineWidth;
      }

      drawGlow(startX, startY, lineWidth * 2, 0.8);
    }
    ctx.strokeStyle = genLightningColor(lineWidth, 0.8);
    ctx.stroke();
  }
}