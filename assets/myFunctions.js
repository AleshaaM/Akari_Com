$(document).ready(function () {
  var selectedPropertyId = 0;


    $("#btn_continue").click(function () {
      $("#frm_request").slideToggle("slow");
    });


    $(document).on("click", ".btn_view_property", function(){
      var id = $(this).prop("id");  
      if ($(this).prop("checked"))
        $("#" + id + "_detail").fadeIn(300);
      else
        $("#" + id + "_detail").fadeOut(300);
    });

    $(document).on("click", ".btn_select_property", function(){

    });

});