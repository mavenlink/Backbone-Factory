// Backbone Factory JS
// https://github.com/SupportBee/Backbone-Factory

var assign = require('lodash.assign');
var forEach = require('lodash.foreach');

BackboneFactory = {

  factories: {},
  sequences: {},

  define: function(factory_name, klass, defaults){
    if (!klass) {
      throw "Factory model is not defined";
    }

    // Check for arguments' sanity
    if(factory_name.match(/[^\w-_]+/)){
      throw "Factory name should not contain spaces or other funky characters";
    }

    if(defaults === undefined) defaults = function(){return {}};

    // The object creator
    this.factories[factory_name] = function(options){
      if(options === undefined) options = function(){return {}};
      var args = assign({}, {id: BackboneFactory.next("_" + factory_name + "_id")}, defaults.call(), options.call());
      return new klass(args);
    };

    // Lets define a sequence for id
    BackboneFactory.define_sequence("_"+ factory_name +"_id", function(n){
      return n
    });
  },

  create: function(factory_name, options){
    if(this.factories[factory_name] === undefined){
      throw "Factory with name " + factory_name + " does not exist";
    }

    if(typeof(options) !== "function"){
      var factoryOptions = {}

      forEach(options, function(value, key){
        if (typeof(value) === "function"){
          factoryOptions[key] = value.call();
        } else {
          factoryOptions[key] = value;
        }
      });

      options = function(){return factoryOptions};
    }

    return this.factories[factory_name].apply(null, [options]);
  },

  define_sequence: function(sequence_name, callback){
    this.sequences[sequence_name] = {}
    this.sequences[sequence_name]['counter'] = 0;
    this.sequences[sequence_name]['callback'] = callback; 
  },

  next: function(sequence_name){
    if(this.sequences[sequence_name] === undefined){
      throw "Sequence with name " + sequence_name + " does not exist";
    }
    this.sequences[sequence_name]['counter'] += 1;
    return this.sequences[sequence_name]['callback'].apply(null, [this.sequences[sequence_name]['counter']]); //= callback; 
  }
};

module.exports = BackboneFactory;
