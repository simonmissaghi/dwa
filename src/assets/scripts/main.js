function wait1() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('1 second');
      resolve();
    }, 1000);
  });
}

function wait2() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('2 second');
      resolve();
    }, 2000);
  })
}

function ready() {
  console.log('let\'s go');
}

Promise
  .all([
    wait1(),
    wait2(),
  ])
  .then(ready);


class Bootstrap {
  // Start application
  static start() {

  }

  constructor() {
    // Attendre la résolution de dom / font
    // Then, ready
  }

  // Wait for DOM content loaded
  domReady() {
    // Return promise
  }

  // Wait for Google fonts loaded
  fontReady() {
    // Return promise
  }

  // Ready, show page
  ready() {
    document.documentElement.classList.add('ready');
  }
}

// Usage
Bootstrap.start();
