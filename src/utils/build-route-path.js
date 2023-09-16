export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;
  // prettier-ignore
  const pathWithParams = path.replaceAll(routeParametersRegex, "(?<$1>[a-z0-9-\_]+)");
  //?<$1> primeira posição :id que foi declarado na rota
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}

