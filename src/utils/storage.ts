export const local = {
  get: (name: string) => {
    const str = localStorage.getItem(name)
    return str ? JSON.parse(str) : null
  },
  set: (name: string, data: unknown) => {
    const str = JSON.stringify(data)
    localStorage.setItem(name, str)
  },
}
