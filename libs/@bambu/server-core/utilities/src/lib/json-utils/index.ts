/**
 * Importing it this way because TS is stupid.
 */
import safeJsonStringify = require('safe-json-stringify');

function serializeObjectAsJsonString(
  jsonObject: any,
  replacer?: (key: any, value: any) => any | any[] | null,
  space?: string | number
) {
  const plainObject: any = {};
  Object.getOwnPropertyNames(jsonObject).forEach((key) => {
    plainObject[key] = jsonObject[key];
  });

  return safeJsonStringify(plainObject, replacer, space);
}

/**
 * This is created to solve 2 problems, namely:
 *
 * 1. Fix issue with complex data objects with circular references causing errors/crashes.
 * 2. Allow the stringification/serialization of Error objects into a readable JSON string.
 *
 * The API is modelled after JSON.stringify() with safeguards and enhanced data extraction capabilities.
 *
 * Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {unknown} jsonObject          Object to strigify/serialize.
 * @param {Function} replacer       A function that alters the behavior of the stringification process, or an array of strings and numbers that specifies properties of value to be included in the output. If replacer is an array, all elements in this array that are not strings or numbers (either primitives or wrapper objects), including Symbol values, are completely ignored. If replacer is anything other than a function or an array (e.g. null or not provided), all string-keyed properties of the object are included in the resulting JSON string.
 * @param {string | number} space   Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 *
 * @returns {string} Serialized/string representation of JSON object.
 */
export function Stringify(
  jsonObject: any,
  replacer?: (key: any, value: any) => any | any[] | null,
  space?: string | number
) {
  if (jsonObject && Array.isArray(jsonObject)) {
    const result = [];
    const numberOfItems = jsonObject.length;

    for (let i = 0; i < numberOfItems; i++) {
      const item = jsonObject[i];
      result.push(
        JSON.parse(serializeObjectAsJsonString(item, replacer, space))
      );
    }

    return JSON.stringify(result, replacer, space);
  }

  return serializeObjectAsJsonString(jsonObject, replacer, space);
}
