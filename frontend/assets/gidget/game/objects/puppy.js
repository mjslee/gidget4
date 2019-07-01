export default {
  image: 'puppy.png',

  onCreate() {
    // Bark every 10 seconds.
    const messages = ['bark', 'bark!', 'bark.', 'bark?'];
    this.interval = setInterval(() => this.shout(_.sample(messages)), 10000);
  },

  onDestroy() {
    clearInterval(this.interval);
  }
}
