(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.framesGetter = framesGetter;
exports.makeFrames = makeFrames;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function framesGetter(name, frameWidth) {
  var frames = undefined;

  return function () {
    if (!frames) frames = makeFrames(PIXI.loader.resources[name].texture.baseTexture, frameWidth);
    return frames;
  };
}

function makeFrames(baseTexture, frameWidth) {
  var out = [];
  for (var x = 0; x < baseTexture.width; x += frameWidth) {
    out.push(new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, 0, frameWidth, baseTexture.height)));
  }
  return out;
}

var Animator = (function (_PIXI$Container) {
  _inherits(Animator, _PIXI$Container);

  function Animator(frames) {
    _classCallCheck(this, Animator);

    _get(Object.getPrototypeOf(Animator.prototype), "constructor", this).call(this);
    this.anims = {};
    this.frames = frames;
    this.currentAnim = undefined;
    this._tint = 0xFFFFFF;
  }

  _createClass(Animator, [{
    key: "addAnim",
    value: function addAnim(name, frames, fps, loop) {
      var _this = this;

      if (frames.length === 1 || !fps) {
        this.anims[name] = new PIXI.Sprite(this.frames[frames[0]]);
      } else {
        var out = this.anims[name] = new PIXI.extras.MovieClip(frames.map(function (x) {
          return _this.frames[x];
        }));
        out.animationSpeed = fps * 0.001 / PIXI.TARGET_FPMS;
        out.loop = loop === undefined ? true : loop;
      }
      return this;
    }
  }, {
    key: "playAnim",
    value: function playAnim(name, restart, firstFrame) {
      if (name === this.currentAnim && !restart) return;

      firstFrame = firstFrame || 0;

      if (name === undefined) {
        this.removeChildren();
      } else if (name === this.currentAnim) {
        if (this.children[0].gotoAndPlay) this.children[0].gotoAndPlay(firstFrame);
      } else {
        var anim = this.anims[name];
        anim.tint = this._tint;
        if (anim.gotoAndPlay) {
          anim.gotoAndPlay(firstFrame);
          anim.update(0);
        }
        this.removeChildren();
        this.addChild(anim);
      }
      this.currentAnim = name;
    }
  }, {
    key: "tint",
    get: function get() {
      return this._tint;
    },
    set: function set(tint) {
      this._tint = tint;
      if (this.children.length) this.children[0].tint = tint;
    }
  }]);

  return Animator;
})(PIXI.Container);

exports["default"] = Animator;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = (function () {
  function Entity(graphic, hitbox) {
    _classCallCheck(this, Entity);

    this.graphic = graphic;
    this.hitbox = hitbox || null;
    this.types = [];
    this.state = undefined;
    this.layer = 0;
    this.shake = 0;
    this.topCollider = false;
  }

  _createClass(Entity, [{
    key: "update",
    value: function update(deltaTime, totalTime) {}
  }, {
    key: "added",
    value: function added(state) {
      this.state = state;
    }
  }, {
    key: "removed",
    value: function removed(state) {}
  }, {
    key: "collidesWith",
    value: function collidesWith(other, x, y) {
      if (!this.hitbox || !other.hitbox) return false;
      if (x === undefined) x = this.x;
      if (y === undefined) y = this.y;
      x += this.hitbox.x - other.hitbox.x - other.x;
      y += this.hitbox.y - other.hitbox.y - other.y;
      return this.hitbox && other.hitbox && x < other.hitbox.width && x > -this.hitbox.width && y < other.hitbox.height && y > -this.hitbox.height;
    }
  }, {
    key: "collide",
    value: function collide(types, ents, x, y) {
      ents = ents || this.state.entities;
      for (var i = 0, len = ents.length; i < len; ++i) {
        var ent = ents[i];
        if (ent !== this && ent.types.some(function (t) {
          return types.indexOf(t) >= 0;
        }) && this.collidesWith(ent, x, y)) return ent;
      }
    }
  }, {
    key: "collisions",
    value: function collisions(types, ents, x, y) {
      var _this = this;

      ents = ents || this.state.entities;
      return ents.filter(function (ent) {
        return ent !== _this && ent.types.some(function (t) {
          return types.indexOf(t) >= 0;
        }) && _this.collidesWith(ent, x, y);
      });
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y, types, sweep, cbx, cby) {
      return this.moveBy(x - this.x, y - this.y, types, sweep, cbx, cby);
    }
  }, {
    key: "moveBy",
    value: function moveBy(x, y, types, sweep, cbx, cby) {
      if (x === 0 && y === 0) return !this.collide(types);

      cby = cby || cbx;

      var ox = this.x,
          oy = this.y;
      var fx = ox + x,
          fy = oy + y;
      if (sweep) {
        if (y > 0) {
          for (var i = 0; i < y && !this.collide(types); ++i) {
            ++this.y;
          }--this.y;
        } else {
          for (var i = 0; i < -y && !this.collide(types); ++i) {
            --this.y;
          }++this.y;
        }
        if (x > 0) for (var i = 0; i < x && !this.collide(types); ++i) {
          ++this.x;
        } else for (var i = 0; i < -x && !this.collide(types); ++i) {
          --this.x;
        }if (y > 0) ++this.y;else --this.y;
        if (Math.abs(fx - this.x) < 1) this.x = fx;
        if (Math.abs(fy - this.y) < 1) this.y = fy;
        if (this.x === fx && this.y === fy && !this.collide(types)) return true;
      } else {
        this.x += x;this.y += y;
      }

      var collided = undefined;
      do {
        collided = false;
        var collisions = this.collisions(types);
        var len = collisions.length;
        if (y > 0) for (var i = 0; i < len; ++i) {
          var ent = collisions[i];
          var ny = ent.y + ent.hitbox.y - this.hitbox.height - this.hitbox.y;
          if (ny >= oy && ny < this.y && (!cby || cby(ent))) {
            this.y = ny;
            collided = true;
          }
        } else if (y < 0) for (var i = 0; i < len; ++i) {
          var ent = collisions[i];
          var ny = ent.y + ent.hitbox.y + ent.hitbox.height - this.hitbox.y;
          if (ny <= oy && ny > this.y && (!cby || cby(ent))) {
            this.y = ny;
            collided = true;
          }
        }

        collisions = this.collisions(types);
        len = collisions.length;
        if (x > 0) for (var i = 0; i < len; ++i) {
          var ent = collisions[i];
          var nx = ent.x - ent.hitbox.x - this.hitbox.width - this.hitbox.x;
          if (nx >= ox && nx < this.x && (!cbx || cbx(ent))) {
            this.x = nx;
            collided = true;
          }
        } else if (x < 0) for (var i = 0; i < len; ++i) {
          var ent = collisions[i];
          var nx = ent.x + ent.hitbox.x + ent.hitbox.width - this.hitbox.x;
          if (nx <= ox && nx > this.x && (!cbx || cbx(ent))) {
            this.x = nx;
            collided = true;
          }
        }
      } while (collided);

      return this.x === fx && this.y === fy;
    }
  }, {
    key: "x",
    get: function get() {
      return this.graphic.x;
    },
    set: function set(x) {
      this.graphic.x = x;
    }
  }, {
    key: "y",
    get: function get() {
      return this.graphic.y;
    },
    set: function set(y) {
      this.graphic.y = y;
    }
  }, {
    key: "layer",
    get: function get() {
      return this._layer;
    },
    set: function set(x) {
      if (x === this._layer) return;
      this._layer = x;
      if (this.state) this.state.reshuffle(this);
    }
  }]);

  return Entity;
})();

exports["default"] = Entity;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.friction = friction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EntityJs = require('./Entity.js');

var _EntityJs2 = _interopRequireDefault(_EntityJs);

function friction(x, f) {
  if (x > 0) {
    if (x > f) return x - f;else return 0;
  } else {
    if (-x > f) return x + f;else return 0;
  }
}

