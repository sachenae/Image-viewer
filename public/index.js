const data = '/resources';
jsonData ='';

fetch(data)
.then(Response => Response.json())

.then(receivedJSON=>{
    jsonData = receivedJSON;
    view_thumbnails(jsonData);

});

function view_thumbnails(jsonData){
   
    for(let each of jsonData){
     
        let eachDiv=document.createElement('div');
        let eachImageDiv=document.createElement('div');
        let showDate=document.createElement('div');
        let titleDiv=document.createElement('div');
        let buttonDiv=document.createElement('div');
        let Image=document.createElement('img');
        let button=document.createElement('button');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        Image.src=each.thumbnail;
        Image.className='image' ;
        eachDiv.className='eachThumbnail';
        showDate.innerHTML='<h4>'+each.time+'</h4>'
        titleDiv.className='Description';
        titleDiv.innerHTML='<h4>'+each.title+'</h4>';
        button.innerHTML='view full image';
        button.className='viewbutton';
        editButton.className='viewbutton';
        
        
        

        deleteButton.innerHTML = 'Delete';
        editButton.innerHTML = 'Edit';
        deleteButton.className = 'deleteButton';

        editButton.addEventListener('click', () => {
            localStorage.setItem('id', each._id);
            localStorage.setItem('category', each.category);
            localStorage.setItem('title', each.title);
            localStorage.setItem('details', each.details);

            window.location = 'edit.html'
        })

        
        deleteButton.addEventListener('click', () => {

            fetch('https://localhost:3000/delete', {
                method : 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({word : each._id})
            })
            fetch('https://localhost:3000');
        })


        eachImageDiv.appendChild(Image);
        buttonDiv.appendChild(button);
        eachDiv.appendChild(eachImageDiv);
        eachDiv.appendChild(showDate);
        eachDiv.appendChild(titleDiv);
        eachDiv.appendChild(buttonDiv);
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);
        

      document.querySelector('#view_container').appendChild(eachDiv);

// modal
      const modal = document.getElementById('myModal');
      const img = document.getElementById('myImg');
      const modalImg = document.getElementById("img01");
      const captionText = document.getElementById("caption");
      const location = document.getElementById("map");
     

      button.onclick = function(){
        modal.style.display = "block";
        modalImg.src = each.original;
        captionText.innerHTML = each.details;
        location.innerHTML = '<iframe src="https://maps.google.com/maps?q=' + each.coordinates.lat + ',' + each.coordinates.lng + '&hl=en&z=14&amp;output=embed" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>'; 
   
      }


      let span = document.getElementsByClassName("close")[0];
        span.onclick = function() { 
           modal.style.display = "none";
    } 
        
        
    }
    
}

 

  // sorting
  jsonData = '';
  function sortlist() {    
    const e = document.getElementById("list");
                                                                           //sorted fetch
    

    if (e.selectedIndex > 1) {
        jsonData.sort(function (a, b) {
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();  
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })    
    }else if (e.selectedIndex > 0) {
        jsonData.sort(function (a, b) {
            var textA = a.category.toUpperCase();
            var textB = b.category.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })

    }
    
    console.log(jsonData);
    document.querySelector('.container').innerHTML='';
    view_thumbnails(jsonData);
   
}


  
   // menu tabs
    function opentab(evt, tabName) {
      let i, container, tablinks;
      container = document.getElementsByClassName("container");
      for (i = 0; i < container.length; i++) {
          container[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
          document.getElementById("frontpage").style.display = "none";
      }
      document.getElementById(tabName).style.display = "grid";
      evt.currentTarget.className += " active";
  }

  // get form
   
    function getForm(){
        window.location.href = "form.html";
    }


