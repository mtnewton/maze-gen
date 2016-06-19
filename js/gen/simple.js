(function(mazeGen){

    var name = "Simple";
    var cells, drawQueue,  rows, cols, lastVisited;
    var DIRECTION = mazeGen.DIRECTION;
    var CELL = mazeGen.CELL;

    function generate(r, c) {
        console.log('generate('+r+','+c+')');
        var t1 = performance.now();
        rows = r;
        cols = c;
        initData();
        lastVisited = {row: 0, col:0};
        var cell, adjCell, prevCell;
        while (cell = getNewCell()){
            visit(cell[0],cell[1]);
            if(cell[0] || cell[1]){ //if not the first cell
                prevCell = randomAdjacentCell(cell[0], cell[1], true);
                connect(cell[0],cell[1],prevCell[3])
            }
            while(adjCell = randomAdjacentCell(cell[0], cell[1])){
                if(~adjCell[2] & CELL.GENERATED){
                    visit(adjCell[0],adjCell[1]);
                    connect(cell[0],cell[1],adjCell[3])
                    cell = adjCell;
                }else{
                    break;
                }
            }
        }
        var t2 = performance.now();
        console.log('generate() Took: ' + (t2 - t1).toFixed(4) + " milliseconds.");
        return drawQueue;
    }

    function initData() {
        cells = [];
        for (var r = 0; r < rows; r++) {
            cells.push(new Uint8Array(cols));
        }
        drawQueue = [];
    }

    function getNewCell(){
        for (var r = lastVisited.row; r < rows; r++) {
            lastVisited.row = r;
            for (var c = lastVisited.col; c < cols; c++) {
                lastVisited.col = c;
                if (~cells[r][c] & CELL.GENERATED){
                    return [r,c,cells[r][c]];
                }
            }
            lastVisited.col = 0;
        }
        return null;
    }

    function randomAdjacentCell(r, c, onlyReturnAGeneratedCell) {
        var directions = [DIRECTION.UP,DIRECTION.RIGHT,DIRECTION.DOWN,DIRECTION.LEFT];
        var offsets = [{row:-1,col:0}, {row:0,col:1}, {row:1,col:0}, {row:0,col:-1}];
        var choice, direction, offset, generated;
        var next = null;
        while (!next && directions.length>0){
            choice = Math.floor(Math.random() * directions.length);
            direction = directions.splice(choice, 1)[0];
            offset = offsets.splice(choice, 1)[0];
            if(isInMaze(r+offset.row,c+offset.col)) {
                generated = cells[r+offset.row][c+offset.col] & CELL.GENERATED;
                if( onlyReturnAGeneratedCell && generated){
                    next = [r + offset.row, c + offset.col, cells[r+offset.row][c+offset.col],direction];
                }else if (!onlyReturnAGeneratedCell && !generated) {
                    next = [r + offset.row, c + offset.col, cells[r+offset.row][c+offset.col],direction];
                }
            }
        }
        return next;
    }

    function isInMaze(r,c){
        return (r>=0 && r<rows && c>=0 && c<cols);
    }

    function connect(r, c, direction){
        if(direction & DIRECTION.DOWN){
            cells[r][c] |= CELL.BOTTOM;
            drawQueue.push([r, c, CELL.BOTTOM]);
        }
        if(direction & DIRECTION.RIGHT){
            cells[r][c] |= CELL.RIGHT;
            drawQueue.push([r, c, CELL.RIGHT]);

        }
        if(direction & DIRECTION.UP){
            cells[r-1][c] |= CELL.BOTTOM;
            drawQueue.push([r-1, c, CELL.BOTTOM]);

        }
        if(direction & DIRECTION.LEFT){
            cells[r][c-1] |= CELL.RIGHT;
            drawQueue.push([r, c-1, CELL.RIGHT]);

        }
    }

    function visit(r,c){
        cells[r][c] |= CELL.GENERATED;
    }

    mazeGen.register(name, generate);

})(mazeGen);
