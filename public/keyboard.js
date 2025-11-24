// public/keyboard.js
export default function createKeyboardListener(document) {
  const state = { observers: [] }

  function subscribe(fn) {
    state.observers.push(fn)
  }

  function notifyAll(command) {
    for (const fn of state.observers) fn(command)
  }

  const mapKeys = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  }

  document.addEventListener('keydown', e => {
    const direction = mapKeys[e.key]
    if (direction) {
      notifyAll({ keyPressed: direction })
    }
  })

  return { subscribe }
}
