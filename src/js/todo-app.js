var todoApp = (function () {

  let instance;

  function Todo() {
      let _$mainTodo = document.querySelector('#mainFirst');

      let _$mainInput = _$mainTodo.querySelector('#create-list');
      let _$mainAddList = _$mainTodo.querySelector('.add-list');
      let _$mainViewLists = _$mainTodo.querySelector('.view-lists');
      let _$mainDeleteAll = _$mainTodo.querySelector('.delete-lists');

      let _$audio = _$mainTodo.querySelector('#audio');
      let _$canvas = _$mainTodo.querySelector('#pencil');
      let _$main = _$mainTodo.querySelector('#main');

      let _pencil = todoPencil.create(_$canvas);
      let _sound = todoSound.create(_$audio);
      let _todoLists = [];

      this.getMainTodo = function () {
          return _$mainTodo;
      }

      this.getMainInput = function () {
          return _$mainInput;
      }

      this.getMainAddList = function () {
          return _$mainAddList;
      }

      this.getMainViewLists = function () {
          return _$mainViewLists;
      }

      this.getMainDeleteAll = function () {
          return _$mainDeleteAll;
      }

      this.getAudio = function () {
          return _$audio;
      }

      this.getCanvas= function () {
          return _$canvas;
      }

      this.getPencil = function () {
          return _pencil;
      }

      this.getSound = function () {
          return _sound;
      }

      this.getMainTodo = function () {
          return _$mainTodo;
      }

      let bindEvents = function () {
          let self = this;

          _$mainTodo.addEventListener('click', function (e) {
              if (e.target.classList.contains("add-list") || e.target.classList.contains("view-lists")) {
                    _$canvas.classList.add('hidden');
                    _pencil.remove();
                    _sound.chooseSound('stop');

                     if (e.target.classList.contains("add-list")){
                          deleteAllLists();
                          addNewItem(_$mainInput.value);

                          _sound.chooseSound('addNewList');
                         _$mainInput.value = '';
                     }
                     if (e.target.classList.contains("view-lists")){
                         viewItem();
                         let interval = setInterval(function () {
                              viewItem();

                          }, 60000);
                     }
                }
                if (e.target.id === "pencil") {
                    _pencil.pause();
                    _sound.chooseSound('stop');
                  }
          }, false);
          _$mainTodo.addEventListener('dblclick', function (e) {

                if (e.target.id === "pencil") {
                    _pencil.draw();
                    _sound.chooseSound('pencil');

                  }
          }, false);
      };

      let addNewItem = function (input, parent, color) {
          let parentId = parent;
          if(input === ''){
             return alert('Please supply name for list') ;
          }
          if(!parentId){
              let counter = _todoLists.length;
              parentId = '#todo' + counter;
          }
              let item = todoList.create(input, parentId, color);
              _todoLists.push(item);
              return item;
      };

      let deleteAllLists = function () {
          while(_$main.firstChild){
              _$main.removeChild(_$main.firstChild);
          }
      };

      let viewItem = function () {
          deleteAllLists();

          _todoLists = [];
          let array = [];
          let item, list, task;

          if(localStorage.length === 0){
              return alert ('Please first save task.');
          }

          for (let variable in localStorage) {
              if(!variable.startsWith('#todo')) {
                  return alert ('No lists')
             } else {
                  item = JSON.parse(localStorage[variable]);
                  item.todoTask = JSON.parse(item.todoTask);
                  list = addNewItem(item.name, item.parent, item.color);

                  if(item.todoTask){
                      for (let i of item.todoTask) {
                        task = list.addTask(i.title, list, i.id, i.date, i.dueDate, i.isNew, i.isDelete, i.isCompleted);
                      }
                  }
              }
          }
          return _todoLists;
      };
          return {
            init: function () {
                _sound.chooseSound('pencil');
                _pencil.draw();
                bindEvents();
            },
        }
  };

  return {

    getInstance: function () {

      if ( !instance ) {
        instance = new Todo();
      }
      return instance;
    }

  };

})();
