let downloadBtn=document.querySelector(".download");
let openBtn=document.querySelector(".open");
//download task
downloadBtn.addEventListener("click",(e)=>{
 
 let jsonData=JSON.stringify([sheetDB,graphcomponetMatrix]);
 let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

//open task
openBtn.addEventListener("click",(e)=>{
    //open file explorer
let input=document.createElement("input")
input.setAttribute("type","file");
input.click();

input.addEventListener("change",(e)=>{
    let fr=new FileReader();
    let files=input.files;
    let fileobj=files[0];

    fr.readAsText(fileobj);
    fr.addEventListener("load",(e)=>{
        let readsheetdata=JSON.parse(fr.result);
        //basic sheet with default data will  be created
        addSheetBtn.click();
        //sheetDB,graphComponent

        sheetDB=readsheetdata[0];
        graphcomponetMatrix=readsheetdata[1];
        collectedSheetDB[collectedSheetDB.length-1]=sheetDB;
        collectedGraphComponent[collectedGraphComponent.length-1]=graphcomponetMatrix;

        handleSheetproperties();
    })

})
})