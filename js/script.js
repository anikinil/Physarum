
// SETUP //////////////////////////////////

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});


// CELL OBJECT //////////////////////////////////////////////

var cellRadius = 5;

class Cell {

    constructor(size, connections, energy, oscillates) {
        this.size = size;
        this.connections = connections;
        this.energy = energy;
        this.oscillates = oscillates;
    }
}


// DRAW FIELD ////////////////////////////////////////

var pointRadius = 1;
var pointsDist = 20;

var fieldNumX = parseInt(window.innerWidth/pointsDist);
var fieldNumY = parseInt(window.innerHeight/pointsDist);


function drawField() {
    
    for (var x = 0; x < fieldNumX; x++) {
        for (var y = 0; y < fieldNumY; y++) {
            
            ctx.beginPath();
            ctx.fillStyle = '#c8c8c8';
            
            ctx.arc(x * pointsDist, y * pointsDist, pointRadius, 0, 2 * Math.PI);
            
            ctx.fill();
            ctx.closePath();
        }
    }
}


// UPDATE FIELDARR ////////////////////////////////

var fieldArr = new Array(fieldNumX);

for (x = 0; x < fieldNumX; x++) {
    fieldArr[x] = new Array(fieldNumY);
}

fieldArr[parseInt(fieldNumX * 0.5)][parseInt(fieldNumY * 0.5)] = new Cell(350, [false, false, false, false, false, false, false, false], 350, false);



