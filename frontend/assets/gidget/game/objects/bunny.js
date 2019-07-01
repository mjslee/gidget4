import _ from 'lodash'


export default {
  image: 'bunny',


  async onTick() {
    if (_.random(1, 5) != 1)
      return;

    try {
      const x = _.random(-1, 1);
      const y = _.random(-1, 1);
      await this.walk(this.position.x + x, this.position.y + y);
    }

    catch (e) {

    }
  }
}
