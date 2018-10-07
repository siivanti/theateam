$(document).ready(function(){
    let packetData = [];
    google.charts.load("current", {packages:["corechart"]});
    let mockData =([
        ['Task', 'Hours per Day'],
        ['Work',     11],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    7]
      ]);        
    var options = {   
            
        titleTextStyle: {color: '#2c4f6d', fontSize: 22, bold: true},
        colors:['#3b6890','#4476a3', '#4b82b3', '#528cc1','#5896ce', '#6fa3d8','#8fb4de','#a6c1e3','#bbcfe9','#cedbee'],
        chartArea:{left:50,top:50,width:'90%',height:'80%'},
        backgroundColor: '#e5e5e5',
        title: 'Relative Distribution of Active Ports',
        pieHole: 0.4,
        pieSliceTextStyle: {
        color: 'white'
      }
    }
    setTimeout(function(){  // set mock data so graph will display on first load
        drawChart(mockData);
    },500) 
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
	console.log(file.name);
	var allowed = /(.*\.pcap|.*\.pcapng)/;
	if (file.name.match(allowed)){
        $.ajax({
            url: "http://127.0.0.1:3001/session/",
            //Ajax events
            success: function(e) {
                alert("Upload completed");
                handleData(e);
            },
            error: function(e) {
                alert("HTTP ERR_CONNECTION_REFUSED");
            },
            // Form data
            data: formData,
            type: "POST",
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    }else{
		alert('HTTP 400: Bad Request');
		return false;
	};
  };
  //visualization button function
  $('.ipdist').click(function(e){
      ipDist(packetData);
  })
  $('.portdist').click(function(e){
         portDist(packetData);      
  })
    function handleData(data){
        let id = data.id;
        let url = 'http://127.0.0.1:3001/session/'+id+'/packets/';
        console.log(url);
        $.get(url, function(packets){
            packetData = packets; //set global so we can access later
            let table = $('.myTable');
            console.log(packets);  
            
            packets.forEach(obj=>{        
                
                table.append(
                    '<tr><td>'+obj.id+
                    '</td><td>'+obj.timestamp+
                    '</td><td>'+obj.ipDst+':'+ obj.dstPort+
                    '</td><td>'+obj.ipSrc+':'+ obj.srcPort+
                    '</td><td>'+obj.transport+'</tr>'
                )
            })

            portDist(packets);            
        })
    }
    function ipDist(packets){
        let IPs = [];
        let chartData = [];
        packets.filter(a=>{ // pull unique transport protocols
            if(a.ipDst){
                 return IPs.indexOf(a.ipDst) == -1 && IPs.push(a.ipDst);
            }
        })
        for(var i =0;i<IPs.length;i++){ // count how many of each
            let count = 0;
            packets.forEach(obj=>{
                if(obj.ipDst === IPs[i]) count++;
            })
            chartData.push([IPs[i],count]);
        }
        
        options.title = 'Relative Distribution of Destination IPs';
        chartData.unshift(['IP','Count']);
        drawChart(chartData);
    }
    function portDist(packets){ //rel dist active ports
        let protocols = [];
        let chartData = [];
        packets.filter(a=>{ // pull unique transport protocols
            if(a.transport){
                 return protocols.indexOf(a.transport) == -1 && protocols.push(a.transport);
            }
        })
        for(var i =0;i<protocols.length;i++){ // count how many of each
            let count = 0;
            packets.forEach(obj=>{
                if(obj.transport === protocols[i]) count++;
            })
            chartData.push([protocols[i],count]);
        }
        
        options.title = 'Relative Distribution of Active Ports';
        chartData.unshift(['Protocol','Count']);
        drawChart(chartData);            
    }
   
      function drawChart(chartData) {
    
        var data = google.visualization.arrayToDataTable(chartData);   
        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
      }
      
});
