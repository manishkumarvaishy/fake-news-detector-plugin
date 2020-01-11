document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {
  
      chrome.tabs.getSelected(null, function(tab) {
        //d = document;
        var link = tab.url;

        

    fetch('https://www.unslanted.net/newsbot/?u='+link+'/&submit=Analyze').then(r => r.text()).then(result => {
    // Result now contains the response text, do what you want...
    extractInfo(result);
})

      });
    }, false);
  }, false);


  function extractInfo(htmlDoc)  
  {

    //var doc = new DOMParser().parseFromString(htmlDoc, "text/xml");
    //alert(doc.getElementsByClassName("wpb_wrapper")[0]);
    //alert(doc.querySelector('h3').innerText); // => <a href="#">Link...
    //console.log(doc.firstChild.firstChild.innerHTML); // => Link
    var el = document.createElement('div');
    el.innerHTML = htmlDoc.replace("<br>","");
    var result =el.getElementsByTagName("h3")[0].innerText;

    var detail = el.getElementsByClassName("wpb_wrapper")[0];

    var firstText = "";
    for (var i = 0; i < detail.childNodes.length; i++) {
        var curNode = detail.childNodes[i];
         if (curNode.nodeName === "#text") {
             firstText = firstText + curNode.nodeValue;
             
         }
    }
    firstText = firstText.replace(/\n\s*\n\s*\n/g, '\n\n');


    var resultDiv = document.getElementById('result');
    var detailDiv = document.getElementById('detail');
    resultDiv.innerText=result;
    //detailDiv.innerText=firstText.replace(/(\n)/gm," ");
    detailDiv.innerText=firstText.split('\n\n', 5).join('\n\n');
    
    //alert (firstText.split('\n\n', 5).join('\n\n'));
    //var firstIndex = htmlDoc.indexOf("h3");
    //alert(firstIndex);
    //alert(htmlDoc.length);
    //var x = htmlDoc.substring(1050,40);
    //var x = htmlDoc.substring(parseInt(firstIndex) , firstIndex+40);
    //x="HTML".substring(1, 2);
    //alert(x);
    $('#det').removeClass('hide');
    
  }