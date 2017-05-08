
let todoTask = (function(name, parent, id, date, dueDate, isNew, isDelete, completed){

    function Task (name, parent, id, date, dueDate, isNew, isDelete, completed){
        if (!name || name === '') {
            return new Error('Please supply name');
        }
        if (!parent || (parent.constructor.name != 'List')) {
            return new Error('Please supply ToDo List');
        }
        todoAbstract.call(this, name, parent);

        let _id = id || +new Date();
        let _title = name;
        let _date = _id;
        let _dueDate = dueDate || false;
        let _isNew = isNew || true;
        let _isDelete = isDelete || false;
        let _completed = completed || false;
        let _$section = '';
        let _$ul = '';

        this.getId = function (){
            return _id;
        }

        this.getTitle = function (){
            return _title;
        }

        this.setTitle = function (title){
            if(typeof title === 'string' && title != ''){
                _title = title;
            }
        }

        this.getDate = function (){
            return _date;
        }

        this.getDueDate = function (){
            return _dueDate;
        }

        this.setDueDate = function (date){
            // if(typeof title === 'string' && title != ''){
                _dueDate = date;
            // }
        }

        this.getIsNew = function (){
            return _isNew;
        }

        this.setIsNew = function (is){
            // if(typeof is === 'boolean'){
                _isNew = is;
            // }
        }

        this.getIsDelete  = function (){
            return _isDelete;
        }

        this.setIsDelete  = function (is){
            if(typeof is === 'boolean'){
                _isDelete = is;
            }
        }

        this.getIsCompleted  = function (){
            return _completed;
        }

        this.setIsCompleted  = function (is){
            if(typeof is === 'boolean'){
                _completed = is;
            }
        }

        this.getUl = function (){
            return _$ul;
        }

        this.setUl = function (ul){
            _$ul = ul;
        }

        this.getSection = function (){
            return _$section;
        }

        this.setSection = function (section){
            _$section = section;
        }
        if(id){
            this.setIsNew(false);
        } else {
            _isNew = true;
        }
        this.createNew();
    }
    Task.prototype = Object.create(todoAbstract.prototype);
    Task.prototype.constructor = Task;

    Task.prototype.createNew = function () {

        let $section = document.getElementById(this.getParent().getParent());
        let $ul = $section.querySelector('.todo-list')

        this.setSection($section);
        this.setUl($ul);

        let $li = this.createElement();

        this.getUl().appendChild($li);
    }

    Task.prototype.deleteUl = function () {

        while(this.getUl().firstChild){
            this.getUl().removeChild(this.getUl().firstChild);
        }
    };

    Task.prototype.createElement = function () {

            let now = +new Date();
            let _$audio = document.querySelector('#audio');
            let sound = todoSound.create(_$audio);

            let $li = document.createElement('li');
            $li.setAttribute('data-id', this.getId());
            if (this.getIsNew()){
                $li.setAttribute('class', 'new-item');
            }
            if (this.getIsCompleted()) {
                $li.setAttribute('class', 'completed');
            }

            let $div = document.createElement('div');
            $div.setAttribute('class', 'list-item');

            let $checkbox = document.createElement('span');
            $checkbox.setAttribute('class', 'checkbox');

            let $label = document.createElement('label');

            let $text = document.createTextNode(this.getTitle());

            let $date = document.createElement('span');
            $date.setAttribute('class', 'date');

            let $delete = document.createElement('span');
            $delete.setAttribute('class', 'delete');

            if ((this.getDueDate() - now >= Task.prototype.twoHours) && (this.getDueDate() !== 0)){
                let $spanDate = document.createElement('span');
                $spanDate.setAttribute("class", "alarm");
                $div.appendChild($spanDate);
            }

            if((this.getDueDate() - now <= Task.prototype.twoHours - 10000) && (this.getDueDate() !== false)){
                let $spanDate = document.createElement('span');
                $spanDate.setAttribute("class", "isDue");
                $div.appendChild($spanDate);

                if((this.getDueDate() - now >= Task.prototype.twoHours - 50000) ){
                    sound.chooseSound('dueDated');
                    Task.makeNotrification(this.getTitle());
                }
            }
            $div.appendChild($checkbox);
            $div.appendChild($label);
            $div.appendChild($date);
            $div.appendChild($delete);

            $label.appendChild($text);

            $li.appendChild($div);

            return $li;
    }
    Task.makeNotrification = function (todoTask) {

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        else if (Notification.permission === "granted") {

            let notification = new Notification(`You have task: ${todoTask} with due date now.`);
        }

        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    let notification = new Notification(`You have task: ${todoTask} with due date now.`);
                }
            });
        }
    };
    Task.prototype.makeJsonObj = function (obj) {

        let jsonObj = {
            "id": obj.getId(),
            "title": obj.getName(),
            "date": obj.getDate(),
            "dueDate": obj.getDueDate(),
            "isNew": obj.getIsNew(),
            "isCompleted": obj.getIsCompleted(),
            "isDelete": obj.getIsDelete(),
            "parent": obj.getParent(),
        }
        return jsonObj;
    }
    return{
        create: function(name, parent, id, date, dueDate, isNew, isDelete, isCompleted){
            return new Task(name, parent, id, date, dueDate, isNew, isDelete, isCompleted)
        }
    }
}());
