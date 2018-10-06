$(document).ready(function(){
    var time = new Date().getTime();//UTC    
    var date = new Date(time);//Pass back in UTC
    //display time
    $('#utcTime').text(date);
    //pull public ip
    $.getJSON("http://jsonip.com/?callback=?", function (data) {       
        $('#publicIP').text(data.ip);
       
    });
    //get local ip
    $.post('/getlocalip').done(function(res){
        $('#privateIP').text(res);        
        console.log(res);
    })
    $('.leftsidebar a').click(function (e) {
         e.preventDefault()
         $(this).tab('show')
   })
    $("#fileupload").click(function(e) {
    $("#my_file").click();
  });
  document.getElementById("my_file").onchange = function(e) {
    e.preventDefault();
    let formData = new FormData();
    var file = $("input[type=file]").get(0).files[0];
    formData.append("file", file);
    console.log(formData.get("file"));
    $.ajax({
      url: "http://127.0.0.1:3001/session/",
      //Ajax events
      success: function(e) {
        alert("Upload completed");
      },
      error: function(e) {
        alert("error " + e.message);
      },
      // Form data
      data: formData,
      type: "POST",
      //Options to tell jQuery not to process data or worry about content-type.
      cache: false,
      contentType: false,
      processData: false
    });
  };
});
