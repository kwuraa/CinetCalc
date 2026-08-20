export function calculateTotalEnergy(massKg, velocityKmh) {
  const velMs = velocityKmh / 3.6;
  return 0.5 * massKg * Math.pow(velMs, 2);
}

export function calculateEffectiveEnergy(totalEnergyJoules, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return totalEnergyJoules * Math.pow(Math.sin(rad), 2);
}

export function calculateRequiredEnergy(effectiveEnergyJoules, marginFactor = 1.2) {
  return effectiveEnergyJoules * marginFactor;
}

export function getSeverityClassification(effectiveJoules) {
  if (effectiveJoules < 5000) {
    return {
      label: "Leve Impacto (< 5 kJ)",
      className: "severity-badge low",
      fillPercentage: "22%",
    };
  } else if (effectiveJoules < 20000) {
    return {
      label: "Médio Impacto (5 - 20 kJ)",
      className: "severity-badge medium",
      fillPercentage: "50%",
    };
  } else if (effectiveJoules < 45000) {
    return {
      label: "Alto Impacto (20 - 45 kJ)",
      className: "severity-badge high",
      fillPercentage: "80%",
    };
  } else {
    return {
      label: "Severo / Extremo (> 45 kJ)",
      className: "severity-badge extreme",
      fillPercentage: "100%",
    };
  }
}

export function formatNumber(value, decimals = 2) {
  if (value >= 1e6) {
    return value.toExponential(2);
  }
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
