export class Utils {
  static heightCalculation(perPageLimit) {
    return `${parseInt(perPageLimit) * 32}px`;
  }
}