var PhysBasic = (function (_Entity) {
  _inherits(PhysBasic, _Entity);

  function PhysBasic(x, y, graphic, hitbox) {
    _classCallCheck(this, PhysBasic);

    _get(Object.getPrototypeOf(PhysBasic.prototype), 'constructor', this).call(this, graphic, hitbox);
    this.x = x;
    this.y = y;
    this.velocity = new PIXI.Point(0, 0);
    this.acceleration = new PIXI.Point(0, 0);
    this.friction = new PIXI.Point(0, 0);
    this.maxVelocity = new PIXI.Point(0, 0);
    this.collideTypes = [];
  }

  _createClass(PhysBasic, [{
    key: 'moveCollideX',
    value: function moveCollideX(ent, dx, dy) {
      if (ent.topCollider) return false;
      this.velocity.x = 0;
      return true;
    }
  }, {
    key: 'moveCollideY',
    value: function moveCollideY(ent, dy, dx) {
      if (ent.topCollider && dy < 0) return false;
      this.velocity.y = 0;
      return true;
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var _this = this;

      _get(Object.getPrototypeOf(PhysBasic.prototype), 'update', this).call(this, deltaTime, totalTime);
      this.velocity.x = friction(this.velocity.x + this.acceleration.x * deltaTime, this.friction.x * deltaTime);
      this.velocity.y = friction(this.velocity.y + this.acceleration.y * deltaTime, this.friction.y * deltaTime);
      if (this.maxVelocity.x && Math.abs(this.velocity.x) > this.maxVelocity.x) this.velocity.x = this.velocity.x > 0 ? this.maxVelocity.x : -this.maxVelocity.x;
      if (this.maxVelocity.y && Math.abs(this.velocity.y) > this.maxVelocity.y) this.velocity.y = this.velocity.y > 0 ? this.maxVelocity.y : -this.maxVelocity.y;
      var dx = this.velocity.x * deltaTime,
          dy = this.velocity.y * deltaTime;
      if (dx !== 0 || dy !== 0) this.moveBy(dx, dy, this.collideTypes, false, function (ents) {
        return _this.moveCollideX(ents, dx, dy);
      }, function (ents) {
        return _this.moveCollideY(ents, dy, dx);
      });
    }
  }, {
    key: 'collideD',
    value: function collideD(ents, x, y) {
      return this.collide(this.collideTypes, ents, x, y);
    }
  }, {
    key: 'collisionsD',
    value: function collisionsD(ents, x, y) {
      return this.collisions(this.collideTypes, ents, x, y);
    }
  }, {
    key: 'moveToD',
    value: function moveToD(x, y, sweep, cbx, cby) {
      return this.moveTo(x, y, this.collideTypes, sweep, cbx, cby);
    }
  }, {
    key: 'moveByD',
    value: function moveByD(x, y, sweep, cbx, cby) {
      return this.moveBy(x, y, this.collideTypes, sweep, cbx, cby);
    }
  }]);

  return PhysBasic;
})(_EntityJs2['default']);

exports['default'] = PhysBasic;

},{"./Entity.js":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = (function () {
  function State(backgroundColor, stage) {
    _classCallCheck(this, State);

    this.stage = stage || new PIXI.Container();
    this.backgroundColor = backgroundColor === undefined ? 0x000000 : backgroundColor;
    this.entities = [];
    this.toAdd = [];
    this.toRemove = [];
    this.toReshuffle = [];
  }

  _createClass(State, [{
    key: "update",
    value: function update(deltaTime, totalTime) {
      var _this = this;

      this.entities.forEach(function (ent) {
        return ent.update(deltaTime, totalTime);
      });
      this.toRemove.forEach(function (ent) {
        return _this._remove(ent);
      });
      this.toReshuffle.forEach(function (ent) {
        return _this._reshuffle(ent);
      });
      this.toAdd.forEach(function (ent) {
        return _this._add(ent);
      });
      this.toRemove.length = this.toReshuffle.length = this.toAdd.length = 0;
    }
  }, {
    key: "begin",
    value: function begin() {}
  }, {
    key: "end",
    value: function end() {}
  }, {
    key: "add",
    value: function add(ent) {
      this.toAdd.push(ent);
    }
  }, {
    key: "_add",
    value: function _add(ent, inform) {
      if (ent.state) ent.state._remove(ent, inform);

      var ind = this.entities.length - 1;
      for (; ind >= 0; --ind) {
        if (this.entities[ind].layer <= ent.layer) break;
      }

      this.entities.splice(ind + 1, 0, ent);
      this.stage.addChildAt(ent.graphic, ind + 1);

      if (inform === undefined || inform) ent.added(this);
    }
  }, {
    key: "remove",
    value: function remove(ent) {
      this.toRemove.push(ent);
    }
  }, {
    key: "_remove",
    value: function _remove(ent, inform) {
      this.stage.removeChild(ent.graphic);
      var pos = this.entities.indexOf(ent);
      if (pos >= 0) this.entities.splice(pos, 1);

      if (inform === undefined || inform) ent.removed(this);
    }
  }, {
    key: "reshuffle",
    value: function reshuffle(ent) {
      this.toReshuffle.push(ent);
    }
  }, {
    key: "_reshuffle",
    value: function _reshuffle(ent) {
      this._add(ent, false);
    }
  }]);

  return State;
})();

exports["default"] = State;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CharacterJs = require('./Character.js');

var _constantsJs = require('./constants.js');

var _GunJs = require('./Gun.js');

var _inputJs = require('../input.js');

var AIState = (function () {
  function AIState() {
    _classCallCheck(this, AIState);
  }

  _createClass(AIState, [{
    key: 'moveCollideX',
    value: function moveCollideX(ent, dx, dy) {
      return true;
    }
  }, {
    key: 'moveCollideY',
    value: function moveCollideY(ent, dy, dx) {
      return true;
    }
  }, {
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {}
  }, {
    key: 'updatePhysics',
    value: function updatePhysics(deltaTime, totalTime) {}
  }, {
    key: 'updateShake',
    value: function updateShake(deltaTime, totalTime) {}
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {}
  }, {
    key: 'begin',
    value: function begin(char) {
      this.char = char;
    }
  }, {
    key: 'end',
    value: function end() {
      this.char = undefined;
    }
  }]);

  return AIState;
})();

exports['default'] = AIState;

var DummyState = (function (_AIState) {
  _inherits(DummyState, _AIState);

  function DummyState() {
    _classCallCheck(this, DummyState);

    _get(Object.getPrototypeOf(DummyState.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DummyState, [{
    key: 'update',
    value: function update() {
      return true;
    }
  }]);

  return DummyState;
})(AIState);

exports.DummyState = DummyState;

var PlayerState = (function (_AIState2) {
  _inherits(PlayerState, _AIState2);

  function PlayerState() {
    _classCallCheck(this, PlayerState);

    _get(Object.getPrototypeOf(PlayerState.prototype), 'constructor', this).call(this);
    this.canCling = true;
    this.doEnd = true;
    this.spacebar = true;
  }

  _createClass(PlayerState, [{
    key: 'moveCollideX',
    value: function moveCollideX(ent, dx, dy) {
      if (this.char.smash && ent.types.indexOf('edge') < 0) this.char.intState = new ClimbState(this);else if (!this.char.collideDown && this.canCling) this.char.intState = new WallClingState(this, dx > 0 ? -1 : 1);
      return true;
    }
  }, {
    key: 'moveCollideY',
    value: function moveCollideY(ent, dy, dx) {
      if (dy > 0) this.canCling = true;
      return true;
    }
  }, {
    key: 'updateGun',
    value: function updateGun(deltaTime, totalTime) {
      if (this.char && this.char.gun) {
        var mouse = (0, _inputJs.getMouse)();
        this.char.aimAt(mouse.x, mouse.y);
      }
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char;

      if (_inputJs.keys.up && char.collideD(undefined, char.x, char.y + 1)) char.jump();

      if (_inputJs.keys.left) char.moveDir = _CharacterJs.direction.left;else if (_inputJs.keys.right) char.moveDir = _CharacterJs.direction.right;else char.moveDir = _CharacterJs.direction.halt;

      if (char.smash && char.moveDir !== _CharacterJs.direction.halt && char.moveDir !== char.graphic.scale.x) this.switchOut(new TurnState(this, char.moveDir));

      if (_inputJs.keys.action1 && !this.spacebar) {
        var coll = char.collide(['human', 'alien']);
        if (coll) {
          char.intState = new AIState();
          char.hp = 0;
          coll.intState = new PlayerState();
          coll.state.player = coll;
          coll.state.entities.forEach(function (e) {
            if (e.hitTypes) while (true) {
              var i = e.hitTypes.indexOf('player');
              if (i < 0) break;
              e.hitTypes.splice(i, 1);
            }
          });
        }
      }
      this.spacebar = _inputJs.keys.action1;
      this.updateGun(deltaTime, totalTime);
      char.firing = _inputJs.keys.mouse;
      if (char.smash && _inputJs.keys.mouse) this.switchOut(new SmashState(this));
    }
  }, {
    key: 'switchOut',
    value: function switchOut(other) {
      if (!this.char) return;
      this.doEnd = false;
      this.char.intState = other;
      this.doEnd = true;
    }
  }, {
    key: 'begin',
    value: function begin(char) {
      _get(Object.getPrototypeOf(PlayerState.prototype), 'begin', this).call(this, char);
      this.spacebar = true;
      this.defaults = {
        color: char.color,
        layer: char.layer,
        hitTypes: char.hitTypes,
        types: char.types
      };
      char.color = _constantsJs.colors.player;
      char.layer += 4;
      char.hitTypes = ['alien', 'human'];
      char.types = char.types.slice(0);
      char.types.push('player');
      if (!char.smash) while (true) {
        var i = char.collideTypes.indexOf('edge');
        if (i < 0) break;
        char.collideTypes.splice(i, 1);
      }
    }
  }, {
    key: 'end',
    value: function end(char) {
      _get(Object.getPrototypeOf(PlayerState.prototype), 'end', this).call(this, char);
      if (this.doEnd) {
        char.color = this.defaults.color;
        char.layer = this.defaults.layer;
        char.hitTypes = this.defaults.hitTypes;
      }
    }
  }]);

  return PlayerState;
})(AIState);

exports.PlayerState = PlayerState;

var WallClingState = (function (_PlayerState) {
  _inherits(WallClingState, _PlayerState);

  function WallClingState(former, sx) {
    _classCallCheck(this, WallClingState);

    _get(Object.getPrototypeOf(WallClingState.prototype), 'constructor', this).call(this);
    this.former = former;
    this.sx = sx;
    this.lifespan = 0.5;
    this.wDown = false;
  }

  _createClass(WallClingState, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char;
      char.body.playAnim('wallCling');
      var sx = this.sx;
      this.updateGun(deltaTime, totalTime);
      if (sx < 1) {
        if (char.aimDir > 0) char.aimDir = Math.max(char.aimDir, Math.PI * 0.6);else char.aimDir = Math.min(char.aimDir, -Math.PI * 0.6);
      } else {
        char.aimDir = Math.max(Math.min(char.aimDir, Math.PI * 0.4), -Math.PI * 0.4);
      }
      if (_inputJs.keys.up && !this.wDown) {
        char.velocity.x = 250 * this.sx;
        char.velocity.y = -250;
        this.char.intState = this.former;
      }
      this.wDown = _inputJs.keys.up;
      this.lifespan -= deltaTime;
      if (this.lifespan <= 0) {
        this.former.canCling = false;
        this.char.intState = this.former;
      }
      return true;
    }
  }, {
    key: 'begin',
    value: function begin(char) {
      _get(Object.getPrototypeOf(WallClingState.prototype), 'begin', this).call(this, char);
      char.graphic.scale.x = this.sx;
      char.velocity.x = char.velocity.y = char.acceleration.x = 0;
      char.body.playAnim('wallCling');
      this.wDown = _inputJs.keys.up;
    }
  }]);

  return WallClingState;
})(PlayerState);

