import WebFont from 'webfontloader';

import { qs } from 'utils/dom';
import App from 'components/App';

class Dwa {
  static start() {
    return new Dwa();
  }

  constructor() {
    Promise
      .all([
        Dwa.domReady(),
        Dwa.fontReady(),
        Dwa.waitReady(),
      ])
      .then(this.ready.bind(this));
  }

  static domReady() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  static fontReady() {
    return new Promise(resolve => {
      WebFont.load({
        google: {
          families: ['Satisfy'],
        },
        active: resolve,
        inactive: resolve,
      });
    });
  }

  static waitReady() {
    return new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
  }

  ready() {
    console.log('🚀 DWA', this);
    document.querySelector('.loader').remove();
    // DEV
    // -> qs('.loader').remove();
    document.documentElement.classList.add('is-ready');
  }
}

Dwa.start();
