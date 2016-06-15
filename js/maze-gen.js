$.material.init();
var canvas = $('#canvas-output')[0];
var ctx;
var settings;
var data;
var CELL = {
    GENERATED: 1,
    RIGHT: 2,
    BOTTOM: 4,
    SOLUTION: 8
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
    maxLength: 60

};
var defaults = {
    rows: 40,
    cols: 40,
    border: 1,
    lane: 10,
    length:0
};

function pageLoad() {
    console.log('pageLoad()');
    settings = $.extend({}, defaults);
    initSliders();
    initCanvas();
}

function generate() {
    console.log('generate()');
    validateOptions();
    updateSettings();
    initData();
    initCanvas();
    renderDebug();
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

    //fill with random data for now
    for (var r = 0; r < settings.rows; r++) {
        for (var c = 0; c < settings.cols; c++) {
            data[r][c] = ( Math.floor(Math.random() * 3 ) << 1 ) + 1;
        }
    }
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
    console.log("Settings: " + JSON.stringify(settings));
}

function initCanvas() {
    console.log('initCanvas()');
    canvas.width = (settings.cols * (settings.lane + settings.border)) + settings.border;
    canvas.height = (settings.rows * (settings.lane + settings.border)) + settings.border;
    ctx = canvas.getContext("2d");
}

function renderDebug() {
    console.log('renderDebug()');
    var t1 = performance.now();
    var value;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    for (var r = 0; r < settings.rows; r++) {
        for (var c = 0; c < settings.cols; c++) {
            value = data[r][c];
            if (value & CELL.GENERATED) {
                //right
                if ((c < settings.cols - 1) && (value & CELL.RIGHT)) {
                    ctx.fillRect(
                        c * (settings.border + settings.lane) + settings.border,
                        r * (settings.border + settings.lane) + settings.border,
                        (settings.border + settings.lane),
                        settings.lane
                    );
                }
                //bottom
                if ((r < settings.rows - 1) && (value & CELL.BOTTOM)) {
                    ctx.fillRect(
                        c * (settings.border + settings.lane) + settings.border,
                        r * (settings.border + settings.lane) + settings.border,
                        settings.lane,
                        (settings.border + settings.lane)
                    );
                }
            }
        }
    }
    ctx.restore();
    var t2 = performance.now()
    console.log('renderDebug() Took: ' + (t2 - t1).toFixed(4) + " milliseconds.");
}