var SmashState = (function (_AIState3) {
  _inherits(SmashState, _AIState3);

  function SmashState(former) {
    _classCallCheck(this, SmashState);

    _get(Object.getPrototypeOf(SmashState.prototype), 'constructor', this).call(this);
    this.former = former;
    this.smashed = false;
    this.lifeTime = 0;
  }

  _createClass(SmashState, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char;
      this.lifeTime += deltaTime;
      char.graphic.playAnim('smash');
      char.velocity.x = char.velocity.y = char.acceleration.x = 0;
      if (this.lifeTime > 0.25) {
        if (this.smashed) {
          if (this.lifeTime > 1) {
            char.intState = this.former;
          }
        } else {
          this.smashed = true;
          char.smash();
        }
      }
      return true;
    }
  }]);

  return SmashState;
})(AIState);

var TurnState = (function (_AIState4) {
  _inherits(TurnState, _AIState4);

  function TurnState(former, sx) {
    _classCallCheck(this, TurnState);

    _get(Object.getPrototypeOf(TurnState.prototype), 'constructor', this).call(this);
    this.sx = sx;
    this.former = former;
    this.lifeTime = 0;
  }

  _createClass(TurnState, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char;
      this.lifeTime += deltaTime;
      if (this.lifeTime < 2 / 15) {
        char.graphic.scale.x = -this.sx;
        char.graphic.playAnim('turn1');
      } else if (this.lifeTime < 3 / 15) {
        char.graphic.scale.x = this.sx;
        char.graphic.playAnim('turn2');
      } else {
        char.intState = this.former;
      }
      char.velocity.x = char.velocity.y = char.acceleration.x = 0;
      return true;
    }
  }, {
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {
      return true;
    }
  }]);

  return TurnState;
})(AIState);

var ClimbState = (function (_AIState5) {
  _inherits(ClimbState, _AIState5);

  function ClimbState(former) {
    _classCallCheck(this, ClimbState);

    _get(Object.getPrototypeOf(ClimbState.prototype), 'constructor', this).call(this);
    this.former = former;
  }

  _createClass(ClimbState, [{
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {
      var dy = Math.floor((this.y - this.char.y + 48) % 48 / 24) + 1;
      this.char.graphic.playAnim('climb' + dy);
      return true;
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char;
      char.velocity.x = char.velocity.y = char.acceleration.x = 0;
      if (_inputJs.keys.up) char.y -= deltaTime * 80;
      if (_inputJs.keys.down) char.y += deltaTime * 80;
      this.updateAnims();
      var edge = char.collide('edge');
      if (edge) {
        char.x += char.graphic.scale.x * char.hitbox.width;
        char.y = edge.y - 24;
        this.finish(deltaTime, totalTime);
        return false;
      } else if (char.collide('terrain')) {
        char.y = this.y;
        this.finish(deltaTime, totalTime);
        return false;
      } else if (char.graphic.scale.x < 0 ? _inputJs.keys.right : _inputJs.keys.left) {
        char.graphic.scale.x *= -1;
        char.velocity.x = char.graphic.scale.x * char.maxVelocity.x;
        this.finish(deltaTime, totalTime);
        return false;
      }
      return true;
    }
  }, {
    key: 'finish',
    value: function finish(deltaTime, totalTime) {
      var char = this.char;
      char.intState = this.former;
      char.intState.update(deltaTime, totalTime);
    }
  }, {
    key: 'begin',
    value: function begin(char) {
      _get(Object.getPrototypeOf(ClimbState.prototype), 'begin', this).call(this, char);
      this.y = char.y;
    }
  }]);

  return ClimbState;
})(AIState);

function findBadGuy(char) {
  var state = char.state,
      pref = char.preference;
  var badGuys = [];
  char.hitTypes.forEach(function (t) {
    return Array.prototype.push.apply(badGuys, state.witnesses(char.x, char.y, t));
  });
  if (badGuys.length <= 0) return;
  return badGuys[pref % badGuys.length];
}

