// singleton pattern here lol

const GlobalListener = {
  listeners: [],

  on(eventName, callback, ...options) {
    const index = this.listeners.length;
    const object = {
      index,
      function: callback,
      eventName,
      options,
    };
    this.listeners.push(object);
    window.addEventListener(
      object.eventName,
      object.function,
      ...object.options);
    return index;
  },

  off(index) {
    const i = this.listeners.findIndex((object) => object.index === index);
    if (i < 0) {
      console.error('No appropriate listener found');
      return;
    }
    const o = this.listeners[i];
    window.removeEventListener(o.eventName, o.function, ...o.options);
    this.listeners.splice(i, 1);
  },

  getFunction(index) {
    const i = this.listeners.findIndex((object) => object.index === index);
    if (i < 0) {
      console.error('No appropriate listener found');
      return;
    }
    return this.listeners[i];
  }
};

if (window.GlobalListener === undefined) {
  window.GlobalListener = GlobalListener;
}

export default window.GlobalListener;
