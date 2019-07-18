export default {
    image: 'piglet-infected.png',
  
  onCreate() {
    // Bark every 20 seconds
    const messages = ['oink', 'oink!', 'oink.', 'oink?'];
    this.interval = setInterval(async () => {
      if (_.random(10) === 0)
        await this.say({ text: _.sample(messages, -1) });
    }, 1000)
  },
  
  onDestroy() {
    clearInterval(this.interval);
    }
  }
  



