import ClassProto, { extendClass, createClass } from 'mojs-util-class-proto';
import parseStaggerProperty from 'mojs-util-parse-stagger-property';
import mojsEasing from 'mojs-easing';

import { tweenDefaults } from './tween-defaults.babel.js';
import { tweener } from './tweener.babel.js';

/* ------------------ */
/* The `Tween` class  */
/* ------------------ */

const TweenClass = extendClass(ClassProto);

/**
 * _declareDefaults - function to declare `_defaults` object.
 *
 * @private
 * @override ClassProto
 */
TweenClass._declareDefaults = function () {
  // object spread does not work with Karma
  this._defaults = Object.assign({}, tweenDefaults);
};

/* ---------------------- */
/* The `Public` functions */
/* ---------------------- */

/**
 * play - function to `play` the tween.
 *
 * @public
 * @returns {Object} This tween.
 */
TweenClass.play = function () {
  if (this._state === 'play') {
    return this;
  }

  this._setState('play');
  this._setupPlay();

  this._playTime = performance.now();
  this._speed = this._props.speed;

  return this;
};

/**
 * pause - function to `pause` the tween.
 *
 * @public
 * @returns {Object} This tween.
 */
TweenClass.pause = function () {
  if (this._state === 'pause' || this._state === 'stop') { return this; }

  tweener.remove(this);
  this._setState('pause');
  // reset speed variable to `1` because speed should not be applied
  // when setProgress is used
  this._speed = 1;

  return this;
};

/*
 * stop - function to stop the tween.
 *
 * @public
 * @param {Number} Progress to stop with in [0...1]
 * @returns {Object} This tween.
 */
TweenClass.stop = function (progress) {
  if (this._state === 'stop') { return this; }
  const newProgress = (this._props.isReverse === true) ? 1 : 0;

  const stopProc = (progress !== undefined)
    ? progress
    /* if no progress passed - set 1 if tween
       is playingBackward, otherwise set to 0 */
    : newProgress;

  this.setProgress(stopProc);
  this.reset();

  return this;
};

/**
 * play - function to `replay`(`retart`) the tween.
 *
 * @public
 * @param {Number} Repeat count.
 * @returns {Object} This tween.
 */
TweenClass.replay = function (repeat) {
  this.reset();
  this.play(repeat);

  return this;
};

/**
 * setSpeed - function to set speed.
 *
 * @public
 * @param {Number} Speed in [0..∞]
 * @return {Object} This tween.
 */
TweenClass.setSpeed = function (speed) {
  this._props.speed = speed;

  if (this._state === 'play') {
    this.setStartTime();
    this._speed = speed;
    this._playTime = performance.now();
  }

  return this;
};

/**
 * reverse - function to `reverse` the tween.
 *
 * @public
 * @returns {Object} This tween.
 */
TweenClass.reverse = function () {
  this._props.isReverse = !this._props.isReverse;
  // reverse callbacks in the `_cbs`
  this._reverseCallbacks();

  if (this._elapsed > 0) {
    const { delay } = this._props;
    this._elapsed = (this._end - this._spot) - (this._elapsed - delay);
  }

  this.setStartTime();

  return this;
};

/**
 * setProgress - function to set tween progress.
 *
 * @public
 * @param {Number} Progress to set.
 * @return {Object} This tween.
 */
TweenClass.setProgress = function (progress = 0) {
  if (this._start === undefined) {
    this.setStartTime();
  }

  const time = (progress === 1)
    ? this._end : this._spot + (progress * (this._end - this._spot));

  // set initial time
  if (this._prevTime === undefined) {
    this._prevTime = this._start;
  }
  // save speed before updating form `setProgress`
  const speed = this._speed;
  this._speed = 1;
  // update with current time
  this.update(time);
  // restore speed after updating form `setProgress`
  this._speed = speed;

  return this;
};

/**
 * reset - function to reset the `Tween`.
 */
TweenClass.reset = function () {
  tweener.remove(this);
  this._isActive = false;
  this._elapsed = 0;
  this._repeatCount = 0;
  this._setState('stop');
  delete this._prevTime;

  return this;
};

/* ----------------------- */
/* The `Private` functions */
/* ----------------------- */

