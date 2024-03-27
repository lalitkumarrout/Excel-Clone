let activesheetcolor="#ced6e0";
let sheetsFolderCont=document.querySelector(".sheets-folder-cont");
let addSheetBtn=document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click",(e)=>{
    let sheet=document.createElement("div");
    sheet.setAttribute("class","sheet-folder");
    
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolders.length);

    sheet.innerHTML=`
    <div class="sheet-content">Sheet ${allSheetFolders.length+1}</div>
    `;
sheetsFolderCont.appendChild(sheet);
sheet.scrollIntoView();
//DB
CreateSheetDB();
createGraphComponenMatrix();
handleSheetActivness(sheet);
handleSheetRemoval(sheet);
sheet.click();
})

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        //right click
       if(e.button!==2)return; 
       let allSheetFolders=document.querySelectorAll(".sheet-folder");
       if(allSheetFolders.length===1){
        alert("you need to have atleast one sheet!");
        return;
       }
       let response=confirm("Your sheet will be Removed Permanently,Are you sure?");
       if(response===false){
        return;
       }
       let sheetindex=Number(sheet.getAttribute("id"));
       collectedSheetDB.splice(sheetindex,1);
       //DB
       collectedGraphComponent.splice(sheetindex,1);
       //UI
       
       handleUIsheetremoval(sheet);

       //By default DB to sheet 1 to active
       sheetDB=collectedSheetDB[0];
       graphcomponetMatrix=collectedGraphComponent[0];
       handleSheetproperties();
    })
}

function handleUIsheetremoval(sheet){
    sheet.remove();
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent=allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    
    }

    allSheetFolders[0].style.backgroundColor=activesheetcolor;
}

function handleSheetDB(sheetindex){
    sheetDB=collectedSheetDB[sheetindex];
    graphcomponetMatrix=collectedGraphComponent[sheetindex];

}
function handleSheetproperties(){
    for(let i=0;i<rows;i++){

        for(let j=0;j<cols;j++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell=document.querySelector(".cell");
firstCell.click();

}
function handleAheetUI(sheet){
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor="transparent";

    }
    sheet.style.backgroundColor="#ced6e0";
}

function handleSheetActivness(sheet)
{
    sheet.addEventListener("click",(e)=>{
        let sheetindex=Number(sheet.getAttribute("id"));
        handleSheetDB(sheetindex);
        handleSheetproperties();
        handleAheetUI(sheet);

    })

}

function CreateSheetDB(){
    let sheetDB = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cellProp = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      BGcolor: "#000000",
      value:"",        //just for indication purpose;
      formula:"",
      children: [],


    };
    sheetRow.push(cellProp);
  }
  sheetDB.push(sheetRow);
}
collectedSheetDB.push(sheetDB);
}

function createGraphComponenMatrix(){
    let graphcomponetMatrix=[];

for(let i=0;i<rows;i++){
    let row=[];

    for(let j=0;j<cols;j++){
        //why array->more than 1 child relation
        row.push([]);
    }
    graphcomponetMatrix.push(row);
}
collectedGraphComponent.push(graphcomponetMatrix);
}