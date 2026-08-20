export function drawVectorSimulation(canvas, angleDeg, formulaElement) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const htmlRoot = document.documentElement;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = rect.width > 0 ? rect.width : 360;
  const height = rect.height > 0 ? rect.height : 130;

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const isLight = htmlRoot.getAttribute("data-theme") === "light";

  ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.035)";
  ctx.lineWidth = 1;
  for (let x = 16; x < width; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 16; y < height; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const barrierY = height - 26;
  const barrierHeight = 12;
  const barrierStartX = 24;
  const barrierEndX = width - 24;
  const barrierWidth = barrierEndX - barrierStartX;

  ctx.fillStyle = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.roundRect(barrierStartX, barrierY + 2, barrierWidth, barrierHeight + 2, 4);
  ctx.fill();

  ctx.fillStyle = "#ffb800";
  ctx.beginPath();
  ctx.roundRect(barrierStartX, barrierY, barrierWidth, barrierHeight, 4);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(barrierStartX, barrierY, barrierWidth, barrierHeight, 4);
  ctx.clip();
  ctx.fillStyle = "#111827";
  for (let bx = barrierStartX - 10; bx < barrierEndX + 20; bx += 22) {
    ctx.beginPath();
    ctx.moveTo(bx, barrierY);
    ctx.lineTo(bx + 10, barrierY + barrierHeight);
    ctx.lineTo(bx + 4, barrierY + barrierHeight);
    ctx.lineTo(bx - 6, barrierY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "#ff6b00";
  ctx.beginPath();
  ctx.arc(barrierStartX + 4, barrierY + barrierHeight / 2, 7, 0, Math.PI * 2);
  ctx.arc(barrierEndX - 4, barrierY + barrierHeight / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(barrierStartX + 4, barrierY + barrierHeight / 2, 2.5, 0, Math.PI * 2);
  ctx.arc(barrierEndX - 4, barrierY + barrierHeight / 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isLight ? "#64748b" : "#94a3b8";
  ctx.font = "600 10px 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("BARREIRA DS-FLEX", barrierStartX + 16, barrierY + barrierHeight + 16);

  const targetX = Math.round(width * 0.54);
  const targetY = barrierY;
  const rad = (angleDeg * Math.PI) / 180;
  const vectorLength = Math.min(height - 48, 68);
  const startX = targetX - Math.cos(rad) * vectorLength;
  const startY = targetY - Math.sin(rad) * vectorLength;

  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = isLight ? "rgba(100, 116, 139, 0.4)" : "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(targetX, targetY - (vectorLength + 6));
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  if (angleDeg < 90) {
    ctx.fillStyle = isLight ? "#94a3b8" : "#64748b";
    ctx.font = "500 8.5px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("90º ref", targetX, targetY - (vectorLength + 10));
    ctx.strokeStyle = "#ffb800";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 26, Math.PI, Math.PI + (90 - angleDeg) * (Math.PI / 180), false);
    ctx.stroke();
  }

  ctx.strokeStyle = "#ff6b00";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  const headLength = 10;
  const arrowAngle = Math.atan2(targetY - startY, targetX - startX);
  ctx.fillStyle = "#ff6b00";
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(targetX - headLength * Math.cos(arrowAngle - Math.PI / 7), targetY - headLength * Math.sin(arrowAngle - Math.PI / 7));
  ctx.lineTo(targetX - headLength * 0.5 * Math.cos(arrowAngle), targetY - headLength * 0.5 * Math.sin(arrowAngle));
  ctx.lineTo(targetX - headLength * Math.cos(arrowAngle + Math.PI / 7), targetY - headLength * Math.sin(arrowAngle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#ff6b00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(arrowAngle);
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.roundRect(-16, -9, 20, 18, 3);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(-11, -6, 10, 12);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.strokeRect(-11, -6, 10, 12);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(-16, -7, 3, 14);
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(4, -7, 8, 3);
  ctx.fillRect(4, 4, 8, 3);
  ctx.restore();

  const badgeText = `Vetor: ${angleDeg}º`;
  ctx.font = "bold 10px 'Inter', sans-serif";
  const textWidth = ctx.measureText(badgeText).width;
  const badgePadX = 6;
  const badgeH = 18;
  const badgeW = textWidth + badgePadX * 2;
  const badgeX = angleDeg === 90
    ? targetX - badgeW / 2
    : Math.max(10, Math.min(width - badgeW - 10, startX - badgeW / 2));
  const badgeY = Math.max(6, startY - 26);

  ctx.fillStyle = isLight ? "#ffffff" : "#0f172a";
  ctx.strokeStyle = "#ff6b00";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);

  ctx.restore();

  if (formulaElement) {
    if (angleDeg === 90) {
      formulaElement.textContent = "E_efetiva = E_total × 1.00 (100% da Força Frontal)";
    } else {
      const factor = Math.pow(Math.sin(rad), 2).toFixed(2);
      formulaElement.textContent = `E_efetiva = E_total × sen²(${angleDeg}º) [× ${factor}]`;
    }
  }
}
