/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let loadURL = (theUrl, theId, blank = 0) => {

    //store the current item so we can use it later.
    let theData = getData(2, theId)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;
}

whenDocumentReady(isReady = () => {
    //get the header element
    let headerEl = document.getElementById("siteheader");
    //get the data
    let header = headerEl.innerHTML;
    let tmpName;
    tmpName = window.localStorage.level1selecteditem;
    //get the sitename from the url paramater and add it to the header
    header = header + " " + tmpName;

    //process the action drop down
    document.getElementById('pageActionSelect').addEventListener('change', function() {
        switch (this.value) {
            case "1":
                window.location.href = `/${level1name}/${level2name}/new/`
                break;
            case "2":
                window.location.href = `/${level1name}s/`
                break;
        }
        this.value = 0;

    })


    //update the header
    headerEl.innerHTML = header;
    document.getElementById('showBody').classList.remove('d-none')
    let xhrDone = (res, local = 0) => {
        //store it in local storage
        if (local == 0) {
            storeData(2, res);
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
            let editbutton = `<a href="javascript:loadURL('/${level1name}/${level2name}/edit/','${res.data[i].id}')" id="ep-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteTableItem('${res.data[i].id}','${res.data[i].id}','api/${level2name}/')" id="dp-${tmpName}-${i}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            //add the record
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].name, res.data[i].createdAt, `${editbutton} ${deletebutton}`])
                .draw()
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
    }
    theData = getData(2);
    if (theData != false) {
        xhrDone(theData, 1);
    } else {
        //build the json
        let bodyobj = {
            email: user.email
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, `api/${level2name}/?id=${window.localStorage.level1selectedid}`, bodyobjectjson, "json", "", xhrDone, token)

    }

})