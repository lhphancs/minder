
var set_toggle_friend_response = function(){
    $("#btn_add_friend").click(function(){
        $.ajax({
            url:"http://localhost:3000/user/friends/add",
            data:{
            },
            dataType:"json",
            type:"POST"
        }).done(function(json){
            ;
        }).fail(function(){
            alert("Failed to grab data from database!!");
            return false;
        });
    });
};

var main = function(){
    set_toggle_friend_response();
};

$(document).ready(function(){
    main();
});