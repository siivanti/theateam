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
});