//storage->2d matrix(basic needed)
let collectedGraphComponent=[];
 let graphcomponetMatrix=[];

// for(let i=0;i<rows;i++){
//     let row=[];

//     for(let j=0;j<cols;j++){
//         //why array->more than 1 child relation
//         row.push([]);
//     }
//     graphcomponetMatrix.push(row);
// }
// True->cycle , false->Not cyclic
function isGrapgCylic(graphcomponetMatrix){
    //Dependency->visited ,dfsvisited(2D array) 
    let visited=[];
    let dfsvisited=[];

    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsvisitedRow=[];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsvisitedRow.push(false); 
            
        }
        visited.push(visitedRow);
        dfsvisited.push(dfsvisitedRow);
    } 

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(visited[i][j]==false){
                let response=dfscycleDetection(graphcomponetMatrix,i,j,visited,dfsvisited);
                if(response==true)return [i,j];
            }
        }
    } 
    return null;
}
//start->visited(true) dfsvisited(true)
//end->dfsvis(false)
//if vis[i][j]->already explored path,so go back no use to explore again.
//cycle detection condition-> if (vis[i][j]==true && dfsvis[i][j]==true)->cycle;
function dfscycleDetection(graphcomponetMatrix,srcr,srcc,visited,dfsvisited){
    visited[srcr][srcc]=true;
    dfsvisited[srcr][srcc]=true;
//A1->[[0,1],[1,0],[5,10],......]
//return ->true,false
for(let children=0;children<graphcomponetMatrix[srcr][srcc];children++){
    let[nbrr,nbrc]=graphcomponetMatrix[srcr][srcc][children];
    if(visited[nbrr][nbrc]===false){
       let response= dfscycleDetection(graphcomponetMatrix,nbrr,nbrc,visited,dfsvisited)

       if(response==true)return true;//found cycle so return immediately,no need to explore more path
    }
    else if(visited[nbrr][nbrc]===true && dfsvisited[nbrr][nbrc]===true)
    {
        return true;
        // found cycle so return immediately,no need to explore more path
    }
}
dfsvisited[srcr][srcc]=false;
return false;
    
}