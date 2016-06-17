$.material.init();


var mazeGen = (function(){

    var canvas = $('#canvas-output')[0];;
    var ctx;
    var settings;
    var data, drawQueue, drawStep, timeout;
    var CELL = {
        GENERATED: 1,
        RIGHT: 2,
        BOTTOM: 4,
        SOLUTION: 8
    };
    var DIRECTION = {
        UP:1,
        RIGHT:2,
        DOWN:4,
        LEFT:8
    };
    var options = {
        rowsValue: $('#option-rows')[0],
        rowsSlider: $('#option-rows-slider')[0],
        minRows: 3,
        maxRows: 1000,
        colsValue: $('#option-cols')[0],
        colsSlider: $('#option-cols-slider')[0],
        minCols: 3,
        maxCols: 1000,
        borderValue: $('#option-border')[0],
        borderSlider: $('#option-border-slider')[0],
        minBorder: 1,
        maxBorder: 50,
        laneValue: $('#option-lane')[0],
        laneSlider: $('#option-lane-slider')[0],
        minLane: 1,
        maxLane: 50,
        lengthValue:  $('#option-length')[0],
        lengthSlider: $('#option-length-slider')[0],
        minLength: 0,
        maxLength: 60,
        generatorSelect: $('#option-generator')[0]

    };
    var defaults = {
        rows: 40,
        cols: 40,
        border: 1,
        lane: 10,
        length: 0,
        borderColor: "#000000",
        laneColor: "#FFFFFF"
    };
    var generators = [];

    function init() {
        console.log('init()');
        settings = $.extend({}, defaults);
        initSliders();
        initCanvas();
    }

    function register(name, fn){
        console.log('register()');
        generators.push([name, fn]);
        initGeneratorSelect();
    }

    function initGeneratorSelect(){
        console.log('initGeneratorSelect()');
        var selectOptions = "";
        for(var i=0; i<generators.length; i++){
            selectOptions+="<option value='"+i+"'>"+generators[i][0]+"</option>";
        }
        options.generatorSelect.innerHTML = selectOptions;
        options.generatorSelect.disabled = false;
    }

    function generate() {
        console.log('generate()');
        window.clearTimeout(timeout);
        validateOptions();
        updateSettings();
        initData();
        initCanvas();
        var results = callGenerator(data);
        data = results[0];
        drawQueue = results[1];

        ctx.fillStyle = settings.borderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = settings.laneColor;

        var t1 = performance.now();
        if(settings.length > 0){
            playback()
        }else{
            render();
        }
        var t2 = performance.now();
        console.log('playback() Took: ' + (t2 - t1).toFixed(4) + " milliseconds.");
    }

    function callGenerator(cells){
        console.log('callGenerator()');
        var selectedIndex = options.generatorSelect.selectedIndex;
        var generatorFunction = generators[selectedIndex][1];
        return generatorFunction(cells, drawQueue);
    }

    function initSliders() {
        console.log('initSliders()');
        var sliders = [
            //Text Input Element  //Slider Element      //Starting Value //Min Value        //Max Value
            [options.rowsValue,   options.rowsSlider,   settings.rows,   options.minRows,   options.maxRows],
            [options.colsValue,   options.colsSlider,   settings.cols,   options.minCols,   options.maxCols],
            [options.borderValue, options.borderSlider, settings.border, options.minBorder, options.maxBorder],
            [options.laneValue,   options.laneSlider,   settings.lane,   options.minLane,   options.maxLane],
            [options.lengthValue, options.lengthSlider, settings.length, options.minLength, options.maxLength]
        ];
        for (var g = 0; g < sliders.length; g++) {
            noUiSlider.create(sliders[g][1], {
                start: sliders[g][2],
                step: 1,
                connect: "lower",
                range: {
                    'min': sliders[g][3],
                    '50%': Math.round(sliders[g][4] / 5),
                    '90%': Math.round(sliders[g][4] / 2),
                    'max': sliders[g][4]
                },
                format: {
                    to: function (value) {
                        return Math.round(value);
                    },
                    from: function (value) {
                        return value;
                    }
                }
            });
            //Set the text input to the slider value on update.
            sliders[g][1].noUiSlider.on('update', (function (g) {
                return function (values, handle) {
                    sliders[g][0].value = values[handle];
                }
            })(g));
            //Set the slider value to text input when input is changed,
            sliders[g][0].addEventListener('change', (function (g) {
                return function () {
                    sliders[g][1].noUiSlider.set(this.value);
                }
            })(g));
        }
    }

    function initData() {
        console.log('initData()');
        data = new Array(settings.rows);
        for (var r = 0; r < settings.rows; r++) {
            data[r] = new Uint8Array(settings.cols);
        }
        drawQueue = [];
        drawStep = 0;
    }

    function validateOptions() {
        console.log('validateOptions()')
    }

    function updateSettings() {
        console.log('updateSettings()');
        settings.rows = parseInt(options.rowsValue.value);
        settings.cols = parseInt(options.colsValue.value);
        settings.border = parseInt(options.borderValue.value);
        settings.lane = parseInt(options.laneValue.value);
        settings.length = parseInt(options.lengthValue.value);
        console.log("Settings: " + JSON.stringify(settings));
    }

    function initCanvas() {
        console.log('initCanvas()');
        canvas.width = (settings.cols * (settings.lane + settings.border)) + settings.border;
        canvas.height = (settings.rows * (settings.lane + settings.border)) + settings.border;
        ctx = canvas.getContext("2d");
    }

    function render(){
        for(var step=0; step<drawQueue.length; step++){
            draw();
        }
    }

    function playback() {
        draw();
        if(drawStep < drawQueue.length) {
            timeout = window.setTimeout(playback, 10);
        }
    }

    function draw() {
        var step = drawQueue[drawStep++];
        switch(step[2]){
            case CELL.BOTTOM:
                ctx.fillRect(
                    step[1] * (settings.border + settings.lane) + settings.border,
                    step[0] * (settings.border + settings.lane) + settings.border,
                    settings.lane,
                    settings.lane * 2 + settings.border
            );
                break;
            case CELL.RIGHT:
                ctx.fillRect(
                    step[1] * (settings.border + settings.lane) + settings.border,
                    step[0] * (settings.border + settings.lane) + settings.border,
                    settings.lane * 2 + settings.border,
                    settings.lane
                );
                break;
        }
    }

    init();

    return {
        generate: generate,
        register: register,
        CELL: CELL,
        DIRECTION: DIRECTION
    };
})();