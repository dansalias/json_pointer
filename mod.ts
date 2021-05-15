type Data = Record<string, any>

function escape(path: string): string {
  return path.replaceAll('~1', '/').replaceAll('~0', '~')
}

function getPath(pointer: string): string[] {
  return pointer.substring(1).split('/').map(escape)
}

function deepApply(data: Data, path: string[], value: any): void {
  if (path.length === 1) {
    data[path[0]] = value
    return
  }
  return deepApply(data[path[0]], path.slice(1), value)
}

/**
 * Return the value at the given JSON pointer in object.
 *
 * @param data object
 * @param pointer string
 * @return any
 */
export function get(
  data: Data,
  pointer: string
): any {
  let value = data
  if (pointer === '') return data
  if (!pointer.startsWith('/')) throw new Error (`Invalid pointer "${pointer}"`)
  for (const path of getPath(pointer)) {
    value = value[path]
  }
  return value
}

/**
 * Update the value at the given JSON pointer in object.
 *
 * @param data object
 * @param pointer string
 * @return void
 */
export function set(
  data: Data,
  pointer: string,
  value: any
): void {
  deepApply(data, getPath(pointer), value)
}