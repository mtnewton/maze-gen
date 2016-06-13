$.material.init();
var cDebug = $('#canvas-debug').get(0);
var cOutput = $('#canvas-output').get(0);
var ctxDebug;
var ctxOutput;

var options = {
    width: $('#option-width'),
    height: $('#option-height')
};

var settings = {
    width: 100,
    height: 100
};

function generate() {
    console.log('generate()')
    validateOptions();
    updateSettings();
    initCanvas()
}

function validateOptions(){
    console.log('validateOptions()')
}

function updateSettings(){
    console.log('updateSettings()');
    settings.width = parseInt(options.width.val());
    settings.height = parseInt(options.height.val());
    console.log("Settings: " + JSON.stringify(settings));
}

function initCanvas() {
    console.log('initCanvas()');

    cDebug.width = settings.width;
    cDebug.height = settings.height;
    ctxDebug = cDebug.getContext("2d");

    cOutput.width = settings.width;
    cOutput.height = settings.height;
    ctxOutput = cOutput.getContext("2d");
}