/**
 * _setupPlay - function to setup before `play`.
 *
 * @public
 * @returns {Object} This tween.
 */
TweenClass._setupPlay = function () {
  this.setStartTime();
  tweener.add(this);
};

/**
 * _vars - function do declare `variables` after `_defaults` were extended
 *         by `options` and saved to `_props`
 *
 * @return {type}  description
 */
TweenClass._vars = function () {
  const {
    isReverse,
    onStart,
    onComplete,
    onChimeIn,
    onChimeOut,
    delay,
    duration,
  } = this._props;
  // if tween is in active period
  this._isActive = false;
  // time progress
  this._elapsed = 0;
  // initial state
  this._state = 'stop';
  // set "id" speed
  this._speed = 1;
  this._time = delay + duration;
  // how many times we have been repeating
  this._repeatCount = 0;
  // callbacks array - used to flip the callbacks order on `isReverse`
  this._cbs = [onStart, onComplete, 0, 1];
  // chime callbacks
  this._chCbs = [onChimeIn, onChimeOut];
  // if `isReverse` - flip the callbacks
  if (isReverse === true) {
    this._reverseCallbacks();
  }
};

/**
 * setStartTime - function to set `startTime`
 *
 * @param {Number, Undefined} Start time to set.
 */
TweenClass.setStartTime = function (startTime = performance.now()) {
  const { delay, duration, shiftTime } = this._props;

  // if `elapsed` is greated that end bound -> reset it to `0`
  if (this._elapsed >= (this._end - this._spot)) {
    this._elapsed = 0;
  }
  // `_spot` - is the animation initialization spot
  // `_elapsed` is how much time elapsed in the `active` period,
  // needed for `play`/`pause` functionality
  this._spot = (startTime - this._elapsed) + shiftTime;
  // play time is needed to recalculate time regarding `speed`
  this._playTime = this._spot;
  // `_start` - is the active animation start time bound
  this._start = this._spot + delay;
  // `_end` - is the active animation end time bound
  this._end = this._start + duration;
};

/**
 * update - function to update `Tween` with current time.
 *
 * @param {Number} The current update time.
 */
TweenClass.update = function (time) {
  const { onUpdate, isReverse, easing, backwardEasing } = this._props;

  // `t` - `time` regarding `speed`
  const t = this._playTime + (this._speed * (time - this._playTime));
  // save elapsed time
  this._elapsed = t - this._spot;
  // if pregress is not right - call the `onRefresh` function #before
  if (t < this._start && this._progress !== this._cbs[2]) {
    this._props.onRefresh(false, this.index, t);
    this._progress = this._cbs[2];
  }
  // if pregress is not right - call the `onRefresh` function #after
  if (t > this._end && this._progress !== this._cbs[3]) {
    this._props.onRefresh(true, this.index, t);
    this._progress = this._cbs[3];
  }

  // if forward progress
  const isForward = t > this._prevTime;
  const ease = (isForward !== isReverse) ? easing : backwardEasing;

  if (t >= this._start && t <= this._end && this._prevTime !== undefined) {
    let isActive;
    const p = (t - this._start) / this._props.duration;
    this._progress = isReverse === false ? p : 1 - p;
    onUpdate(ease(this._progress), this._progress, isForward, t);

    if (t > this._start && this._isActive === false && isForward === true) {
      // `onStart`
      this._cbs[0](isForward, isReverse, this.index);
      // `onChimeIn`
      this._chCbs[0](isForward, isReverse, this.index, t);
    }

    if (t === this._start) {
      // `onStart`
      this._cbs[0](isForward, isReverse, this.index);
      // `onChimeIn`
      this._chCbs[0](isForward, isReverse, this.index, t);
      // set `isActive` to `true` for forward direction
      // but set it to `false` for backward
      isActive = isForward;
    }

    if (t < this._end && this._isActive === false && isForward === false) {
      // `onComplete`
      this._cbs[1](false, isReverse, this.index);
      // `onChimeOut`
      this._chCbs[1](isForward, isReverse, this.index, t);
    }

    if (t === this._end) {
      // `onComplete`
      this._cbs[1](isForward, isReverse, this.index);
      // `onChimeOut`
      this._chCbs[1](isForward, isReverse, this.index, t);
      // set `isActive` to `false` for forward direction
      // but set it to `true` for backward
      isActive = !isForward;
    }

    this._isActive = (isActive === undefined) ? true : isActive;

    this._prevTime = t;

    return !this._isActive;
  }

  if (t > this._end && this._isActive === true) {
    this._progress = this._cbs[3];
    // one
    onUpdate(ease(this._progress), this._progress, isForward, t);
    // `onComplete`
    this._cbs[1](isForward, isReverse, this.index);
    // `onChimeOut`
    this._chCbs[1](isForward, isReverse, this.index, t);
    this._isActive = false;
    this._prevTime = t;
    return true;
  }

  if (t < this._start && this._isActive === true) {
    this._progress = this._cbs[2];
    // zero
    onUpdate(ease(this._progress), this._progress, isForward, t);
    // `onStart`
    this._cbs[0](isForward, isReverse, this.index);
    // `onChimeIn`
    this._chCbs[0](isForward, isReverse, this.index, t);

    this._isActive = false;
    this._prevTime = t;

    return true;
  }

  this._prevTime = t;
};