var SoldierState = (function (_AIState6) {
  _inherits(SoldierState, _AIState6);

  function SoldierState() {
    _classCallCheck(this, SoldierState);

    _get(Object.getPrototypeOf(SoldierState.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SoldierState, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char,
          state = char.state;
      if (!state) return;
      var badGuy = findBadGuy(char);
      if (badGuy) {
        char.aimAt(badGuy.x, badGuy.y);
        char.firing = true;
        if (char.x > badGuy.x) {
          char.moveDir = _CharacterJs.direction.right;
        } else {
          char.moveDir = _CharacterJs.direction.left;
        }
      } else {
        char.moveDir = _CharacterJs.direction.halt;
        char.firing = false;
      }
    }
  }]);

  return SoldierState;
})(AIState);

exports.SoldierState = SoldierState;

var GrumState = (function (_AIState7) {
  _inherits(GrumState, _AIState7);

  function GrumState() {
    _classCallCheck(this, GrumState);

    _get(Object.getPrototypeOf(GrumState.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GrumState, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var char = this.char,
          state = char.state;
      if (!state) return;
      var badGuy = findBadGuy(char);
      if (badGuy) {
        if (char.x > badGuy.x) {
          char.moveDir = _CharacterJs.direction.left;
        } else {
          char.moveDir = _CharacterJs.direction.right;
        }
        if (char.moveDir !== char.graphic.scale.x) char.intState = new TurnState(this, char.moveDir);else if (Math.abs(char.x - badGuy.x) < 16) char.intState = new SmashState(this);
      } else {
        char.moveDir = _CharacterJs.direction.halt;
      }
    }
  }]);

  return GrumState;
})(AIState);

