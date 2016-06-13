$.material.init();
var cDebug = $('#canvas-debug').get(0);
var cOutput = $('#canvas-output').get(0);
var ctxDebug;
var ctxOutput;

var options = {
    rows: $('#option-rows')[0],
    rowsSlider: $('#option-rows-slider')[0],
    cols: $('#option-cols')[0],
    colsSlider: $('#option-cols-slider')[0]
};

var defaults = {
    rows: 20,
    cols: 20
};

var settings = $.extend({},defaults);

function pageLoad() {
    var groups = [
        [options.rows, options.rowsSlider, settings.rows],
        [options.cols, options.colsSlider, settings.cols]
    ];
    for (var g = 0; g < groups.length; g++) {
        noUiSlider.create(groups[g][1], {
            start: groups[g][2],
            step: 1,
            connect: "lower",
            range: {
                'min': 4,
                '50%': 100,
                '90%': 500,
                'max': 1000
            },
            format: {
                to: function ( value ) {
                    return Math.round(value);
                },
                from: function ( value ) {
                    return value;
                }
            }
        });
        groups[g][1].noUiSlider.on('update', (function (g) {
            return function (values, handle) {
                groups[g][0].value = values[handle];
            }
        })(g));
        groups[g][0].addEventListener('change', (function (g) {
            return function () {
                groups[g][1].noUiSlider.set(this.value);
            }
        })(g));
    }
    initCanvas();
}

function generate() {
    console.log('generate()')
    validateOptions();
    updateSettings();
    initCanvas();
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

    cDebug.width = settings.cols;
    cDebug.height = settings.rows;
    ctxDebug = cDebug.getContext("2d");

    cOutput.width = settings.cols;
    cOutput.height = settings.rows;
    ctxOutput = cOutput.getContext("2d");
}
