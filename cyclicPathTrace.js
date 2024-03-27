//for delay and wait
function colorpromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
async function isGraphCylicTracePath(graphcomponetMatrix, cycleresponse) {
  let [srcr, srcc] = cycleresponse;

  let visited = []; //ode visit trace;
  let dfsvisited = []; //stack visit trace;

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsvisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsvisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsvisited.push(dfsvisitedRow);
  }
  let response = await dfscycleDetectionTracePath(
    graphcomponetMatrix,
    srcr,
    srcc,
    visited,
    dfsvisited
  );
  if (response === true) return Promise.resolve(true);
  return Promise.resolve(false);
}

//coloring cell for tracking
async function dfscycleDetectionTracePath(
  graphcomponetMatrix,
  srcr,
  srcc,
  visited,
  dfsvisited
) {
  visited[srcr][srcc] = true;
  dfsvisited[srcr][srcc] = true;
  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

  cell.Style.backgroundColor = "lightblue";
  await colorpromise();

  for (
    let children = 0;
    children < graphcomponetMatrix[srcr][srcc];
    children++
  ) {
    let [nbrr, nbrc] = graphcomponetMatrix[srcr][srcc][children];
    if (visited[nbrr][nbrc] === false) {
      let response = await dfscycleDetectionTracePath(
        graphcomponetMatrix,
        nbrr,
        nbrc,
        visited,
        dfsvisited
      );

      if (response === true) {
        cell.Style.backgroundColor = "transparent";
        await colorpromise();
        return Promise.resolve(true);
      }
    } //found cycle so return immediately,no need to explore more path
    else if (visited[nbrr][nbrc] === true && dfsvisited[nbrr][nbrc] === true) {
      let cycliccell = document.querySelector(
        `.cell[rid="${srcr}"][cid="${srcc}"]`
      );

      cycliccell.Style.backgroundColor = "lightsalmon";
      await colorpromise();
      cycliccell.Style.backgroundColor = "transparent";
     
      cell.Style.backgroundColor = "transparent";
      await colorpromise();
      return Promise.resolve(true);
      // found cycle so return immediately,no need to explore more path
    }
  }
  dfsvisited[srcr][srcc] = false;
  return Promise.resolve(false);
}
