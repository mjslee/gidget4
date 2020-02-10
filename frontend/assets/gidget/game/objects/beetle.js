export default {
  image: 'beetle.png',

  onCreate() {
    // Bark every 20 seconds
    const messages = ['click', 'click!', 'click.', 'click?'];
    this.interval = setInterval(async () => {
      if (_.random(10) === 0)
        await this.say({ text: _.sample(messages, -1) });
    }, 1000)
  },

  onDestroy() {
    clearInterval(this.interval);
  }
}
