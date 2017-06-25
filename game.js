window.onload = function() {
    /************ config ******************************************/
    var QUEEN_LIFESPAN = 100;
    var WORKER_LIFESPAN = 75;
    var DRONE_LIFESPAN = 50;
    var QUEEN_HIT_POINTS = 8;
    var WORKER_HIT_POINTS = 10;
    var DRONE_HIT_POINTS = 12;
    var DRONE_NUMBERS = 8;
    var WORKER_NUMBERS = 5;




    /************ Bee Class ******************************************/
    function Bee() {
        this.life = ko.observable(this.lifespan);
        this.dead = ko.observable(false);
    }

    Bee.prototype.getHit = function() {
        this.life(this.life() - this.hitPoints);
        this.dead(this.life() < 1);
        return this;
    }

    Bee.prototype.kill = function() {
        this.dead(true);
        return this;
    }


    /************ Queen Class ******************************************/
    function Queen() {

        Bee.call(this);

        this.workers = ko.observableArray([])
        for(var i=0; i<WORKER_NUMBERS; i++){
            this.workers.push(new Worker());
        }

        this.drones = ko.observableArray([])
        for(var i=0; i<DRONE_NUMBERS; i++){
            this.drones.push(new Drone());
        }

    }
    Queen.prototype = Object.create(Bee.prototype);
    Queen.prototype.constructor = Queen;
    Queen.prototype.lifespan = QUEEN_LIFESPAN;
    Queen.prototype.hitPoints = QUEEN_HIT_POINTS;

    Queen.prototype.getHit = function() {
        //call superclass
        //if dead
        //all bees are dead
        if(!this.dead()){
            Object.getPrototypeOf(Queen.prototype).getHit.call(this);
        }
        else {
            for(var i=0; i<this.workers().length; i++){
                this.workers()[i].kill();
            }
            for(var i=0; i<this.drones().length; i++){
                this.drones()[i].kill();
            }
        }
    }

    Queen.prototype.swat = function() {
        var swatArray = [];
        var count = 0;
        var choice = -1;
        swatArray.push(this);
        count++;
        for(var i=0; i<this.workers().length; i++){
            var worker = this.workers()[i]
            if(!worker.dead()){
                swatArray.push(worker);
                count++;
            }
        }
        for(var i=0; i<this.drones().length; i++){
            var drone = this.drones()[i]
            if(!drone.dead()){
                swatArray.push(drone);
                count++;
            }
        }
        choice = Math.floor(Math.random() * count);
        swatArray[choice].getHit();
    }

    /************ Worker Class ******************************************/
    function Worker() {
        Bee.call(this);

    }
    Worker.prototype = Object.create(Bee.prototype);
    Worker.prototype.constructor = Worker;
    Worker.prototype.lifespan = WORKER_LIFESPAN;
    Worker.prototype.hitPoints = WORKER_HIT_POINTS;

    /************ Drone Class ******************************************/
    function Drone() {
        Bee.call(this);
    }
    Drone.prototype = Object.create(Bee.prototype);
    Drone.prototype.constructor = Drone;
    Drone.prototype.lifespan = DRONE_LIFESPAN;
    Drone.prototype.hitPoints = DRONE_HIT_POINTS;
    

    /**************** Game ***********************************************/
    function GameViewModel() {
        var self = this;
        self.game = ko.observable(new Queen());

    };
    var gameViewModel = new GameViewModel();
    ko.applyBindings(gameViewModel);


    /**************** Listeners ***********************************************/
    var btnSwat = document.getElementById('btnSwat');
    btnSwat.addEventListener('click', function(){
        gameViewModel.game().swat();
    });


    var btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click', function(){
        gameViewModel.game(new Queen());
    });

}