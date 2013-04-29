//Class definition troubleticket
var TroubleTicket = function() {
 
    "use strict";
    
    //Private variables
    var _type_of_trailer = '';
    var _trailer_id = '';
    var _place = '';
    var _sealed = '';
    var _damages = [];

    //Getters
    this.getTypeOfTrailer = function(){
        return _type_of_trailer;
    }

    this.getTrailerId = function(){
        return _trailer_id;
    }

    this.getPlace = function(){
        return _place;
    }

    this.getSealed = function(){
        return _sealed;
    }

    this.getDamages = function(){
        return _damages;
    }

    //Setters
    this.setTypeOfTrailer = function(t){
        _type_of_trailer = t;
    }

    this.setTrailerId = function(tid){
        _trailer_id = tid;
    }

    this.setPlace = function(p){
        _place = p;
    }

    this.setSealed = function(s){
        _sealed = s;
    }

    this.setDamages = function(d){
        _damages = d;
    }

};
