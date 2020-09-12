import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export function fp(relPath) {
  return path.resolve(path.join(__dirname, relPath))
}
