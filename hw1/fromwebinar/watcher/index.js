class Watcher {
  constructor(onCompleteCb) {
    this.onCompleteCb = onCompleteCb;
    this.process = [];
    this.isStarted = false;
  }

  started() {
    this.isStarted = true;
  }

  startProcess(element) {
    this.process.push(element);
  }

  endProcess(element) {
    const index = this.process.findIndex(item => item === element);
    this.process.splice(index, 1);
    this._checkAllComplete();
  }

  _checkAllComplete() {
    if (this.isStarted && this.process.length === 0) {
      this.onCompleteCb();
    }
  }
}

module.exports = Watcher;
