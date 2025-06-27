
class StatsHelper {
  constructor() {
    this.additionalUsers = 0;
  }

  getAdditionalUsers() {
    return this.additionalUsers;
  }

  setAdditionalUsers(count) {
    this.additionalUsers = count;
  }

  addAdditionalUsers(count) {
    this.additionalUsers += count;
  }
}

module.exports = new StatsHelper();
