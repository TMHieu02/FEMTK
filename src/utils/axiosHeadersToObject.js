export function axiosHeadersToObject(axiosHeaders) {
  return Object.entries(axiosHeaders).reduce((accumulator, [key, value]) => {
    accumulator[key] = value;
    return accumulator;
  }, {});
}
