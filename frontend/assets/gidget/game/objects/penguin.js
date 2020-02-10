export default {
  image: 'penguin.png',

  onCreate() {
    // Bark every 20 seconds
    const messages = ['caw', 'caw!', 'caw.', 'caw?'];
    this.interval = setInterval(async () => {
      if (_.random(10) === 0)
        await this.say({ text: _.sample(messages, -1) });
    }, 1000)
  },

  onDestroy() {
    clearInterval(this.interval);
  }
}