function updateFieldArr() {
    
    var tempFieldArr = new Array(fieldNumX);
    
    for (x = 0; x < fieldNumX; x++) { 
        tempFieldArr[x] = new Array(fieldNumY);
    }
    
    tempFieldArr = fieldArr;
    
    function createNewCell(x, y) {
        
        var freeNeighbSpots = [];
        
        if (fieldArr[x-1][y-1] === undefined) { freeNeighbSpots.push(0); }  // get connection indexes of free neighb spots and save them in an array
        if (fieldArr[x][y-1] === undefined) { freeNeighbSpots.push(1); }
        if (fieldArr[x+1][y-1] === undefined) { freeNeighbSpots.push(2); }
        if (fieldArr[x-1][y] === undefined) { freeNeighbSpots.push(3); }
        if (fieldArr[x+1][y] === undefined) { freeNeighbSpots.push(4); }
        if (fieldArr[x-1][y+1] === undefined) { freeNeighbSpots.push(5); }
        if (fieldArr[x][y+1] === undefined) { freeNeighbSpots.push(6); }
        if (fieldArr[x+1][y+1] === undefined) { freeNeighbSpots.push(7); }
        
        var randPos = Math.floor(Math.random() * freeNeighbSpots.length); // get random index from array
        console.log(freeNeighbSpots[randPos]);

        
        if (freeNeighbSpots[randPos] == 0) { tempFieldArr[x][y].connections[0] = true; tempFieldArr[x-1][y-1] = new Cell(10, [false, false, false, false, false, false, false, true], 10, false); } // create a new cell on the neighb spot picked randomly
        if (freeNeighbSpots[randPos] == 1) { tempFieldArr[x][y].connections[1] = true; tempFieldArr[x][y-1] = new Cell(10, [false, false, false, false, false, false, true, false], 10, false); }
        if (freeNeighbSpots[randPos] == 2) { tempFieldArr[x][y].connections[2] = true; tempFieldArr[x+1][y-1] = new Cell(10, [false, false, false, false, false, true, false, false], 10, false); }
        if (freeNeighbSpots[randPos] == 3) { tempFieldArr[x][y].connections[3] = true; tempFieldArr[x-1][y] = new Cell(10, [false, false, false, false, true, false, false, false], 10, false); }
        if (freeNeighbSpots[randPos] == 4) { tempFieldArr[x][y].connections[4] = true; tempFieldArr[x+1][y] = new Cell(10, [false, false, false, true, false, false, false, false], 10, false); }
        if (freeNeighbSpots[randPos] == 5) { tempFieldArr[x][y].connections[5] = true; tempFieldArr[x-1][y+1] = new Cell(10, [false, false, true, false, false, false, false, false], 10, false); }
        if (freeNeighbSpots[randPos] == 6) { tempFieldArr[x][y].connections[6] = true; tempFieldArr[x][y+1] = new Cell(10, [false, true, false, false, false, false, false, false], 10, false); }
        if (freeNeighbSpots[randPos] == 7) { tempFieldArr[x][y].connections[7] = true; tempFieldArr[x+1][y+1] = new Cell(10, [true, false, false, false, false, false, false, false], 10, false); }
        
        tempFieldArr[x][y].energy = fieldArr[x][y].energy - 10; // substract energy for creation of the new cell from the old one
    }
    
    for (x = 1; x < fieldNumX - 1; x++) {
        for (y = 1; y < fieldNumY - 1; y++) {

            if (fieldArr[x][y] !== undefined) { // if there is a cell on the given spot (and its ot an edge)
                
                if (fieldArr[x][y].energy >= 10) { // if the cell >= 10 energy
                    
                    if (fieldArr[x][y].connections.includes(true)) { // if the cell has connections

                        var r0 = 0; var r1 = 0; var r2 = 0; var r3 = 0; var r4 = 0; var r5 = 0; var r6 = 0; var r7 = 0;

                        for (i = 0; i < 8; i++) { // for all neighb spots

                            if (fieldArr[x][y].connections[i] == true) { // if there is a connection to given spot
                        
                                switch (i) { // pick the correct cell from fieldArr and save its energy requirement as rx

                                    case 0: 
                                        r0 = fieldArr[x-1][y-1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 1: 
                                        r1 = fieldArr[x][y-1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 2: 
                                        r2 = fieldArr[x+1][y-1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 3: 
                                        r3 = fieldArr[x-1][y].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 4: 
                                        r4 = fieldArr[x+1][y].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 5: 
                                        r5 = fieldArr[x-1][y+1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 6: 
                                        r6 = fieldArr[x][y+1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                    
                                    case 7: 
                                        r7 = fieldArr[x+1][y+1].size - fieldArr[x-1][y-1].energy;
                                    break;
                                }
                            }

                            var reqEnTotal = r0 + r1 + r2 + r3 + r4 + r5 + r6 + r7; // total of required energy
                            
                            var reqEnArr = [r0, r1, r2, r3, r4, r5, r6, r7];

                            while (reqEnTotal > fieldArr[x][y].energy) { // if more requiered than the cell has
                                
                                var largest = reqEnArr[0]; // finding largest value in reqEnArr
                                
                                for (i = 0; i < reqEnArr.length; i++) {
                                    
                                    if (reqEnArr[i] > largest) {
                                        largest = reqEnArr[i];
                                    } 
                                }
                                
                                for (i = 0; i < 8; i++) { // getting the index of the largest value and setting it to 0
                                    
                                    if (reqEnArr[i] == largest) {
                                        reqEnArr[i] = 0;
                                        break;
                                    }
                                }
                            }
                            
                            reqEnTotal = 0; // calculating new total of required energy
                            
                            for (i = 0; i < 8; i ++) {
                                reqEnTotal += reqEnArr[i];
                            }

                            if (reqEnTotal == 0) {
                                createNewCell(x, y);
                            }

                            tempFieldArr[x][y].energy -= reqEnTotal; //subtract the required energy from the given cell in tempFieldArr

                            for (i = 0; i < 8; i++) { // for all neighb spots

                                if (reqEnArr[i] > 0) { // if required energy by that neighbor is larger than 0
                            
                                    switch (i) { // add the required energy to the given cell in tempFieldArr
        
                                        case 0: 
                                            tempFieldArr[x-1][y-1].energy += reqEnArr[0];
                                        break;
                                        
                                        case 1: 
                                            tempFieldArr[x][y-1].energy += reqEnArr[1];
                                        break;
                                        
                                        case 2: 
                                            tempFieldArr[x+1][y-1].energy += reqEnArr[2];
                                        break;
                                        
                                        case 3: 
                                            tempFieldArr[x-1][y].energy += reqEnArr[3];
                                        break;
                                        
                                        case 4: 
                                            tempFieldArr[x+1][y].energy += reqEnArr[4];
                                        break;
                                        
                                        case 5: 
                                            tempFieldArr[x-1][y+1].energy += reqEnArr[5];
                                        break;
                                        
                                        case 6: 
                                            tempFieldArr[x][y+1].energy += reqEnArr[6];
                                        break;
                                        
                                        case 7: 
                                            tempFieldArr[x+1][y+1].energy += reqEnArr[7];
                                        break;
                                    }
                                }
                            }
                        }

                    } else { // if the cell has no connections, but does have >= 10 energy
                        createNewCell(x, y);
                    }
                }
            }
        }
    }

    fieldArr = tempFieldArr;
}


function drawFieldArr() {

    for (x = 0; x < fieldNumX; x++) {
        for (y = 0; y < fieldNumY; y++) {

            if (fieldArr[x][y] !== undefined) {
                
                ctx.beginPath();
                ctx.fillStyle = '#ffcc00';
                
                ctx.arc(x * pointsDist, y * pointsDist, cellRadius, 0, 2 * Math.PI);
                
                ctx.fill();
                ctx.closePath();

                var tempConnArr = fieldArr[x][y].connections;

                ctx.strokeStyle = '#ffcc00';
                ctx.lineWidth = 3;

                for (i = 0; i < tempConnArr.length; i++) {

                    if (tempConnArr[i] == true) {

                        switch (i) {

                            case 0:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x - 0.5) * pointsDist, (y - 0.5) * pointsDist);
                                ctx.stroke();
                            break;

                            case 1:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo(x * pointsDist, (y - 0.5) * pointsDist);
                                ctx.stroke();
                            break;

                            case 2:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x + 0.5) * pointsDist, (y - 0.5) * pointsDist);
                                ctx.stroke();
                            break;

                            case 3:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x - 0.5) * pointsDist, y * pointsDist);
                                ctx.stroke();
                            break;

                            case 4:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x + 0.5) * pointsDist, y * pointsDist);
                                ctx.stroke();
                            break;

                            case 5:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x - 0.5) * pointsDist, (y + 0.5) * pointsDist);
                                ctx.stroke();
                            break;

                            case 6:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo(x * pointsDist, (y + 0.5) * pointsDist);
                                ctx.stroke();
                            break;

                            case 7:
                                ctx.beginPath();
                                ctx.moveTo(x * pointsDist, y * pointsDist);
                                ctx.lineTo((x + 0.5) * pointsDist, (y + 0.5) * pointsDist);
                                ctx.stroke();
                            break;
                        }
                    }
                }
            }
        }
    }
}


// ANIMATION LOOP /////////////////////////////

var delay = 300;

function animate() {
    
    setTimeout(function() {
        
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawField();
        updateFieldArr();
        drawFieldArr();

    }, delay);
}

animate();