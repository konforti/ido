var explode = function(props) {
  props = props || {};
  this.clicked = false;
  this.amount = props.amount || 5;
  this.element = document.querySelector('.clipped-box');

  this.genClips();
};

explode.prototype.genClips = function() {
  // Get the width of each clipped rectangle.
  var width = this.element.clientWidth / this.amount;
  var height = this.element.clientHeight / this.amount;

  for (var z = 0, y = 0; z <= (this.amount * width); z = z + width) {
    var clip = document.createElement('div');
    clip.setAttribute('class', 'clipped');
    clip.style.clip = 'rect(' + y + 'px, ' + (z + width) + 'px, ' + (y + height) + 'px, ' + z + 'px)';
    this.element.appendChild(clip);
    if (z === (this.amount * width) - width) {

      y = y + height;
      z = -width;
    }

    if (y === (this.amount * height)) {
      z = 9999999;
    }
  }
};

// A quick random function for selecting random numbers.
explode.prototype.rand = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

explode.prototype.each = function(nodes, callback) {
  var i, length = nodes.length;
  for (i = 0; i < length; ++i) {
    callback(nodes[i]);
  }
};

explode.prototype.boom = function() {
  var _self = this;
  if (this.clicked === false) {

    // Has been clicked,
    // so ignore any other click until this is reset.
    _self.clicked = true;

    // Apply to each clipped-box div.
    var els = document.querySelectorAll('.clipped-box div');
    _self.each(els, function(el) {

      // So the speed is a random speed between 90m/s and 120m/s. I know that seems like a lot
      // But otherwise it seems too slow. That's due to how I handled the timeout.
      var v = _self.rand(120, 90);

      // The angle (the angle of projection) is a random number between 80 and 89 degrees.
      var angle = _self.rand(89, 80);

      // Theta is the angle in radians
      var theta = (angle * Math.PI) / 180;

      // And gravity is -9.8. If you live on another planet feel free to change
      var g = -9.8;

      // Time is initially zero, also set some random variables. It's higher than the total time for the projectile motion
      // because we want the squares to go off screen.
      var t = 0;

      // Total falling time.
      var totalt = 15;
      var z, nx, ny;

      // The direction can either be left (1), right (-1) or center (0). This is the horizontal direction.
      var negate = [1, -1, 0],
        direction = negate[Math.floor(Math.random() * negate.length)];

      // Some random numbers for altering the shapes position
      var randDeg = _self.rand(-5, 10),
        randScale = _self.rand(0.9, 1.1),
        randDeg2 = _self.rand(30, 5);

      // box shadows will not work on individual clipped divs at all.
      // we're altering the background colour slightly manually,
      // in order to give the divs differentiation when they are
      // hovering around in the air.
      var color = getComputedStyle(el, null).backgroundColor.split('rgb(')[1].split(')')[0].split(', ');
      // You might want to alter these manually if you change the color.
      var  colorR = _self.rand(-20, 20),

      // To get the right consistency.
        colorGB = _self.rand(-20, 20),

      // Build color.
        newColor = 'rgb(' + (parseFloat(color[0]) + colorR) + ', ' + (parseFloat(color[1]) + colorGB) + ', ' + (parseFloat(color[2]) + colorGB) + ')';

      // And apply those.
      el.style.backgroundColor = newColor;
      el.style.transform = 'scale(' + randScale + ') skew(' + randDeg + 'deg) rotateZ(' + randDeg2 + 'deg)';

      // Set an interval
      z = setInterval(function() {

        // Horizontal speed is constant (no wind resistance on the internet)
        var ux = (Math.cos(theta) * v) * direction;

        // Vertical speed decreases as time increases before reaching 0 at its peak
        var uy = (Math.sin(theta) * v) - ((-g) * t);

        // The horizontal position
        nx = (ux * t);

        // s = ut + 0.5at^2
        ny = (uy * t) + (0.5 * (g) * Math.pow(t, 2));

        // Apply the positions
        el.style.bottom = (ny) + 'px';
        el.style.left =  (nx) + 'px';

        // Increase the time by 0.10
        t = t + 0.30;

        // If the time is greater than the total time clear the interval
        if (t > totalt) {

          // Finally clear the interval
          clearInterval(z);
        }
      }, 30); // Run this interval every 10ms. Changing this will change the pace of the animation
    });
  }
};