exports.GrumState = GrumState;

},{"../input.js":13,"./Character.js":7,"./Gun.js":9,"./constants.js":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EntityJs = require('../Entity.js');

var _EntityJs2 = _interopRequireDefault(_EntityJs);

var _AnimatorJs = require('../Animator.js');

var _particlesJs = require('../particles.js');

var getBulletFrames = (0, _AnimatorJs.framesGetter)('bullet', 12);

var Bullet = (function (_Entity) {
  _inherits(Bullet, _Entity);

  function Bullet(x, y, voffs, direction, hitTypes, noHit) {
    var _this = this;

    _classCallCheck(this, Bullet);

    _get(Object.getPrototypeOf(Bullet.prototype), 'constructor', this).call(this, new PIXI.Sprite(getBulletFrames()[0]), new PIXI.Rectangle(-1, -1, 2, 2));
    this.x = x;this.y = y;
    this.layer = -8;
    this.graphic.pivot.x = 8;
    this.graphic.pivot.y = 6;
    this.graphic.scale.y = Math.abs(direction) > Math.PI * 0.5 ? -1 : 1;
    this.graphic.rotation = direction;
    var speed = this.speed = 230;
    this.velocity = new PIXI.Point(Math.cos(direction), Math.sin(direction));
    this.x += this.velocity.x * 10;this.y += this.velocity.y * 10;
    this.x -= this.velocity.y * this.graphic.scale.y * voffs;
    this.y += this.velocity.x * this.graphic.scale.y * voffs;
    this.velocity.x *= speed;this.velocity.y *= speed;
    this.hitTypes = hitTypes || [];
    this.noHit = noHit || [];
    this.lifeTime = 0;
    this.canHit = function (ent) {
      return _this.noHit.indexOf(ent) < 0;
    };
  }

  _createClass(Bullet, [{
    key: 'processHits',
    value: function processHits(hits, dx, dy) {
      for (var i = 0, len = hits.length; i < len; ++i) {
        var ent = hits[i];
        if (ent.shot) ent.shot(this, dx, dy);else this.impact(ent, ent.xHit ? dx || 0 : 0, ent.xHit ? 0 : dy || 0);
        return true;
      }
      return false;
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var _this2 = this;

      _get(Object.getPrototypeOf(Bullet.prototype), 'update', this).call(this);

      if (!this.processHits(this.collisions(this.hitTypes).filter(this.canHit))) {
        (function () {
          var maxDist = 2;
          var hits = [];
          var dx = _this2.velocity.x * deltaTime,
              dy = _this2.velocity.y * deltaTime;
          var d = _this2.speed * deltaTime;
          var mx = dx * maxDist / d,
              my = dy * maxDist / d;
          var hitX = function hitX(ent) {
            if (!_this2.canHit(ent)) return false;
            hits.push(ent);
            ent.xHit = true;
            return true;
          };
          var hitY = function hitY(ent) {
            if (!_this2.canHit(ent)) return false;
            hits.push(ent);
            return true;
          };
          var noHit = true;
          while (d >= maxDist && (noHit = _this2.moveBy(mx, my, _this2.hitTypes, false, hitX, hitY))) {
            d -= maxDist;dx -= mx;dy -= my;
          }
          if (noHit) {
            _this2.moveBy(dx, dy, _this2.hitTypes, false, hitX, hitY);
          }

          _this2.processHits(hits, mx, my);
        })();
      }

      this.lifeTime += deltaTime;
      if (this.lifeTime > 1 && this.state) this.state.remove(this);
    }
  }, {
    key: 'impact',
    value: function impact(ent, dx, dy) {
      if (this.state) {
        this.state.remove(this);
        var dir = undefined,
            fx = undefined,
            fy = undefined;
        if (dx < 0) {
          dir = 0;
          fx = 80, fy = 40;
        } else if (dx > 0) {
          dir = Math.PI;
          fx = 80, fy = 40;
        } else if (dy < 0) {
          dir = 0.5 * Math.PI;
          fx = 40, fy = 80;
        } else {
          dir = -0.5 * Math.PI;
          fx = 80, fy = 80;
        }
        var dev = Math.PI * 0.5;
        for (var i = 0, amt = Math.random() * 3; i < amt; ++i) {
          this.state.particles.add((0, _particlesJs.blackDust)(this.x, this.y, fx, fy, dir + Math.random() * dev * 2 - dev, 10));
        }
      }
    }
  }]);

  return Bullet;
})(_EntityJs2['default']);

exports['default'] = Bullet;
module.exports = exports['default'];

},{"../Animator.js":1,"../Entity.js":2,"../particles.js":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _PhysBasicJs = require('../PhysBasic.js');

var _PhysBasicJs2 = _interopRequireDefault(_PhysBasicJs);

var _constantsJs = require('./constants.js');

var _AIStateJs = require('./AIState.js');

var _AIStateJs2 = _interopRequireDefault(_AIStateJs);

var direction = {
  left: -1,
  halt: 0,
  right: 1
};

exports.direction = direction;

var Character = (function (_PhysBasic) {
  _inherits(Character, _PhysBasic);

  function Character(x, y, graphic, hitbox) {
    _classCallCheck(this, Character);

    _get(Object.getPrototypeOf(Character.prototype), 'constructor', this).call(this, x, y, graphic, hitbox);
    this.floatMultiplier = 0.3;
    this.moveDir = direction.halt;
    this.accelSpeed = 2000;
    this.jumpSpeed = 250;
    this.friction.x = 1000;
    this.maxVelocity.x = 160;
    this.acceleration.y = 600;
    this.layer = -32;
    this.color = 0xFFFFFF;
    this.intState = new _AIStateJs2['default']();
    this.collideDown = true;
    this.collideSide = false;
    this.collideTypes = ['terrain', 'edge'];
    this.hp = 3;
    this.preference = Math.floor(Math.random() * 256);
  }

  _createClass(Character, [{
    key: 'moveCollideX',
    value: function moveCollideX(ent, dx, dy) {
      var collided = _get(Object.getPrototypeOf(Character.prototype), 'moveCollideX', this).call(this, ent, dx, dy);
      if (collided && this.intState.moveCollideX(ent, dx, dy)) {
        this.collideSide = true;
      }
      return collided;
    }
  }, {
    key: 'moveCollideY',
    value: function moveCollideY(ent, dy, dx) {
      var collided = _get(Object.getPrototypeOf(Character.prototype), 'moveCollideY', this).call(this, ent, dy, dx);
      if (collided && this.intState.moveCollideY(ent, dy, dx)) {
        if (dy > 0) this.collideDown = true;
      }
      return collided;
    }
  }, {
    key: 'jump',
    value: function jump(force) {
      if (force === undefined) force = 1;
      this.velocity.y = force * -this.jumpSpeed;
    }
  }, {
    key: 'shot',
    value: function shot(bullet, dx, dy) {
      bullet.impact(this, dx, dy);
      --this.hp;
      return true;
    }
  }, {
    key: 'smashed',
    value: function smashed(smasher, sx) {
      this.hp -= 5;
    }
  }, {
    key: 'die',
    value: function die() {
      this._hp = 0;
      if (this.state) this.state.remove(this);
    }
  }, {
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {}
  }, {
    key: 'updateShake',
    value: function updateShake(deltaTime, totalTime) {
      if (this.shake) this.shake *= Math.pow(0.05, deltaTime);
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      if (!this.intState.updateShake(deltaTime, totalTime)) this.updateShake(deltaTime, totalTime);

      if (this.intState.update(deltaTime, totalTime)) return;

      if (!this.intState.updatePhysics(deltaTime, totalTime)) {
        this.acceleration.x = this.moveDir * this.accelSpeed;

        var ax = undefined,
            fx = undefined;
        if (!this.collideDown) {
          ax = this.acceleration.x;fx = this.friction.x;
          this.acceleration.x = ax * this.floatMultiplier;
          this.friction.x = fx * this.floatMultiplier;
        }
        this.collideDown = this.collideSide = false;
        _get(Object.getPrototypeOf(Character.prototype), 'update', this).call(this, deltaTime, totalTime);
        if (ax !== undefined) {
          this.acceleration.x = ax;
          this.friction.x = fx;
        }
      }

      if (!this.intState.updateAnims(deltaTime, totalTime)) this.updateAnims(deltaTime, totalTime);
    }
  }, {
    key: 'color',
    get: function get() {
      return this._color;
    },
    set: function set(x) {
      this._color = x;
    }
  }, {
    key: 'intState',
    get: function get() {
      return this._intState;
    },
    set: function set(x) {
      if (this._intState) this._intState.end(this);
      this._intState = x;
      x.begin(this);
    }
  }, {
    key: 'hp',
    get: function get() {
      return this._hp;
    },
    set: function set(x) {
      this._hp = x;
      if (x <= 0) this.die();
    }
  }]);

  return Character;
})(_PhysBasicJs2['default']);

exports['default'] = Character;

},{"../PhysBasic.js":3,"./AIState.js":5,"./constants.js":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CharacterJs = require('./Character.js');

var _CharacterJs2 = _interopRequireDefault(_CharacterJs);

var _AIStateJs = require('./AIState.js');

var _AnimatorJs = require('../Animator.js');

var _AnimatorJs2 = _interopRequireDefault(_AnimatorJs);

var _constantsJs = require('./constants.js');

var _utilsJs = require('../utils.js');

var getAlienFrames = (0, _AnimatorJs.framesGetter)('alien', 64);

var Grum = (function (_Character) {
  _inherits(Grum, _Character);

  function Grum(x, y) {
    _classCallCheck(this, Grum);

    _get(Object.getPrototypeOf(Grum.prototype), 'constructor', this).call(this, x, y, new _AnimatorJs2['default'](getAlienFrames()), new PIXI.Rectangle(20 - 32, 9 - 24, 24, 39));

    this.accelSpeed = 500;
    this.jumpSpeed = 0;
    this.friction.x = 300;
    this.maxVelocity.x = 80;
    this.layer = -48;
    this.color = _constantsJs.colors.alien;
    this.hp = 10;
    this.collideTypes.push('edge');

    this.graphic.pivot.x = 32;
    this.graphic.pivot.y = 24;
    this.graphic.addAnim('idle', [0]);
    this.graphic.addAnim('run', [1, 0], 3);
    this.graphic.addAnim('smash', [4, 5], 4, false);
    this.graphic.addAnim('turn1', [2, 3], 15, false);
    this.graphic.addAnim('turn2', [2, 0], 15, false);
    this.graphic.addAnim('dead', [6]);
    this.graphic.addAnim('climb1', [8]);
    this.graphic.addAnim('climb2', [7]);
    this.graphic.playAnim('idle');
    this.types = ['alien'];
    this.hitTypes = ['human'];
    var sb = this.smashBox = new PIXI.Rectangle(14 - 32, 38 - 24, 47, 10);
    this.smashBoxL = new PIXI.Rectangle(-sb.x - sb.width, sb.y, sb.width, sb.height);
    this.intState = new _AIStateJs.GrumState();
  }

  _createClass(Grum, [{
    key: 'moveCollideX',
    value: function moveCollideX(ent, dx, dy) {
      var out = _get(Object.getPrototypeOf(Grum.prototype), 'moveCollideX', this).call(this, ent, dx, dy);
      if (out) {}
      return out;
    }
  }, {
    key: 'jump',
    value: function jump(force) {}
  }, {
    key: 'die',
    value: function die() {
      this.graphic.playAnim('dead');
      this.intState = new _AIStateJs.DummyState();
      this.shake += 2;
      (0, _utilsJs.sound)('smash');
    }
  }, {
    key: 'smashed',
    value: function smashed(smasher, sx) {
      _get(Object.getPrototypeOf(Grum.prototype), 'smashed', this).call(this, smasher, sx);
      this.state.witnesses(this.x, this.y, 'alien').forEach(function (h) {
        return h.hitTypes.push('player');
      });
    }
  }, {
    key: 'smash',
    value: function smash() {
      var _this = this;

      var hb = this.hitbox;
      this.hitbox = this.graphic.scale.x > 0 ? this.smashBox : this.smashBoxL;
      var unlucky = this.collisions(this.hitTypes);
      this.hitbox = hb;
      unlucky.forEach(function (ent) {
        if (ent !== _this && ent.smashed) ent.smashed(_this, _this.graphic.scale.x);
      });
      this.shake += 1;
      (0, _utilsJs.sound)('smash', 2);
    }
  }, {
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {
      if (this.moveDir === _CharacterJs.direction.halt || this.collideSide) {
        this.graphic.playAnim('idle');
      } else {
        this.graphic.playAnim('run');
        this.graphic.scale.x = this.moveDir > 0 ? 1 : -1;
      }
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      if (this.hp <= 0) {
        this.graphic.playAnim('dead');
        this.hitbox = null;
        if (this.types.length) this.types = [];
      }
      _get(Object.getPrototypeOf(Grum.prototype), 'update', this).call(this, deltaTime, totalTime);
    }
  }, {
    key: 'color',
    get: function get() {
      return this._color;
    },
    set: function set(x) {
      this._color = x;
      this.graphic.tint = x;
    }
  }]);

  return Grum;
})(_CharacterJs2['default']);

exports['default'] = Grum;
module.exports = exports['default'];

},{"../Animator.js":1,"../utils.js":16,"./AIState.js":5,"./Character.js":7,"./constants.js":12}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AnimatorJs = require('../Animator.js');

var _BulletJs = require('./Bullet.js');

var _BulletJs2 = _interopRequireDefault(_BulletJs);

var _utilsJs = require('../utils.js');

var getGunFrames = (0, _AnimatorJs.framesGetter)('gun', 24);

