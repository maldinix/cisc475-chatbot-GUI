function submitHash() {
  getDataFromBackEnd(document.getElementById("textboxGetHash").value);
  return;
};

document.addEventListener("dragover", function (event) {
  event.preventDefault();
  return false;}, false
);


document.addEventListener("drop", function (event){
  event.preventDefault();
  buildTable(); // build table containing data on files dragged onto canvas
  return false;}, false
);

function createChart(files){

  var data = [{

    values: [files[0].size, files[1].size, files[2].size],
    labels: [files[0].name, files[1].name, files[2].name],

    type: 'pie'
  }];

  var layout = {height: 380, width: 480};

  Plotly.newPlot('myChartDiv', data, layout);
};



function buildTable(){

  var sha256 = require('js-sha256');
  var files = event.target.files || event.dataTransfer.files;
  var table = document.getElementById("reportTable");

  for (var i = 0, file; file = files[i]; i++) {

      // Append a new row to the HTML document
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = files[i].name;
      cell2.innerHTML = files[i].size;
      cell3.innerHTML = files[i].type;
      cell4.innerHTML = sha256(files[i].name);
  };

  createChart(files);
  return;

};


function httpGetAsync(myFullUrl, callback) {

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4){
      callback(xmlHttp.responseText,xmlHttp.status);
    };
  };
  xmlHttp.open("GET", myFullUrl, true); // true for asynchronous
  xmlHttp.send(null);
};


function getDataFromBackEnd(myHash){

  var myUrl = "http://fcas-test.us-east-1.elasticbeanstalk.com";
  var myKey = "/devel";

  //     var myCommand = "/target/describe/Goodware";
  //		 var myCommand = "/threat/describe/0014ee0d96e989913c21e0e4414bb8c0b44997198bab5ae6a739da4987a4bfb5";
  //		 var myCommand = "/threat/list/0/10";

  var myCommand = "/threat/analysis/";
  //var myCommand = "/threat/describe/";


  var myFullUrl = myUrl + myKey + myCommand + myHash;

  httpGetAsync(myFullUrl, processJSONText);

  return;
};

function refresh(){

  var tableHeaderRowCount = 1;
  var table = document.getElementById('reportTable');
  var rowCount = table.rows.length;

  for (var i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount);
  };

  document.getElementById("textboxGetHash").value = "";
  document.getElementById("responseJSON").innerHTML = "";
  document.getElementById("parsedJSON").innerHTML = "";

  // remove chart
  var div = document.getElementById('myChartDiv');

  while(div.firstChild){
    div.removeChild(div.firstChild);
  };

  return;
};



function quitApp(){
  window.opener = self;
  window.close();
};


var oput = "";

function traverse(x, level) {

  if (isArray(x)) {
    traverseArray(x, level);
  } else if ((typeof x === 'object') && (x !== null)) {
    traverseObject(x, level);
  } else {
//    console.log(level + x); // value data
  };
};

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
};

function traverseArray(arr, level) {
//  console.log(level + "<array>");
  arr.forEach(function(x) {
    traverse(x, level + "  ");
  });
};

function traverseObject(obj, level) {
//  console.log(level + "<object>");
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {

      oput = oput +  key + ":";

      traverse(obj[key], level + "    ");
    };
  };
};




function processJSONText(responseText, status){

  document.getElementById("responseJSON").innerHTML = "responseText: " + responseText;

  var obj = JSON.parse(responseText);
  traverse(obj);
  document.getElementById("parsedJSON").innerHTML = "parsedJSON: " + oput;

};
