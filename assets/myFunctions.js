var propertyPage = false;
$(document).ready(function () {
  var selectedPropertyId = null;
  var isFormOpened = false;
  const randomchar =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var captcha;

  $(document).on("click", ".btn_view_property", function(){
    var id = $(this).attr("id");  
    if ($(this).prop("checked"))
      $("#" + id + "_detail").fadeIn(300);
    else
      $("#" + id + "_detail").fadeOut(300);
  });
 
  //On btn continue click
  $("#btn_continue").click(function() {
    if (!isFormOpened)
    {
      selectedPropertyId = $(".btn_select_property:checked").attr("id");
      if (selectedPropertyId != null)
      {
        $("#akarTable").fadeOut(300);
        $("#frmRequest").fadeIn(300);
        $("#btn_continue").text("رجوع");
        generateCaptcha();
        isFormOpened = true;
      }
    }
    else
    {
      $("#akarTable").fadeIn(300);
      $("#frmRequest").fadeOut(300);
      $("#btn_continue").text("متابعة");
      isFormOpened = false;
    }
  });
  
  //but dash for date of birth input
  $("#date_of_birth").on("input", function(){
    var dobVal = $(this).val();
    if (dobVal.length === 2 || dobVal.length === 5) {
      $(this).val(dobVal + '-');
    }
  });

  //Captcha
  function generateCaptcha()
  {
    captcha = $("#captchaImg");
    var uniquechar = "";

    for (var i = 0; i < 5; i++) {
      uniquechar += randomchar.charAt(
        Math.random() * randomchar.length
      )
    }

    captcha.html(uniquechar);
  }


  $("#btnSubmit").click(function() {
    var isValid = true;
    var msg = "";
    var i = 0;

    //Full name validation
    var nameVal = $("#fullName").val();
    var regex = /^[\u0600-\u06FF\s]*$/;

    if (!regex.test(nameVal)) {
      msg = ++i + ".يرجى كتابة الاسم فقط بالأحرف العربية\n";
      isValid = false;
      $("#fullName").val('');
    }

    //National ID validation
    var nationalIdVal = $("#national_id").val();
    if (nationalIdVal.length === 0)
    {
      isValid = false;
      msg += ++i + ".الرقم الوطني مطلوب\n";
    }
    else
    {
      var regex = /^\d*$/;
      if (!regex.test(nationalIdVal)) {
        isValid = false;
        msg += ++i + ".الرقم الوطني غير صحيح قم بكتابته مرة أخرى\n";
        $("#national_id").val('');
      }
    }

    //dob validation
    var dobVal = $("#date_of_birth").val();
    if (dobVal.length > 0)
    {
      var regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/;
      if (!regex.test(dobVal)) {
        msg += ++i + ".خطأ في تنسيق التاريخ، لطفاً قم بكتابة التاريخ على الشكل التالي dd-mm-yyyy.\n";
        isValid = false;
        $("#date_of_birth").val('');
      }
    }

    //mobile validation
    var mobileVal = $("#mobile").val();
    if (mobileVal.length > 0)
    {
      var syriatelMtnPrefixes = ['093', '094', '095', '096', '098', '099'];
      var isValidMobileNumber = false;

      if (mobileVal.length === 10) {
        var prefix = mobileVal.substring(0, 3);
        isValidMobileNumber = syriatelMtnPrefixes.includes(prefix);
      }

      if (!isValidMobileNumber) {
        msg += ++i + ".رقم الموبايل غير صحيح قم بالتأكد منه وكتابته مرة أخرى.\n";
        isValid = false;
        $("#mobile").val('');
      }
    }
    
    //email validation
    var emailVal = $("#email").val();
    if (emailVal.length > 0)
    {
      var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!regex.test(emailVal)) {
        msg += ++i + ".خطأ في البريد الإلكتروني قم بكتابته بشكل صحيح مرة أخرى.\n";
        isValid = false;
        $("#email").val('');
      }
    }
    
    //captcha validation
    var captchaVal = $("#captcha").val();
    if (captchaVal != captcha.html())
    {
      msg += ++i + ".رمز التحقق غير صحيح\n";
      isValid = false;
      $("#captcha").val('');
    }

    if (!isValid) {
      alert(msg);
      generateCaptcha();
      return;
    }

    storePropertyInfo();
  });

  function storePropertyInfo() {
    var propertyInfo   = $("#" + selectedPropertyId + "_info").children();
    var propertyDetail = $("#" + selectedPropertyId + "_detail").find('table').find('tbody').find('tr');

    var property = {
      location: propertyInfo[1].innerText, 
      detail: propertyInfo[2].innerText, 
      price: propertyInfo[3].innerText, 
      info: {
        country: propertyDetail[0].children[0].innerText,
        img1: $(propertyDetail[2].children[0].innerHTML).attr('src'),
        img2: $(propertyDetail[2].children[1].innerHTML).attr('src'),
        img3: $(propertyDetail[2].children[2].innerHTML).attr('src')
      }
    }

    localStorage.setItem('property', JSON.stringify(property));
    window.location.href = "property.html";
  }

  if (propertyPage)
      getPropertyInfo();

  function getPropertyInfo()
  {
    var property = JSON.parse(localStorage.getItem('property'));
    $("#img1").attr("src", property.info.img1);
    $("#img2").attr("src", property.info.img2);
    $("#img3").attr("src", property.info.img3);

    $("#price").find('span').text(property.price);
    $("#location").find('span').text(property.location);
    $("#country").find('span').text(property.info.country);
    $("#detail").find('span').text(property.detail);
  }



});