var Gun = (function () {
  function Gun(name, cooldown, inaccuracy, frame, px, py, x, y, kick, back, voffs, init) {
    _classCallCheck(this, Gun);

    this.name = name;
    this.cooldown = cooldown;
    this.inaccuracy = inaccuracy;
    this.frame = frame;
    this.px = px;
    this.py = py;
    this.x = x;
    this.y = y;
    this.kick = kick;
    this.back = back;
    this.voffs = voffs;

    if (init === undefined || init) {
      this.graphic = new PIXI.Container();
      this.gunSprite = new PIXI.Sprite(getGunFrames()[frame]);
      this.graphic.addChild(this.gunSprite);
      this.gunSprite.pivot.x = px;
      this.gunSprite.pivot.y = py;
      this.graphic.x = x;
      this.graphic.y = y;
      this.coolTime = 0;
      this.owner = undefined;
    }
  }

  _createClass(Gun, [{
    key: 'clone',
    value: function clone() {
      return new Gun(this.name, this.cooldown, this.inaccuracy, this.frame, this.px, this.py, this.x, this.y, this.kick, this.back, this.voffs);
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      this.kickback *= Math.pow(this.back, deltaTime);
      if (this.kickback < -1) this.kickback = -1;
      if (!this.owner) return;
      if (this.owner.firing && this.coolTime <= 0) {
        this.fire();
      } else {
        this.coolTime = Math.max(this.coolTime - deltaTime, 0);
      }
    }
  }, {
    key: 'inacc',
    value: function inacc(scale) {
      if (scale === 0) return 0;
      var r = Math.random();
      return scale * (r * r * this.inaccuracy * 2 - this.inaccuracy);
    }
  }, {
    key: 'fire',
    value: function fire() {
      var types = this.owner.hitTypes.slice(0);
      types.push('terrain');
      this.owner.state.add(new _BulletJs2['default'](this.owner.x, this.owner.y, this.voffs + this.inacc(1), this.owner.aimDir + this.inacc(Math.PI / 128), types, [this.owner]));
      this.coolTime = this.cooldown;
      this.kickback -= this.kick;
      (0, _utilsJs.sound)('shot');
    }
  }, {
    key: 'kickback',
    get: function get() {
      return this.gunSprite.x;
    },
    set: function set(x) {
      this.gunSprite.x = x;
    }
  }]);

  return Gun;
})();

