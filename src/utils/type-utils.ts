export abstract class TypeUtils {
  static isArray(value: unknown) {
    return Array.isArray(value);
  }

  static isObject(value: unknown) {
    return typeof value === 'object';
  }

  static isDefined(value: unknown) {
    return value !== undefined && value !== null;
  }

  static toBoolean(value: unknown) {
    return !['0', 0, 'false', false, ''].includes(value as string | number | boolean);
  }
}
