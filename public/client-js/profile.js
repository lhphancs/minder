var stream_track;

var add_tag_to_container = function(word){
    var tag_list_container = $("#tag_list_container");
    var new_tag = `<span class="tag">${word}<span class="tag-delete">X</span></span>`
    tag_list_container.append(new_tag);
};

var insert_tag = function(){
    const TAG_MAX_AMOUNT = 10;
    //Check if input is empty
    if( $("#input_tag").val() === "" ){
        alert("Must enter text before adding tag. Try again.")
        return;
    }
    
    //Check if past tag limit
    if( $(".tag").length >= TAG_MAX_AMOUNT )
        alert("Failed to add tag. Limit is " + TAG_MAX_AMOUNT);

    //Add new removable tag based on input
    else{
        add_tag_to_container( $("#input_tag").val() );
    }
    $("#input_tag").val("");
}

var set_insert_tag_response = function(){
    $("#btn_add_tag").click(function(){
        insert_tag();
    });
    $("#input_tag").on("keypress", function(e){
        if(e.which === 13){
            insert_tag();
        }
    });
};

var set_remove_tag_response = function(){
    $("#tag_list_container").on("click", ".tag-delete", function(){
        $(this).parent().remove();
    });
};

var activate_video = function(){
    var video = document.querySelector("#video_webcam");
    
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    
   if (navigator.getUserMedia) {       
       navigator.getUserMedia({video: true}, handleVideo, videoError);
   }
    
   function handleVideo(stream) {
       video.src = window.URL.createObjectURL(stream);
       stream_track = stream.getTracks()[0];
   }
    
   function videoError(e) {
       // do something
   }
};

var set_capture_listener = function(){
    // Elements for taking the snapshot
    var canvas = document.getElementById('canvas_user');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video_webcam');

    // Trigger photo take
    document.getElementById("btn_webcam_toggle").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 100, 100);
    });
};

var set_webcam_toggle_response = function(){
    $("#btn_webcam_toggle").click(function(e){
        e.preventDefault();

        //This will turn on webcam
        if( $("#video_webcam").hasClass("display_none") ){
            activate_video();
            this.innerHTML = "Take picture";
        }
            
        //This will turn off webcam and display picture taken
        else{
            this.innerHTML = "Activate webcam";
            setTimeout(function() {
                stream_track.stop();;
            }, 100); //Why do I need a set timeout of 0? breaks if I remove setTimeout 
        }
        $("#canvas_user").toggleClass("display_none");
        $("#video_webcam").toggleClass("display_none");
    });
};


var update_map = function(){
    var img_map = document.querySelector("#map");
    var str_city = $("#input_city").val();
    var query = "center=" + str_city;
    img_map.src = "https://maps.googleapis.com/maps/api/staticmap?" + query
                    + "&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794"
                    + "&key=AIzaSyB4DZ4LgiGs_wHsmkGzgUCB4TJHSomYVFU";
};



var set_save_profile_response = function(){
    $("#form_profile").on("submit", function(e){
        e.preventDefault();
        var all_tags = [];
        $(".tag").each(function(){
            var t_text = this.innerText; //This contains the X. Need to slice it off
            all_tags.push( t_text.slice(0, t_text.length - 1) );
        });
        $.ajax({
            url:"http://localhost:3000/user/profile",
            data:{
                firstName: $("#input_first_name").val(),
                lastName: $("#input_last_name").val(),
                city: $("#input_city").val(),
                description: $("#textarea_description").val(),
                tags: all_tags,
                education: $("#input_education").val(),
            },
            dataType:"json",
            type:"PATCH"
        }).done(function(json){
            window.location.replace("http://localhost:3000/user/profile");
        }).fail(function(){
            alert("Failed to grab data from database!!");
            return false;
        });
    });
};

var load_tags = function(){
    $.ajax({
        url:"http://localhost:3000/user/tags",
        data:{
            
        },
        dataType:"json",
        type:"get"
    }).done(function(json){
        for(var i=0; i<json.length; ++i){
            add_tag_to_container(json[i]);
        }
    }).fail(function(){
        alert("Failed to grab data from database!!");
        return false;
    });
};

var main = function(){
    //Set tag insert listener for buton
    set_insert_tag_response();
    set_remove_tag_response();
    set_save_profile_response();
    set_webcam_toggle_response();
    set_capture_listener();
    load_tags();
    update_map();
};

$(document).ready(function(){
    main();
});
