/**
 * Permissionless Innovation: Adversarial Shadowing
 * Real-time Neural Drift detection via twin-state simulation.
 */
export const checkNeuralDrift = (livePnL: number, shadowPnL: number): boolean => {
  if (shadowPnL > livePnL * 1.15) {
    console.warn("🚨 [SENTINEL] Neural Drift Detected. Shadow Twin outperforming. Throttling...");
    return true; // Trigger Veto
  }
  return false;
};
