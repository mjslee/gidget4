export default {
  name: 'Gidget',
  sprite: 'gidget',

  messages: {
    onComplete: 'We did it!',
    onIncomplete: 'We have a little more work to do...',
    energyDepleted: {
      text: 'I ran out of energy!'
    }
  },

  documentation: {
    test: {
      name: 'test',
      description: ({ name }) => `
        Test function for **${name}**.
      `,

      example: ({ name }) => `
        \`\`\`js
        ${name}.test();
        \`\`\`
      `,

      type: 'function',
      parameters: [],
      returns: 'boolean'
    }
  },

  exposed: {
    /**
     * [TODO:description]
     *
     * @return {[TODO:type]} [TODO:description]
     */
    test() {
      return true;
    }
  },

  onMove() {
    if (this.energy <= 0)
      throw this.messages.energyDepleted

    this.energy -= 1
  }
}
