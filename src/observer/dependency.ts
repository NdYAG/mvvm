import Watcher from './watcher'

export default class Dependency {
  static watcher: Watcher
  private watchers: Watcher[]
  private watcherIds: Set<number>
  constructor() {
    this.watchers = []
    this.watcherIds = new Set()
  }
  addWatcher(watcher) {
    if (!this.watcherIds.has(watcher.id)) {
      this.watchers.push(watcher)
      this.watcherIds.add(watcher.id)
    }
  }
  notify(newValue) {
    this.watchers.forEach(watcher => {
      watcher.update(newValue)
    })
  }
}
