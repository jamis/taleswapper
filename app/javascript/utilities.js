function constructKeyFrom(elements) {
  return elements.map(el => btoa(el)).join('.')
}

function dig(object, path) {
  for (let step of path) {
    object = object?.[step];
  }

  return object;
}

export { constructKeyFrom, dig }
