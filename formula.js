for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;


      if(enteredData===cellProp.value) return;
      cellProp.value = enteredData;
      // if data modified remove p-c relation,formula empty,update children with new hardcoded (modified)value
      removeChildFromParent(cellProp.formula);
      cellProp.formula="";
      updateChildrenCells(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    
    //if change in formula,break old p-c relation,evaluate new formula,add new p-c formula
    let address=addressBar.value;
    let [cell,cellProp]=getCellAndCellProp(address);
    if(inputFormula!==cellProp.formula) removeChildFromParent(cellProp.formula);

    addchildToGraphComponent(inputFormula,address);

    //check formula is cyclic or not,then only evaluate
    //True->cycle,false->Not cyclic
    let cycleresponse=isGrapgCylic(graphcomponetMatrix);
    if(cycleresponse){
      //alert("Your formula is cyclic");
      let response=confirm("Your formula is cyclic.Do you want to trace your path?");
      while(response===true){
        ///keep on tracking color until users is satisfied;
         await isGraphCylicTracePath(graphcomponetMatrix,cycleresponse);//i want to complete full teration of color tracking,so i will attach wait.
        response=confirm("Your formula is cyclic.Do you want to trace your path?");

      }

      removeChildFromGraphComponent(inputFormula,address);
      return;
    }

    let evaluatedValue=evaluateFormula(inputFormula);

    // To update UI and cellProp in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);
    //console.log(sheetDB);
    updateChildrenCells(address);
  }
});

function addchildToGraphComponent(formula,childaddress){
  let[crid,ccid]=decodeRIDCIDFromAddress(childaddress);
  let encodedFormula=formula.split(" ");
  for(let i=0;i<encodedFormula.length;i++){
    let assivalue=encodedFormula[i].charCodeAt(0);
    if(assivalue >=65 && assivalue<=90){
      let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
      //B1:A1+10
      //rid->i,cid->j
      graphcomponetMatrix[prid][pcid].push([crid,ccid]);
  
    }
  }

}

function removeChildFromGraphComponent(formula,childaddress){
  let[crid,ccid]=decodeRIDCIDFromAddress(childaddress);
  let encodedFormula=formula.split(" ");
  for(let i=0;i<encodedFormula.length;i++){
    let assivalue=encodedFormula[i].charCodeAt(0);
    if(assivalue >=65 && assivalue<=90){
      let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
      //B1:A1+10
      //rid->i,cid->j
      graphcomponetMatrix[prid][pcid].pop();
  
    }
  }


}

function updateChildrenCells(parentAddress){
let[ParentCell,ParentCellProp]=getCellAndCellProp(parentAddress);
let children=ParentCellProp.children;

for(let i=0;i<children.length;i++){
  let childaddress=children[i];
  let[childCell,childCellProp]=getCellAndCellProp(childaddress);
  let childformula=childCellProp.formula;
  let evaluatedValue=evaluateFormula(childformulaformula);
  setCellUIAndCellProp(evaluatedValue,childformula,childaddress);
  updateChildrenCells(childaddress);
}

}

function addChildToParent(formula) {
  let childaddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
      ParentCellProp.children.push(childaddress);
    }
  }
}
function removeChildFromParent(formula){
  let childaddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
    let idx=ParentCellProp.children.indexof(childaddress);
    ParentCellProp.children.splice(idx, 1);

    }
  }
}
function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i]=cellProp.value;
    }
  }
  let decodedFormula=encodedFormula.join(" ");
  console.log(decodedFormula);
  return eval(decodedFormula);
  
}

function setCellUIAndCellProp(evaluatedValue, formula,address) {
  
  let [cell, cellProp] = getCellAndCellProp(address);

  //UI update
  cell.innerText = evaluatedValue;
  // DB update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