exports['default'] = Gun;
var guns = {
  pistol: new Gun("Pistol", 0.2, 0, 0, 11, 10, 11 - 12, 10 - 12, 0.8, 0.005, -3, false),
  machine: new Gun("Machine Gun", 0.05, 2, 1, 11, 9, 11 - 12, 9 - 12, 0.3, 0.01, 0, false)
};
exports.guns = guns;

},{"../Animator.js":1,"../utils.js":16,"./Bullet.js":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _StateJs = require('../State.js');

var _StateJs2 = _interopRequireDefault(_StateJs);

var _EntityJs = require('../Entity.js');

var _EntityJs2 = _interopRequireDefault(_EntityJs);

var _CharacterJs = require('./Character.js');

var _CharacterJs2 = _interopRequireDefault(_CharacterJs);

var _SoldierJs = require('./Soldier.js');

var _SoldierJs2 = _interopRequireDefault(_SoldierJs);

var _GrumJs = require('./Grum.js');

var _GrumJs2 = _interopRequireDefault(_GrumJs);

var _AIStateJs = require('./AIState.js');

var _utilsJs = require('../utils.js');

var _particlesJs = require('../particles.js');

var _mainJs = require('../main.js');

var levelHeight = 72;

var PlayState = (function (_State) {
  _inherits(PlayState, _State);

  function PlayState() {
    _classCallCheck(this, PlayState);

    _get(Object.getPrototypeOf(PlayState.prototype), 'constructor', this).call(this, 0xd6a824);
    this.player = undefined;
    this.particles = new _particlesJs.ParticleSystem();
    this.sunset = new _EntityJs2['default'](new PIXI.Sprite(PIXI.loader.resources.sunset.texture));
    this.sunset.layer = -1024;
    this.stage.scale.x = this.stage.scale.y = 4;
    this.scroll = 0;
    this.shake = 0;
    this.tide = 0;
    this.levels = 0;
  }

  _createClass(PlayState, [{
    key: 'addPlatform',
    value: function addPlatform(x, y, width, height, topCollider, el, er) {
      var ent = new _EntityJs2['default'](new PIXI.Sprite(_utilsJs.black), new PIXI.Rectangle(0, 0, width, height));
      ent.types.push('terrain');
      ent.graphic.width = width;ent.graphic.height = height;
      ent.x = x;ent.y = y;
      ent.topCollider = !!topCollider;
      this.add(ent);

      if (el) {
        var edge = new _EntityJs2['default'](new PIXI.Container(), new PIXI.Rectangle(-1, -1, 1, 1));
        edge.types.push('edge');
        edge.x = x;edge.y = y;
        this.add(edge);
      }
      if (er) {
        var edge = new _EntityJs2['default'](new PIXI.Container(), new PIXI.Rectangle(0, -1, 1, 1));
        edge.types.push('edge');
        edge.x = x + width;edge.y = y;
        this.add(edge);
      }

      return ent;
    }
  }, {
    key: 'generate',
    value: function generate(level) {
      var bottom = -level * levelHeight;
      this.addPlatform(16, bottom - levelHeight, 8, levelHeight);
      this.addPlatform(200 - 16 - 8, bottom - levelHeight, 8, levelHeight);

      var xoffs = level % 2 ? 40 : 0;

      if (level === 1) {
        this.addPlatform(16, bottom, 200 - 24 - 8, 8);
      } else {
        this.addPlatform(24 + xoffs, bottom, 200 - 16 - 24 - 40, 8, level % 2, !(level % 2));
        var amt = Math.floor(Math.random() * 10);
        for (var i = 0; i < amt; ++i) {
          var x = Math.random() * 88 + xoffs + 24;
          var j = i;
          if (Math.random() < 0.25) {
            j = amt - i;
          }
          if (i < amt / 3) {
            this.add(new _GrumJs2['default'](x, bottom - 24));
          } else {
            this.add(new _SoldierJs2['default'](x, bottom - 12));
          }
        }
      }
    }
  }, {
    key: 'begin',
    value: function begin() {
      _get(Object.getPrototypeOf(PlayState.prototype), 'begin', this).call(this);

      this.add(this.sunset);

      this.add(this.particles);

      var ent = this.player = new _SoldierJs2['default'](96, -levelHeight - 13);
      ent.intState = new _AIStateJs.PlayerState();
      this.add(ent);
      this.scroll = ent.y;

      var instructions = new _EntityJs2['default'](new PIXI.Text("--Controls\nWASD: Move\nMouse: Attack\nSpace: Take over"));
      instructions.graphic.scale.x = instructions.graphic.scale.y = 0.25;
      instructions.x = this.player.x;
      instructions.y = this.player.y - instructions.graphic.height;
      this.add(instructions);
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      var _this = this;

      _get(Object.getPrototypeOf(PlayState.prototype), 'update', this).call(this, deltaTime, totalTime);
      var scroll = this.scroll,
          py = this.player.y - 16;
      this.scroll = py + (scroll - py) * Math.pow(0.1, deltaTime);
      this.tide -= deltaTime * 10;
      if (this.scroll > this.tide - 75) {
        this.scroll = this.tide - 75;
      } else if (this.tide > this.scroll + 90) {
        this.tide = this.scroll + 90;
      }

      var elevels = Math.ceil(-this.scroll / levelHeight) + 1;
      while (this.levels < elevels) {
        this.generate(++this.levels);
      }

      var shake = 0;
      for (var i = 0, len = this.entities.length; i < len; ++i) {
        shake += this.entities[i].shake;
      }
      this.shake = Math.sin(totalTime * 48) * shake;
      this.scroll += this.shake;
      this.entities.forEach(function (e) {
        if (e.y > _this.tide) {
          if (e.hp !== undefined) {
            if (e.hp > 0) e.hp = 0;
          } else if (e.y > _this.tide + 48 && e !== _this.particles) {
            _this.remove(e);
          }
        }
      });
      if (this.player.hp <= 0) (0, _mainJs.switchState)(new PlayState());
    }
  }, {
    key: 'witnesses',
    value: function witnesses(x, y, type) {
      return this.entities.filter(function (ent) {
        return Math.abs(y - ent.y) < levelHeight * 0.5 && ent.types.indexOf(type) >= 0;
      });
    }
  }, {
    key: 'scroll',
    get: function get() {
      return this._scroll;
    },
    set: function set(x) {
      this._scroll = x;
      this.stage.y = -x * this.stage.scale.y + 300;
      this.sunset.y = x * 0.75 - this.sunset.graphic.height + 150;
    }
  }]);

  return PlayState;
})(_StateJs2['default']);

exports['default'] = PlayState;
module.exports = exports['default'];

},{"../Entity.js":2,"../State.js":4,"../main.js":14,"../particles.js":15,"../utils.js":16,"./AIState.js":5,"./Character.js":7,"./Grum.js":8,"./Soldier.js":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CharacterJs = require('./Character.js');

var _CharacterJs2 = _interopRequireDefault(_CharacterJs);

var _AnimatorJs = require('../Animator.js');

var _AnimatorJs2 = _interopRequireDefault(_AnimatorJs);

var _constantsJs = require('./constants.js');

var _GunJs = require('./Gun.js');

var _utilsJs = require('../utils.js');

var _particlesJs = require('../particles.js');

var _AIStateJs = require('./AIState.js');

var getSoldierFrames = (0, _AnimatorJs.framesGetter)('soldier', 24);

var Soldier = (function (_Character) {
  _inherits(Soldier, _Character);

  function Soldier(x, y) {
    _classCallCheck(this, Soldier);

    _get(Object.getPrototypeOf(Soldier.prototype), 'constructor', this).call(this, x, y, new PIXI.Container(), new PIXI.Rectangle(9 - 12, 3 - 12, 6, 21));
    this.graphic.addChild(this.body = new _AnimatorJs2['default'](getSoldierFrames()));
    this.body.pivot.x = 12;
    this.body.pivot.y = 12;
    this.body.addAnim('idle', [0]);
    this.body.addAnim('run', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 30);
    this.body.addAnim('runb', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 30);
    this.body.addAnim('jumpf', [1]);
    this.body.addAnim('jumpv', [10]);
    this.body.addAnim('jumpb', [11]);
    this.body.addAnim('wallCling', [21]);
    this.body.playAnim('idle');
    this.gun = _GunJs.guns.pistol.clone();
    this.aimDir = 0;
    this.visorFlash = 0;
    this.visorFlashSpeed = Math.random() * 24 + 52;
    this.color = _constantsJs.colors.human;
    this.firing = false;
    this.types = ['human'];
    this.hitTypes = ['alien'];
    this.updateVisorFlash();
    this.intState = new _AIStateJs.SoldierState();
  }

  _createClass(Soldier, [{
    key: 'shot',
    value: function shot(bullet, dx, dy) {
      _get(Object.getPrototypeOf(Soldier.prototype), 'shot', this).call(this, bullet, dx, dy);
      this.state.witnesses(this.x, this.y, 'human').forEach(function (h) {
        return h.hitTypes.push('player');
      });
    }
  }, {
    key: 'die',
    value: function die() {
      _get(Object.getPrototypeOf(Soldier.prototype), 'die', this).call(this);
      (0, _utilsJs.sound)('die');
      if (this.state) {
        this.state.particles.add(new _particlesJs.Particle(this.x, this.y, getSoldierFrames()[22], 0.2));
      }
    }
  }, {
    key: 'updateVisorFlash',
    value: function updateVisorFlash() {
      var flash = Math.sin(this.visorFlash) * 0.1 + 0.9,
          color = this.color;
      this.body.tint = (color & 0x0000FF) * flash & 0x0000FF | (color & 0x00FF00) * flash & 0x00FF00 | (color & 0xFF0000) * flash & 0xFF0000;
    }
  }, {
    key: 'updateAnims',
    value: function updateAnims(deltaTime, totalTime) {
      if (!this.collideDown) {
        var vel = this.graphic.scale.x * this.velocity.x / this.maxVelocity.x;
        if (vel > 0) this.body.playAnim('jumpf');else if (vel < 0) this.body.playAnim('jumpb');else this.body.playAnim('jumpv');
      } else if (this.moveDir === _CharacterJs.direction.halt || this.collideSide) {
        this.body.playAnim('idle');
      } else if (this.moveDir === this.graphic.scale.x) {
        this.body.playAnim('run');
      } else {
        this.body.playAnim('runb');
      }
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      if (this.hp <= 0 && this.state) this.state.remove(this);
      this.visorFlash += deltaTime * this.visorFlashSpeed;
      this.updateVisorFlash();
      if (this.gun) this.gun.update(deltaTime, totalTime);

      _get(Object.getPrototypeOf(Soldier.prototype), 'update', this).call(this, deltaTime, totalTime);
    }
  }, {
    key: 'aimAt',
    value: function aimAt(x, y) {
      return this.aimDir = Math.atan2(y - this.y, x - this.x);
    }
  }, {
    key: 'gun',
    get: function get() {
      return this._gun;
    },
    set: function set(gun) {
      if (this._gun) {
        this.graphic.removeChild(this._gun.graphic);
        gun.graphic.rotation = this._gun.graphic.rotation;
      }
      this._gun = gun;
      this.graphic.addChild(gun.graphic);
      gun.owner = this;
    }
  }, {
    key: 'aimDir',
    get: function get() {
      return this._aimDir;
    },
    set: function set(x) {
      this._aimDir = x;
      if (Math.abs(x) > Math.PI * 0.5) {
        this.graphic.scale.x = -1;
        this.gun.graphic.rotation = Math.PI - x;
      } else {
        this.graphic.scale.x = 1;
        this.gun.graphic.rotation = x;
      }
    }
  }, {
    key: 'color',
    get: function get() {
      return this._color;
    },
    set: function set(x) {
      this._color = x;
      if (this.body) this.updateVisorFlash();
    }
  }]);

  return Soldier;
})(_CharacterJs2['default']);

exports['default'] = Soldier;
module.exports = exports['default'];

},{"../Animator.js":1,"../particles.js":15,"../utils.js":16,"./AIState.js":5,"./Character.js":7,"./Gun.js":9,"./constants.js":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var colors = {
  player: 0xFF1020,
  human: 0x1020FF,
  alien: 0x20FF10
};
exports.colors = colors;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getMouse = getMouse;
exports.getGlobalMouse = getGlobalMouse;
exports.initMouse = initMouse;

var _mainJs = require('./main.js');

var renderer = undefined;

var keys = {};
exports.keys = keys;
var pkeys = {};
var windowMouse = new PIXI.Point();
var mouse = new PIXI.Point();
var globalMouse = new PIXI.Point();

function getMouse() {
  var gm = getGlobalMouse();
  var state = (0, _mainJs.getState)();
  if (!state) return gm;
  var stage = (0, _mainJs.getState)().stage;
  mouse.x = (gm.x - stage.x) / stage.scale.x;
  mouse.y = (gm.y - stage.y) / stage.scale.y;
  return mouse;
}

function getGlobalMouse() {
  globalMouse.x = windowMouse.x - renderer.view.offsetLeft;
  globalMouse.y = windowMouse.y - renderer.view.offsetTop;
  return globalMouse;
}

function nameKey(keyCode) {
  switch (keyCode) {
    case 0x57:
    case 0x77:
    case 0x26:
      return 'up';
    case 0x41:
    case 0x61:
    case 0x25:
      return 'left';
    case 0x53:
    case 0x73:
    case 0x28:
      return 'down';
    case 0x44:
    case 0x64:
    case 0x27:
      return 'right';
    case 0x5A:
    case 0x7A:
    case 0x20:
      return 'action1';
  }
}

window.addEventListener('keydown', function (ev) {
  if (ev.ctrlKey) return;
  var keyName = nameKey(ev.keyCode);
  if (keyName) {
    if (!pkeys[keyName]) keys[keyName] = true;
    pkeys[keyName] = true;
    ev.preventDefault();
  }
});
window.addEventListener('keyup', function (ev) {
  var keyName = nameKey(ev.keyCode);
  if (keyName) {
    keys[keyName] = pkeys[keyName] = false;
    ev.preventDefault();
  }
});

function initMouse(rend) {
  renderer = rend;
  window.addEventListener('mousedown', function (ev) {
    if (ev.button === 0) {
      if (!pkeys.mouse) keys.mouse = true;
      pkeys.mouse = true;
      ev.preventDefault();
    }
  });
  window.addEventListener('mouseup', function (ev) {
    if (ev.button === 0) {
      keys.mouse = pkeys.mouse = false;
      ev.preventDefault();
    }
  });
  window.addEventListener('mousemove', function (ev) {
    windowMouse.x = ev.clientX;
    windowMouse.y = ev.clientY;
  });
}

},{"./main.js":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getState = getState;
exports.switchState = switchState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gamePlayStateJs = require('./game/PlayState.js');

var _gamePlayStateJs2 = _interopRequireDefault(_gamePlayStateJs);

var _inputJs = require('./input.js');

createjs.Sound.alternateExtensions = ['mp3'];
createjs.Sound.registerSound('audio/shot.ogg', 'shot');
createjs.Sound.registerSound('audio/smash.ogg', 'smash');
createjs.Sound.registerSound('audio/die.ogg', 'die');

//PIXI.ticker.shared.speed = 0.25;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);
(0, _inputJs.initMouse)(renderer);

PIXI.loader.add('soldier', 'images/soldier.png').add('alien', 'images/alien.png').add('gun', 'images/gun.png').add('bullet', 'images/bullet.png').add('sunset', 'images/sunset.png').load(init);

var total = undefined,
    prev = undefined;
var state = undefined;

function getState() {
  return state;
}

function init(loader, resources) {
  switchState(new _gamePlayStateJs2['default']());

  requestAnimationFrame(update);
}

function update(time) {
  requestAnimationFrame(update);

  if (total === undefined) {
    total = 0;
    prev = time;
  }
  if (prev === time) return;

  var delta = Math.min((time - prev) * 0.001, 0.05) * PIXI.ticker.shared.speed;
  total += delta;

  state.update(delta, total);

  prev = time;

  renderer.backgroundColor = state.backgroundColor;
  renderer.render(state.stage);
}

function switchState(newState) {
  if (state) state.end(newState);
  var oldState = state;
  state = newState;
  state.begin(oldState);
}

},{"./game/PlayState.js":10,"./input.js":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.stayFader = stayFader;
exports.blackDust = blackDust;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EntityJs = require('./Entity.js');

var _EntityJs2 = _interopRequireDefault(_EntityJs);

var _utilsJs = require('./utils.js');

function stayFader(stay, fade) {
  return function (t) {
    return t <= stay ? 1 : Math.max(0, 1 - (t - stay) / fade);
  };
}

var bdbox = new PIXI.Rectangle(-0.5, -0.5, 1, 1);
var zeroFunc = function zeroFunc() {
  return 0;
};

function blackDust(x, y, forceX, forceY, dir, lifespan) {
  var vx = Math.cos(dir) * forceX,
      vy = Math.sin(dir) * forceY;
  return new Particle(x, y, _utilsJs.black, lifespan, {
    x: function x(t) {
      return Math.pow(0.8, t) * vx;
    },
    y: function y(t) {
      return t * 600 + vy;
    }
  }, stayFader(lifespan - 0.1, 0.1)).addPhysics(bdbox, ['terrain'], function (p) {
    if (p.velocity) p.velocity.x = zeroFunc;
  }, function (p) {
    p.removePhysics().velocity = undefined;
  });
}

var Particle = (function (_Entity) {
  _inherits(Particle, _Entity);

  function Particle(x, y, texture, lifespan, velocity, alpha, scale, tint) {
    _classCallCheck(this, Particle);

    _get(Object.getPrototypeOf(Particle.prototype), 'constructor', this).call(this);
    if (texture.fps) {
      if (texture.fps === 0 || texture.frames.length === 0) {
        this.graphic = new PIXI.Sprite(texture.frames[0]);
      } else {
        var mc = this.graphic = new PIXI.extras.MovieClip(texture.frames);
        mc.speed = texture.fps * 0.001 / PIXI.TARGET_FPMS;
        mc.loop = texture.loop === undefined ? true : texture.loop;
        mc.play();
      }
    } else {
      this.graphic = new PIXI.Sprite(texture);
    }
    this.graphic.pivot.x = this.graphic.width * 0.5;
    this.graphic.pivot.y = this.graphic.height * 0.5;
    this.graphic.x = x;
    this.graphic.y = y;
    this.lifespan = lifespan;
    this.velocity = velocity;
    this.alpha = alpha;
    this.scale = scale;
    this.tint = tint;
    this.lifeTime = 0;
    this.dead = false;
    this.update(0);
  }

  _createClass(Particle, [{
    key: 'addPhysics',
    value: function addPhysics(hitbox, collideTypes, hitX, hitY) {
      var _this = this;

      this.hitbox = hitbox;
      this.collideTypes = collideTypes;
      if (hitX) this.hitX = function () {
        return hitX(_this);
      };
      if (hitY) this.hitY = function () {
        return hitY(_this);
      };else this.hitY = this.hitX;
      return this;
    }
  }, {
    key: 'removePhysics',
    value: function removePhysics() {
      this.collideTypes = null;
      return this;
    }
  }, {
    key: 'update',
    value: function update(deltaTime, totalTime) {
      this.lifeTime += deltaTime;
      var lt = this.lifeTime;
      if (lt >= this.lifespan) {
        this.dead = true;
        return;
      }
      var g = this.graphic;
      if (this.velocity) {
        var dx = this.velocity.x(lt) * deltaTime,
            dy = this.velocity.y(lt) * deltaTime;
        if (this.collideTypes) {
          this.moveBy(dx, dy, this.collideTypes, false, this.hitX, this.hitY);
        } else {
          this.graphic.x += dx;
          this.graphic.y += dy;
        }
      }
      if (this.alpha) g.alpha = this.alpha(lt);
      if (this.scale) g.scale.x = g.scale.y = this.scale(lt);
      if (this.tint) {
        var r = undefined,
            _g = undefined,
            b = undefined;
        if (typeof this.tint === 'function') r = _g = b = this.tint(lt) * 0xFF & 0xFF;else {
          r = this.tint.r(lt) * 0xFF & 0xFF;
          _g = this.tint.g(lt) * 0xFF & 0xFF;
          b = this.tint.b(lt) * 0xFF & 0xFF;
        }
        this.graphic.tint = r << 16 | _g << 8 | b;
      }
    }
  }]);

  return Particle;
})(_EntityJs2['default']);

exports.Particle = Particle;

var ParticleSystem = (function (_Entity2) {
  _inherits(ParticleSystem, _Entity2);

  function ParticleSystem() {
    _classCallCheck(this, ParticleSystem);

    _get(Object.getPrototypeOf(ParticleSystem.prototype), 'constructor', this).call(this, new PIXI.Container());
    this.particles = [];
    this.layer = 32;
  }

  _createClass(ParticleSystem, [{
    key: 'update',
    value: function update(deltaTime, totalTime) {
      this.particles.forEach(function (p) {
        return p.update(deltaTime, totalTime);
      });
      for (var i = 0; i < this.particles.length;) {
        if (this.particles[i].dead) {
          this.graphic.removeChildAt(i);
          this.particles.splice(i, 1);
        } else {
          ++i;
        }
      }
    }
  }, {
    key: 'add',
    value: function add(particle) {
      this.particles.push(particle);
      this.graphic.addChild(particle.graphic);
      particle.state = this.state;
    }
  }]);

  return ParticleSystem;
})(_EntityJs2['default']);

exports.ParticleSystem = ParticleSystem;

},{"./Entity.js":2,"./utils.js":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.sound = sound;
var canvas = document.createElement('canvas');
canvas.width = canvas.height = 1;
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 1, 1);
var black = PIXI.Texture.fromCanvas(canvas, PIXI.SCALE_MODES.NEAREST);

exports.black = black;
canvas = document.createElement('canvas');
canvas.width = canvas.height = 1;
ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 1, 1);
var white = PIXI.Texture.fromCanvas(canvas, PIXI.SCALE_MODES.NEAREST);

exports.white = white;

function sound(id, volume) {
  var out = createjs.Sound.play(id);
  out.pan = -0.01;
  if (volume !== undefined) out.volume = volume;
  return out;
}

},{}]},{},[14]);
