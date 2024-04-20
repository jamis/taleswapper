function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function dig(object, path) {
  for (let step of path) {
    object = object?.[step];
  }

  return object;
}

export { capitalize, dig }
