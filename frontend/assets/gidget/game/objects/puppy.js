export default {
  image: 'puppy.png',

  onCreate() {
    // Bark every 20 seconds
    const messages = ['bark', 'bark!', 'bark.', 'bark?'];
    this.interval = setInterval(() => this.shout(_.sample(messages, -1)), 20000)
  },

  onDestroy() {
    clearInterval(this.interval);
  }
}