/**
 * Function to reverse callbacks.
 */
TweenClass._reverseCallbacks = function () {
  this._cbs = [this._cbs[1], this._cbs[0], this._cbs[3], this._cbs[2]];
};

/*
 * Method set playback `_state` string and call appropriate callbacks.
 *
 * @private
 * @param {String} State name [play, pause, 'stop', 'reverse']
 */
TweenClass._setState = function (state) {
  // save previous state
  this._prevState = this._state;
  this._state = state;
  // callbacks
  const wasPause = this._prevState === 'pause';
  const wasStop = this._prevState === 'stop';
  const wasPlay = this._prevState === 'play';
  const wasReverse = this._prevState === 'reverse';
  const wasPlaying = wasPlay || wasReverse;
  const wasStill = wasStop || wasPause;

  if ((state === 'play' || state === 'reverse') && wasStill) {
    this._props.onPlaybackStart(state, this._prevState);
  }
  if (state === 'pause' && wasPlaying) {
    this._props.onPlaybackPause();
  }
  if (state === 'stop' && (wasPlaying || wasPause)) {
    this._props.onPlaybackStop();
  }
};

/**
 * onTweenerFinish - function that is called when the tweeener finished
 *                   playback for this tween and removemd it from the queue
 *
 */
TweenClass.onTweenerFinish = function () {
  const { isReverse, repeat, isReverseOnRepeat, onPlaybackComplete } = this._props;
  const count = this._repeatCount;

  onPlaybackComplete(!isReverse, count, repeat - count);

  this.reset();

  if (repeat - count > 0) {
    let value = isReverseOnRepeat;
    // if `value` is `array`, parse it
    value = (isReverseOnRepeat instanceof Array) ? value[count % value.length] : value;
    // if `value` is `function`, parse it
    if (typeof value === 'function') { value = value(count); }
    if (value) {
      this.reverse();
    }

    this._repeatCount = count + 1;
    this.play();
  }
};

/**
 * _extendDefaults - Method to copy `_o` options to `_props` object
 *                  with fallback to `_defaults`.
 * @private
 * @overrides @ ClassProto
 */
TweenClass._extendDefaults = function () {
  // super call
  ClassProto.__mojsClass._extendDefaults.call(this);
  // parse stagger
  const propsKeys = Object.keys(this._props);
  for (let i = 0; i < propsKeys.length; i++) {
    const key = propsKeys[i];
    this._props[key] = parseStaggerProperty(this._props[key], this.index);
  }

  // parse `easing`
  this._props.easing = mojsEasing.parseEasing(this._props.easing);
  // parse `backwardEasing`, fallback to `easing` if
  // `backwardEasing` is `null`/`undefined`
  const { easing, backwardEasing } = this._props;
  this._props.backwardEasing = (backwardEasing != null)
                                ? mojsEasing.parseEasing(backwardEasing) : easing;
};

/**
 * Imitate `class` with wrapper
 */
export const Tween = createClass(TweenClass);

export default Tween;
