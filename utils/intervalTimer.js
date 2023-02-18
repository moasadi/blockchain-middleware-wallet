module.exports.intervalTimer= function IntervalTimer(callback, interval) {
  var timerId;

  this.pause = function () {
      clearInterval(timerId);
  };

  this.resume = function () {
    timerId = setInterval(callback, interval);
  };

  timerId = setInterval(callback, interval);
}