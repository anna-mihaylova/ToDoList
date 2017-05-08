let todoList = (function(name, parent, co, todoList, isSelectAll){

    function List(name, parent, co, todoList, isSelectAll){
        if (!name || name === '') {
            return new Error('Please supply name');
        }

        todoAbstract.call(this, name, parent);

         let _todoTask = todoList || [];
         let _color = co || '#2f6194';
         let _isSelectAll = isSelectAll || false;
         let _$section = '';
         let _$input = '';
         let _$ul = '';
         let _$counter = '';
         let _$audio = document.querySelector('#audio');

         this.getTodoTask = function () {
             return _todoTask;
         }

         this.addTodoTask = function (task) {
              _todoTask.push(task);
         }

         this.changeTask = function (tasks) {
              _todoTask = tasks;
         }

         this.getColor = function () {
             return _color;
         }

         this.setColor = function (c) {
             _color = c;
         }

         this.getIsSelectAll = function (){
             return _isSelectAll;
         }

         this.setIsSelectAll = function (is){
             if(typeof is === 'boolean'){
                 _isSelectAll = is;
             }
         }

        this.getSection = function () {
            return _$section;
        }

        this.setSection = function (sec) {
            _$section = sec;
        }

        this.getInput = function () {
            return _$input;
        }

        this.setInput = function (inp) {
            _$input = inp;
        }

        this.getUl = function () {
            return _$ul;
        }

        this.setUl = function (ul) {
            _$ul = ul;
        }

        this.getCounter= function () {
            return _$counter;
        }

        this.setCounter= function (count) {
            _$counter = count;
        }

        this.getAudio = function () {
            return _$audio;
        }

        this.createNew();
    }
    List.prototype = Object.create(todoAbstract.prototype);
    List.prototype.constructor = List;

    List.prototype.bindEvents = function () {
        let self = this;
        let sound = todoSound.create(this.getAudio());

        window.addEventListener('hashchange', function () {

            let hash = location.hash.replace(/\#+\/+/ig,'');
            switch (hash) {
                case List.prototype.filters[0]: self.render(self.getParent(), List.prototype.filters[0]);
                    break;
                case List.prototype.filters[1]: self.render(self.getParent(), List.prototype.filters[1]);
                    break;
                case List.prototype.filters[2]: self.render(self.getParent(), List.prototype.filters[2]);
                    break;
                default: self.render(self.getParent(), List.prototype.filters[0]);
            }

        }, false);

        this.getInput().addEventListener('keyup', function (e) {
            if (e.which === 13 && e.target.value !== '') {

                self.addTask(e.target.value, self);
                sound.chooseSound('addNew');
                e.target.value = '';
            }
        }, false);

        self.getSection().addEventListener('click', function (e) {

            if (e.target.classList.contains('color')){

                self.getMain().classList.add('hidden');
                self.changeColor(e.currentTarget);
            }

            if (e.target.classList.contains('delete-section')){

                if (confirm('Are you sure to delete to do list')) {

                    self.getSection().setAttribute("class", "removed-item");
                    sound.chooseSound('deleted');

                    setTimeout(function(){
                        localStorage.removeItem(self.getSection().id);
                        self.deleteSection();
                        self.render();
                    }, 700);
                }
            }

            if (e.target.classList.contains('delete')){
                let id = e.target.parentNode.parentNode.getAttribute('data-id');
                let $liDelete = self.getSection().querySelector(`[data-id='${id}']`)

                if (confirm('Are you sure to delete this task?')) {
                    $liDelete.setAttribute("class", "removed-item");
                    sound.chooseSound('deletedAll');

                    setTimeout(function(){
                        self.deleteListItem(id);
                        self.render()
                    }, 800);
                }
            }

            if (e.target.classList.contains('date')){
                let $parentNode =  e.target.parentNode.parentNode;

                    while($parentNode.firstChild){
                        $parentNode.removeChild($parentNode.firstChild);
                    }

                    let $dateInput = document.createElement('input');
                    $dateInput.setAttribute('type', 'datetime-local');
                    $dateInput.setAttribute('class', 'due');
                    $dateInput.setAttribute('autofocus', 'autofocus');

                    let $dateDiv = document.createElement('div');
                    $dateDiv.setAttribute('class', 'list-item');

                    let $dateSpan = document.createElement('span');
                    $dateSpan.setAttribute('class', 'due-date');

                    $dateDiv.appendChild($dateInput);
                    $dateDiv.appendChild($dateSpan);
                    $parentNode.appendChild($dateDiv);

                    $dateInput.addEventListener('blur', function (e) {

                        let id = $parentNode.getAttribute('data-id');
                        let now = +new Date();

                        if((e.target.value == '') || (+new Date(e.target.value) < now)){
                            for(let variable of self.getTodoTask()){
                                if(variable.id === +id){
                                    variable.dueDate = (+now + List.prototype.twentyFourhours);
                                }
                            }
                             alert('Is not valid date. Automatic due date is after 1 day');
                        } else {
                            for(let variable of self.getTodoTask()){
                                if(variable.id === +id){
                                    variable['dueDate'] = +new Date(e.target.value);
                                }
                            }
                        }
                        self.addLocalStorage();
                        sound.chooseSound('alarmed');

                        setTimeout(function(){
                            self.render();
                        }, 700);
                }, false);
            }

            if (e.target.id === 'select-all'){
                if(self.getTodoTask().length == 0){
                    return alert('No')
                } else {
                    let $lists = self.getUl().childNodes;
                    for (variable of $lists) {
                        variable.classList.toggle("change-state");
                    }

                    setTimeout(function(){
                        self.selectAllListItem(e);
                    }, 700);
                }
            }

            if (e.target.classList.contains('checkbox')){

                let id = e.target.parentNode.parentNode.getAttribute('data-id');
                e.target.parentNode.parentNode.classList.toggle("change-state");
                sound.chooseSound('completed');

                setTimeout(function(){
                    self.toggleListItem(id);
                    self.render();
                }, 700);
            }

            if (e.target.classList.contains('clear-completed')){

                self.deleteAllCompletedListItem();

                setTimeout(function(){
                    self.addLocalStorage();
                    self.render();

                }, 900);
            }
        }, false);

        this.getUl().addEventListener('dblclick', function (e) {

            let $ul = e.currentTarget;
            let $parentNode =  e.target.parentNode;

            if(e.target.tagName === 'LABEL'){
                do{
                    $parentNode = $parentNode.parentNode;

                } while ($parentNode.tagName === 'li');

                while($parentNode.firstChild){

                    $parentNode.removeChild($parentNode.firstChild);
                }

                lastId = $parentNode.getAttribute("data-id");
                let $li = $ul.querySelector(`[data-id='${lastId}']`);

                let $changeInput = document.createElement('input');
                $changeInput.setAttribute('class', 'change-todo');
                $changeInput.setAttribute('autofocus', 'autofocus');

                let $changeDiv = document.createElement('div');
                $changeDiv.setAttribute('class', 'list-item');

                let $changeSpan = document.createElement('span');
                $changeSpan.setAttribute('class', 'edit');

                $changeDiv.appendChild($changeSpan);
                $changeDiv.appendChild($changeInput);
                $li.appendChild($changeDiv);

                e.target.value = '';

                $changeInput.addEventListener('blur', function (e) {
                    let id = e.target.parentNode.parentNode.getAttribute('data-id');
                    if(e.target.value === '') {
                       alert('The task is empty');
                       self.render();
                   } else {
                        for(let variable of self.getTodoTask()){
                            if(variable.id === +id){
                                variable['title'] = e.target.value;
                            }
                        }
                        self.addLocalStorage();
                        self.render();
                    }
                }, false);
            }
        }, false);
    }

    List.prototype.createNew = function () {

        let $section = this.createElement(this.getName(), this.getParent(), this.getColor());
        this.getMain().appendChild($section);
        let $input = $section.querySelector('input');
        let $ul = $section.querySelector('.todo-list');
        let $counter = $section.querySelector('#counter');

        this.setSection($section);
        this.setInput($input);
        this.setUl($ul);
        this.setCounter($counter);

        this.addLocalStorage(this);
        this.render();
        this.bindEvents();
    }

    List.prototype.deleteSection = function () {
        this.getSection().parentElement.removeChild(this.getSection())
    };

    List.prototype.deleteUl = function () {
        while(this.getUl().firstChild){
            this.getUl().removeChild(this.getUl().firstChild);
        }
    };

    List.prototype.render = function (name, fil, id1) {
        this.deleteUl();

        switch (fil) {
            case  List.prototype.filters[0]: this.renderAll(name, id1);
                break;
            case  List.prototype.filters[1]: this.renderActive(name, id1);
                break;
            case  List.prototype.filters[2]: this.renderCompleted(name, id1);
                break;
            default: this.renderAll(name, id1);
        }
        this.counter()
    };

    List.prototype.renderAll = function () {

        for (let variable of this.getTodoTask()) {
                let todoLi = todoTask.create(variable.title, this, variable.id, variable.id, variable.dueDate, variable.isNew, variable.isDelete, variable.isCompleted);
        }
        this.counter();
    };

    List.prototype.renderCompleted = function () {

        for (let variable of this.getTodoTask()) {
            if(variable.isCompleted === true){
                let todoLi = todoTask.create(variable.title, this, variable.id, variable.id, variable.dueDate, variable.isNew, variable.isDelete, variable.isCompleted);
            }
        }
        this.counter();
    };

    List.prototype.renderActive = function () {
        for (let variable of this.getTodoTask()) {
            if(variable.isCompleted === false){
                let todoLi = todoTask.create(variable.title, this, variable.id, variable.id, variable.dueDate, variable.isNew, variable.isDelete, variable.isCompleted);
            }
        }
        this.counter();
    };

    List.prototype.addTask = function (name, section, id, date, dueDate, isNew, isDelete, isCompleted) {

        let task = todoTask.create(name, section, id, date, dueDate, isNew, isDelete, isCompleted);

        task = task.makeJsonObj(task);
        this.addTodoTask(task);
        this.addLocalStorage();
        this.counter();
    }

    List.prototype.createElement = function (name, nameSection, color) {

           let $section = document.createElement('section');
           $section.setAttribute('id', nameSection);
           $section.setAttribute('class', 'todoapp');

           $section.style.background = color;

           let $header = document.createElement('header');

           let $h1 = document.createElement('h1');

           let $text = document.createTextNode(name);

           let $span = document.createElement('span');
           $span.setAttribute('class', 'checkbox');
           $span.setAttribute('id', 'select-all');
           if (this.getIsSelectAll()){
               $span.setAttribute('id', 'completed');
           }
           let $input = document.createElement('input');
           $input.setAttribute('type', 'text');
           $input.setAttribute('id', 'create-todo');
           $input.setAttribute('class', 'create-todo');
           $input.setAttribute('placeholder', 'Create todo item...');

           let $deleteSpan = document.createElement('span');
           $deleteSpan.setAttribute('class', 'delete-section');

           let $color = document.createElement('span');
           $color.setAttribute('class', 'color');

           let $ul = document.createElement('ul');
           $ul.setAttribute('class', 'todo-list');

           let $footer = document.createElement('footer');
           $footer.setAttribute('class', 'footer');
           $footer.style.display = "block";

           let $span2 = document.createElement('span');
           $span2.setAttribute('class', 'todo-count');

           let $strong2 = document.createElement('strong');
           $strong2.setAttribute('id', 'counter');

           let $textCounter = document.createTextNode('0');

           let $textItem = document.createTextNode(' items left');


           let $ul2 = document.createElement('ul');
           $ul2.setAttribute('class', 'filters');

           let $li1 = document.createElement('li');
           let $a1 = document.createElement('a');
           $a1.setAttribute('href', '#/');
           let $text1 = document.createTextNode('All');

           let $li2 = document.createElement('li');
           let $a2 = document.createElement('a');
           $a2.setAttribute('href', '#/active');
           let $text2 = document.createTextNode('Active');

           let $li3 = document.createElement('li');
           let $a3 = document.createElement('a');
           $a3.setAttribute('href', '#/completed');
           let $text3 = document.createTextNode('Completed');

           let $button = document.createElement('button');
           $button.setAttribute('class', 'clear-completed');
           $button.style.display = "block";
           let $textb = document.createTextNode('Clear completed');

           $h1.appendChild($text);

           $header.appendChild($h1);
           $header.appendChild($span);
           $header.appendChild($color);
           $header.appendChild($deleteSpan);
           $header.appendChild($input);

           $a1.appendChild($text1);
           $li1.appendChild($a1);

           $a2.appendChild($text2);
           $li2.appendChild($a2);

           $a3.appendChild($text3);
           $li3.appendChild($a3);

           $ul2.appendChild($li1);
           $ul2.appendChild($li2);
           $ul2.appendChild($li3);
           $button.appendChild($textb);

           $strong2.appendChild($textCounter);

           $span2.appendChild($strong2);
           $span2.appendChild($textItem);

           $footer.appendChild($button);
           $footer.appendChild($span2);
           $footer.appendChild($ul2);

           $section.appendChild($header);
           $section.appendChild($ul);
           $section.appendChild($footer);

           return $section;
    }

    List.prototype.addLocalStorage = function () {
        let jsonObj = this.makeJsonObj(this);
        localStorage.setItem(this.getParent(), JSON.stringify(jsonObj));
    };

    List.prototype.addOfLocalStorage = function () {
        this.deleteSection();

        let item;
        let array = [];
        let list;
        let task;
        if(localStorage.length === 0){
            return alert ('No lists');
        }
        for (let variable in localStorage) {
            if (variable === this.getParent()) {
                item = JSON.parse(localStorage[variable]);
                item.todoTask = JSON.parse(item.todoTask);
                this.createElement(item.name, item.parent, JSON.parse(item.color));
                if(item.todoTask){
                    for (let i of item.todoTask) {

                       this.addTask(i.title, list, i.id, i.date, i.dueDate, i.isNew, i.isDelete, i.completed);
                    }
                }
            } else {
                return alert ('Please first save task.')
            }
        }

        return this;
    };

    List.prototype.deleteListItem = function (id) {
            this.changeTask(this.getTodoTask().filter(function (todo){
                return todo.id !== +id;
        }));
        this.addLocalStorage();
    };

    List.prototype.toggleListItem = function (id) {

        let todoItem = this.getTodoTask().find(function (todo) {
            return todo.id === +id;
        });
        if (todoItem) {
            todoItem.isCompleted = !todoItem.isCompleted;
        }
        this.addLocalStorage();
    }

    List.prototype.deleteAllCompletedListItem = function () {
        let isCompleteTask = false;

        for (let variable in this.getTodoTask()) {
            if (this.getTodoTask()[variable].isCompleted !== false) {
                isCompleteTask = true;
                let id = this.getTodoTask()[variable].id;
                this.getUl().querySelector(`[data-id='${id}']`).setAttribute("class", "removed-item")

                let selectAll = this.getSection().querySelector('#select-all');
                selectAll.classList.remove('completed')
            }
        }
        if(!isCompleteTask) {
            return alert('No completed task for delete.');
        } else {
            if(confirm('Are you sure to delete all completed tasks?')){
                this.changeTask(this.getTodoTask().filter(function (todo){
                    return todo.isCompleted !== true;
                    }));
                }
                return this.render();
            }
    };

    List.prototype.selectAllListItem = function (e) {

        if(this.getIsSelectAll() === false){
            this.setIsSelectAll(true);
            e.target.classList.add('completed');
            for (let i of this.getTodoTask()) {
                i.isCompleted = true;
            }
        } else {
            this.setIsSelectAll(false);
            e.target.classList.remove('completed');
            for (let i of this.getTodoTask()) {
                i.isCompleted = false;
            }
        }
        this.addLocalStorage();
        this.render();
    };

    List.prototype.makeJsonObj = function (obj) {
        let jsonObj = {
            "name": obj.getName(),
            "parent": obj.getParent(),
            "todoTask": JSON.stringify(obj.getTodoTask()),
            "isSelectAll": obj.getIsSelectAll(),
            "color": obj.getColor(),
        }
        return jsonObj;
    }

    List.prototype.changeColor = function (section) {
        let self = this;
        let rgba;
        let canvas = document.createElement('canvas');
        canvas.id = "color";
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.zIndex = 1;
        canvas.style.position = "absolute";

        let $div = document.getElementById("pencilCanvas");
        $div.appendChild(canvas);

        let colorCanvas = document.getElementById('color');
        let pencilCanvas = document.getElementById('pencil');
        pencilCanvas.style.display = 'none';

        let context = colorCanvas.getContext('2d');
        let img = new Image();

        img.crossOrigin = "Anonymous";
        img.src = "./images/color.png";
        img.onload = function() {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            let draw = function(e) {
                let x = e.offsetX;
                let y = e.offsetY;
                let pixel = context.getImageData(x, y, 1, 1);
                let data = pixel.data;
                rgba = 'rgba(' + data[0] + ',' + data[1] +
                           ',' + data[2] + ',' + (data[3] / 255) + ')';
               self.setColor(rgba);
               self.getMain().classList.remove('hidden');
               context.clearRect(0, 0, canvas.width, canvas.height)
               self.addLocalStorage();
               self.render()
               section.style.background = rgba;

               return canvas.removeEventListener('click', draw, false);
            }
            canvas.addEventListener('click', draw, false);
        }
    };

    List.prototype.counter = function () {
        let count = 0;
        for (let variable in localStorage) {
            if (variable === this.getParent()) {
                item = JSON.parse(localStorage[variable]);
                item.todoTask = JSON.parse(item.todoTask);
                if(item.todoTask){
                    for (let i of item.todoTask) {
                        if(i.isCompleted === false){
                            count++;
                        }
                    }
                }
            }
        }
        this.getCounter().textContent = count;
    };


    return{
        create: function(name, parent, color, todoList, isSelectAll){
            return new List(name, parent, color, todoList, isSelectAll);
        },
        addTask: this.addTask
    }
}());
