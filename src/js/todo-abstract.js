let todoAbstract = (function(name, parent){

    function AbstractTodo(name, parent){
        if (this.constructor === AbstractTodo) {
           throw new Error("Can't instantiate abstract class!");
         }

          let _name = name;
          let _$parent = parent;
          let _$main = document.querySelector('#main');

         this.getName = function () {
             return _name;
         }
         this.getParent = function (){
             return _$parent;
         }
         this.getMain = function () {
             return _$main;
         }
    }

    AbstractTodo.prototype.createNew = function () {
        throw new Error("Abstract method!");
    }
    AbstractTodo.prototype.createElement = function () {
        throw new Error("Abstract method!");
    }
    AbstractTodo.prototype.deleteUl = function () {
        throw new Error("Abstract method!");
    }
    AbstractTodo.prototype.render = function () {
        throw new Error("Abstract method!");
    }
    AbstractTodo.prototype.makeJsonObj = function () {
        throw new Error("Abstract method!");
    }
    AbstractTodo.prototype.filters = ['all', 'active', 'completed'];
    AbstractTodo.prototype.filter = 'all';
    AbstractTodo.prototype.twentyFourhours = 86400000;
    AbstractTodo.prototype.twoHours = 7200000;
    AbstractTodo.prototype.twoHoursMinusOne = 7140000;

    return AbstractTodo;

}());
