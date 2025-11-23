// public/keyboard.js
export default function createKeyboardListener(document) {
  const state = { observers: [] }
  function subscribe(fn){ state.observers.push(fn) }
  function notifyAll(command){ for (const fn of state.observers) fn(command) }

  document.addEventListener('keydown', e => {
    const key = e.key
    // only arrows
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) {
      notifyAll({ keyPressed: key })
    }
  })

  return { subscribe }
}
