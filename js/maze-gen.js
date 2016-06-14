$.material.init();
var cDebug = $('#canvas-debug')[0];
var cOutput = $('#canvas-output')[0];
var ctxDebug;
var ctxOutput;
var settings;
var data;
var CELL = {
    GENERATED: 1,
    RIGHT: 2,
    BOTTOM: 4,
    SOLUTION: 8
};
var options = {
    rows: $('#option-rows')[0],
    rowsSlider: $('#option-rows-slider')[0],
    minRows: 3,
    maxRows: 1000,
    cols: $('#option-cols')[0],
    colsSlider: $('#option-cols-slider')[0],
    minCols: 3,
    maxCols: 1000
};
var defaults = {
    rows: 20,
    cols: 20
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
        [options.rows, options.rowsSlider, settings.rows, options.minRows, options.maxRows],
        [options.cols, options.colsSlider, settings.cols, options.minCols, options.maxCols]
    ];
    for (var g = 0; g < sliders.length; g++) {
        noUiSlider.create(sliders[g][1], {
            start: sliders[g][2],
            step: 1,
            connect: "lower",
            range: {
                'min': 3,
                '50%': Math.round(sliders[g][4] / 10),
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
        sliders[g][1].noUiSlider.on('update', (function (g) {
            return function (values, handle) {
                sliders[g][0].value = values[handle];
            }
        })(g));
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
            data[r][c] = ( Math.floor(Math.random() * 4) << 1 ) + 1;
        }
    }
}

function validateOptions() {
    console.log('validateOptions()')
}

function updateSettings() {
    console.log('updateSettings()');
    settings.rows = parseInt(options.rows.value);
    settings.cols = parseInt(options.cols.value);
    console.log("Settings: " + JSON.stringify(settings));
}

function initCanvas() {
    console.log('initCanvas()');

    cDebug.width = (settings.cols * 2) + 1;
    cDebug.height = (settings.rows * 2) + 1;
    ctxDebug = cDebug.getContext("2d");

    cOutput.width = (settings.cols * 2) + 1;
    cOutput.height = (settings.rows * 2) + 1;
    ctxOutput = cOutput.getContext("2d");
}

function renderDebug() {
    console.log('renderDebug()');
    var t1 = performance.now();
    var value;
    ctxDebug.fillRect(0, 0, ctxDebug.canvas.width, ctxDebug.canvas.height);
    ctxDebug.save();
    ctxDebug.fillStyle = "#FFFFFF";
    for (var r = 0; r < settings.rows; r++) {
        for (var c = 0; c < settings.cols; c++) {
            value = data[r][c];
            if (value & CELL.GENERATED) {
                //right
                if ((c < settings.cols - 1) && (value & CELL.RIGHT)) {
                    ctxDebug.fillRect(c * 2 + 1, r * 2 + 1, 2, 1)
                }
                //bottom
                if ((r < settings.rows - 1) && (value & CELL.BOTTOM)) {
                    ctxDebug.fillRect(c * 2 + 1, r * 2 + 1, 1, 2)
                }
            }
        }
    }
    ctxDebug.restore();
    var t2 = performance.now()
    console.log('renderDebug() Took: ' + (t2 - t1).toFixed(4) + " milliseconds.");
}
