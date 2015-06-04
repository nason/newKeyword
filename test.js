"use strict";

/**
 * Let's pretend you have some vendor code exposing a pseudoclassical class.
 * The point of these tests are to explore different approaches to interacting
 * with it, specifically functions that instantiate an object for you and how
 * the `new` keyword comes into play
 *
 * The specific case is writing a function that returns an instance of some class,
 * and no guarantee that it will consistently be called with the `new` keyword.
 *
 * Note: some of these tests fail, and thats the whole point
 */

const expect = require('expect.js');
const _ = require('lodash');

// A very useful class
function Thing() {
  this.test = true;
  this._args = arguments;
  this.getContext = function () { return this };
}

// Now lets write a function to construct us a Thing.
// There's more than a few ways:

// Commonly, you'll just `new` it
function getNewThing() {
  return new Thing(arguments);
}
// Sometimes you'll use `apply`
function applyNewThing() {
  var it = {};
  Thing.apply(it, arguments);

  return it;
}
// Or `Object.create`
function createAThing() {
  var newThing = Object.create(Thing.prototype);
  Thing.apply(newThing, arguments);

  return newThing;
}

describe('Constuctor-ish function that uses new', function () {
  describe('using new', function () {
    describe('context', function (){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;
        let firstArg = {};
        let it = new getNewThing(firstArg, 'test', true, 53);

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      /**
       * FAIL: Wraps arguments into an extra array vs other methods.
       * This inconsistency is hard to work around.
       */
      it('should pass a direct reference for arguments through', function () {
        let _this = this;
        let firstArg = {};
        let it = new getNewThing(firstArg, 'test', true, 53);

        // This scenario causes args to be in an extra array, so it._args[0]
        // is really what you'd need -- and impossible to know that in advance
        let itArgs = it._args;

        expect(itArgs[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(itArgs) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      it('should set the constructor correctly', function () {
        let _this = this;
        let firstArg = {};
        let it = new getNewThing(firstArg, 'test', true, 53);

        expect(it instanceof Thing).to.be(true);
        expect(it.constructor).to.be(Thing);
      });
    })
  })

  describe('not using new', function () {
    describe('context', function(){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;
        let it = getNewThing();

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      /**
       * FAIL: Wraps arguments into an extra array vs other methods.
       * This inconsistency is hard to work around.
       */
      it('should pass a direct reference for arguments through', function () {
        let firstArg = {};
        let it = getNewThing(firstArg, 'test', true, 53);

        // This scenario causes args to be in an extra array, so it._args[0]
        // is really what you'd need -- and impossible to know that in advance
        let itArgs = it._args;

        expect(itArgs[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(itArgs) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      it('should set the constructor correctly', function () {
        let it = getNewThing();

        expect(it instanceof Thing).to.be(true);
        expect(it.constructor).to.be(Thing);
      });
    })
  })
})

describe('Constructor-ish function that uses apply', function () {
  describe('using new', function () {
    describe('context', function(){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;

        let it = new applyNewThing();

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      it('should pass a direct reference for arguments through', function () {
        let firstArg = {};
        let it = new applyNewThing(firstArg, 'test', true, 53);

        expect(it._args[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(it._args) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      /**
       * FAIL: it instanceof applyNewThing === true, but this gets weird quickly.
       * If this is what you're going for, or if you dont use instanceof, this can be ok.
       */
      it('should set the constructor correctly', function () {
        let it = new applyNewThing();

        // This assertion fails in this scenario
        expect(it instanceof Thing).to.be(true);

        expect(it.constructor).to.be(Thing);
      });
    })
  })

  describe('not using new', function () {
    describe('context', function(){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;

        let it = applyNewThing();

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      it('should pass a direct reference for arguments through', function () {
        let firstArg = {};
        let it = applyNewThing(firstArg, 'test', true, 53);

        expect(it._args[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(it._args) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      /**
       * FAIL: it instanceof applyNewThing === true, but this gets weird quickly.
       * If this is what you're going for, or if you dont use instanceof, this can be ok.
       */
      it('should set the constructor correctly', function () {
        let it = applyNewThing();

        // This assertion fails in this scenario
        expect(it instanceof Thing).to.be(true);

        expect(it.constructor).to.be(Thing);
      });
    })
  })
})

describe('Constructor-ish function that uses Object.create and apply', function () {
  describe('using new', function () {
    describe('context', function(){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;

        let it = new createAThing();

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      it('should pass a direct reference for arguments through', function () {
        let firstArg = {};
        let it = new createAThing(firstArg, 'test', true, 53);

        expect(it._args[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(it._args) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      it('should set the constructor correctly', function () {
        let it = new createAThing();

        expect(it instanceof Thing).to.be(true);
        expect(it.constructor).to.be(Thing);
      });
    })
  });

  describe('not using new', function () {
    describe('context', function(){
      it('should maintain the correct context with regard to the returned object', function() {
        let _this = this;

        let it = createAThing();

        let ctx = it.getContext();
        expect(ctx).to.equal(it);

        let ctx2 = it.getContext.apply(_this);
        expect(ctx2).to.equal(_this);
      })
    });

    describe('arguments', function (){
      it('should pass a direct reference for arguments through', function () {
        let firstArg = {};
        let it = createAThing(firstArg, 'test', true, 53);

        expect(it._args[0]).to.be(firstArg);

        (function () {
          // Shallow comparison
          expect( _.toArray(it._args) ).to.eql( _.toArray(arguments) );
        })(firstArg, 'test', true, 53)
      });
    })

    describe('constructor property', function (){
      it('should set the constructor correctly', function () {
        let it = createAThing();

        expect(it instanceof Thing).to.be(true);
        expect(it.constructor).to.be(Thing);
      });
    })
  })
})
