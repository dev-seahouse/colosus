import { TransformFnParams } from 'class-transformer';

/**
 * This is here due to the odd behavior by class-transformer used in Nest.js.
 * The behavior here is that non-boolean values will always be parsed as true.
 * This forces it to show the actual value passed in.
 * @param {TransformFnParams} classTransformerInput The value from the transform decorator/directive.
 * @returns {any} The actual value of the field.
 */
export function ForceActualValueForBooleanField(
  classTransformerInput: TransformFnParams
) {
  const { obj, key } = classTransformerInput;
  return obj[key];
}
