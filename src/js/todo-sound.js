let todoSound = (function(todoApp, element){
    let sounds = ['alarmed', 'completed', 'deleted', 'deletedAll', 'date', 'dueDated', 'addNew', 'addNewList', 'pencil'];
    function Sound(element){
        let _element = element;
        let _action =  '';

        this.getElement = function () {
            return _element;
        }
    }
    Sound.prototype.chooseSound = function (action) {
        switch (action) {
            case 'alarmed':
                this.changeSound(sounds[0]);
                break;
            case 'completed':
                this.changeSound(sounds[1]);
                break;
            case 'deleted':
                this.changeSound(sounds[2]);
                break;
            case 'deletedAll':
                this.changeSound(sounds[3]);
                break;
            case 'date':
                this.changeSound(sounds[4]);
                break;
            case 'dueDated':
                this.changeSound(sounds[5]);
                break;
            case 'addNew':
                this.changeSound(sounds[6]);
                break;
            case 'addNewList':
                this.changeSound(sounds[7]);
                break;
            case 'pencil':
                this.changeSound(sounds[8]);
                break;
            case 'stop':
                this.getElement().src = '';
                break;
            default:
        }
    }
    Sound.prototype.changeSound = function (sound) {
        this.getElement().src = `sounds/${sound}.mp3`;
    }
    return{
        create: function(todoApp, element){
            return new Sound(todoApp, element)
        },
    }
}());
