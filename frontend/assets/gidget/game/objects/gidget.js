export default {
  image: 'gidget',
  layer: 5,

  exposed: {
    async wait(milliseconds) {
      return await new Promise(resolve => setTimeout(resolve, milliseconds));
    },
  }
}
