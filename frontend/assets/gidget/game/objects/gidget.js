export default {
  image: 'gidget.png',
  layer: 5,

  exposed: {
    async wait(ms) {
      return await new Promise(resolve => setTimeout(resolve, ms));
    },
  }
}
