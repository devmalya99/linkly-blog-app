/** @type {import('socket.io').Server | null} */
let io = null

export function setIO(server) {
  io = server
}

export function getIO() {
  return io
}
