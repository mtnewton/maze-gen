(function(mazeGen){

    var name = "Simple";
    var cells, rows, cols, lastVisited;
    var DIRECTION = mazeGen.DIRECTION;
    var CELL = mazeGen.CELL;

    function generate(data) {
        console.log('generate()');
        var t1 = performance.now();
        cells = data;
        rows = cells.length;
        cols = cells[0].length;
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
        console.log('calculate() Took: ' + (t2 - t1).toFixed(4) + " milliseconds.");
        return cells;
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
        var options = [DIRECTION.UP,DIRECTION.RIGHT,DIRECTION.DOWN,DIRECTION.LEFT];
        var choice, direction;
        var next = null;

        while (!next){
            choice = Math.floor(Math.random() * options.length);
            direction = options[choice];
            options.splice(choice, 1);
            if((direction & DIRECTION.LEFT) && isInMaze(r,c-1)){
                if(onlyReturnAGeneratedCell && (~cells[r][c-1] & CELL.GENERATED)){
                    continue;
                }
                next = [r,c-1,cells[r][c-1], DIRECTION.LEFT];
            } else if((direction & DIRECTION.RIGHT) && isInMaze(r,c+1)){
                if(onlyReturnAGeneratedCell && (~cells[r][c+1] & CELL.GENERATED)){
                    continue;
                }
                next = [r,c+1,cells[r][c+1], DIRECTION.RIGHT];
            } else if((direction & DIRECTION.UP) && isInMaze(r-1,c)){
                if(onlyReturnAGeneratedCell && (~cells[r-1][c] & CELL.GENERATED)){
                    continue;
                }
                next = [r-1,c,cells[r-1][c], DIRECTION.UP];
            } else if((direction & DIRECTION.DOWN) && isInMaze(r+1,c)){
                if(onlyReturnAGeneratedCell && (~cells[r+1][c] & CELL.GENERATED)){
                    continue;
                }
                next = [r+1,c,cells[r+1][c], DIRECTION.DOWN];
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
        }
        if(direction & DIRECTION.RIGHT){
            cells[r][c] |= CELL.RIGHT;
        }
        if(direction & DIRECTION.UP){
            cells[r-1][c] |= CELL.BOTTOM;
        }
        if(direction & DIRECTION.LEFT){
            cells[r][c-1] |= CELL.RIGHT;
        }
    }

    function visit(r,c){
        cells[r][c] |= CELL.GENERATED;
    }

    mazeGen.register(name, generate);

})(mazeGen);
