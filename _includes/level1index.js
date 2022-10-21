/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let loadURL = (theUrl, theId,theName="",blank = 0) => {

    //store the current item so we can use it later.
    if (theName != "")
    {
        //clear the level 2 selected data
        window.localStorage.level2data = "";
        window.localStorage.level1selecteditem = theName;
    }
    if (theId != "")
        window.localStorage.level1selectedid = theId;
    let theData = getData(1,theId)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    let xhrDone = (res, local = 0) => {
        //store it in local storage
        if (local == 0) {
            storeData(1,res);
            res = JSON.parse(res)
        }
        //get the datatable
        table = $('#dataTable').DataTable();
        //loop through the data
        let user = getUser(1);
        for (var i = 0; i < res.data.length; ++i) {
            let level2nameformatted = level2name.charAt(0).toUpperCase() + level2name.slice(1)

            let tmpName = res.data[i].name.replace(" ", "-");
            //note you may only want one level of items, if so delete this method
            let level2button = `<a href="javascript:loadURL('/${level1name}/${level2name}s/','${res.data[i].id}','${res.data[i].name}')" id="ep-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i>${level2nameformatted}s</a>`
            let editbutton = `<a href="javascript:loadURL('/${level1name}/edit/','${res.data[i].id}')" id="ep-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteTableItem('${res.data[i].id}','${res.data[i].id}','api/${level1name}/')" id="dp-${tmpName}-${i}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            //add the record
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].name, res.data[i].createdAt, `${level2button} ${editbutton} ${deletebutton}`])
                .draw()
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
    }
    theData = getData('');
    if (theData != false) {
        xhrDone(theData, 1);
    } else {
        //build the json
        let bodyobj = {
            email: user.email,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, "api/" + level1name + "/", bodyobjectjson, "json", "", xhrDone, token)

    }

})