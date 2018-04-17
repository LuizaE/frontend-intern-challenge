function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

$(document).ready(function() {
    $.getJSON("js/urls.json", function(result){
        result.sort(function (a, b) {
	    	return (a.hits > b.hits) ? -1 : ((b.hits > a.hits) ? 1 : 0);
        });
        $.each(result.slice(0,5), function(i, record){
            $('#table tbody').append('<tr><td class="url"><a href="'+record.shortUrl+'">'+record.shortUrl+'</a></td><td class="hits">'+record.hits+'</td></tr>');    
        });
    });
    $("#shortthat").click(function() {
        if($("#link").val().lenght === 0) {
            window.alert("Informe seu link!");
        } else{
            $('#shortthat').text('COPIAR');
            $('.close-icon').css({'display':'inline-block'});
            $("#link").val("http://crd.dc/"+makeid()).addClass("linkshort"); 
        }
    });
    $(".close-icon").click(function() {
        $('#link').val('').removeClass("linkshort");
        $('#shortthat').text('ENCURTAR');
        $('.close-icon').css({'display':'none'});
    });
});



