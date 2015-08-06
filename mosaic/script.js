(function($) {
  var emptyState = [3, 3];
  var redState = [0, 0];
  var timerOn = false;
  var start = 0.00;
  var steps = 0;

  function Timer(el, tick) {
    var t = setTimeout(function() {
      $(el).text((start += 0.01).toFixed(2));
      if (timerOn) {
        Timer(el, tick);
      }
      else {
        timerOn = false;
        clearTimeout(t);
      }
    }, tick);
  }

  function Blue(selector) {
    $(selector).addClass('blue');
  }

  function Red() {
    var redCel =  '.r' + redState[0] + ' .d' + redState[1];
    $(redCel).find('div').addClass('red');

  }

  Red();

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if ((i !== 0 || j !== 0) && (i !== 3 || j !== 3)) {
        var el = '.r' + i + ' .d' + j + ' div';
        Blue(el);
      }
    }
  }

  $(document).on('click', 'td', function() {
    var _self = this;
    $('#steps').text(++steps);
    if (!timerOn) {
      Timer('#timer', 1000);
      timerOn = true;
    }
    var r = parseInt($(_self).parent('tr').attr('class').replace('r', ''));
    var d = parseInt($(_self).attr('class').replace('d', ''));
    var c = $(_self).find('div').css('backgroundColor');

    // Is empty trap;
    if (r === emptyState[0] && d === emptyState[1]) {
      return;
    }

    // Move blue.
    function blueMover() {
      var emptyEl = $('.r' + emptyState[0] + ' .d' + emptyState[1]);
      emptyEl.find('div').addClass('blue');

      $(_self).find('div').removeClass();
      emptyState = [r, d];
    }

    // Move red.
    function redMover() {
      var emptyEl = $('.r' + emptyState[0] + ' .d' + emptyState[1]);
      emptyEl.find('div').addClass('red');
      if (emptyState[0] === 3 && emptyState[1] === 3) {
        emptyEl.addClass('clipped-box');
        timerOn = false;

        setTimeout(function() {
          var Explode = new explode();
          Explode.boom();
          emptyEl.find('.red').hide();
          $(document).off()
        }, 1000);
      }

      $(_self).find('div').removeClass();
      var newEmpty = [redState[0], redState[1]];
      redState = [emptyState[0], emptyState[1]];
      emptyState = newEmpty;
    }

    // Is red trap;
    if (r === redState[0] && d === redState[1]) {
      // Empty on top or bottom.
      if (((redState[0] + 1 === emptyState[0] || redState[0] - 1 === emptyState[0]) && redState[1] === emptyState[1])) {
        redMover();
      }

      // Empty on left or right.
      if ((redState[0] === emptyState[0] && (redState[1] + 1 === emptyState[1] || redState[1] - 1 === emptyState[1]))) {
        redMover();
      }
    }

    else {
      // Empty on top or bottom.
      if ((r + 1 === emptyState[0] || r - 1 === emptyState[0]) && d === emptyState[1]) {
        blueMover();
      }

      // Empty on left or right.
      if (r === emptyState[0] && (d + 1 === emptyState[1] || d - 1 === emptyState[1])) {
        blueMover();
      }
    }
  });
})(jQuery);