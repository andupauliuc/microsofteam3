$(document).ready(function(){
   	$('img.profilepic').mouseenter(function(){
  		$(this).fadeTo('slow', 0.25);  
  	});
  	$('img.profilepic').mouseleave(function () {
        $(this).fadeTo('slow', 1);
  	});
 });