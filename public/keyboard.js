// public/keyboard.js
export default function createKeyboardListener(document) {
  const state = { observers: [] }

  function subscribe(fn) { state.observers.push(fn) }
  function notifyAll(command) { for (const fn of state.observers) fn(command) }

  document.addEventListener("keydown", (e) => {
    const map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    }

    if (map[e.key]) {
      notifyAll({ keyPressed: map[e.key] })
    }
  })

  return { subscribe }
}
