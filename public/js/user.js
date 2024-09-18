$(document).ready(function () {
  $(".user-activate").on("change", function (e) {
    e.preventDefault();
    console.log($(this).is(":checked"));
    var self = $(this);
    if ($(this).is(":checked")) {
      $.ajax({
        url: "/edit/" + this.value,
        type: "PUT",
        data: {
          active: "1",
          activate: "oui",
          type: "admin",
        },
        success: function (reponse) {
          self.parent().find(".yesorno").html("Oui");
        },
        error: function (reponse) {
          self.parent().find(".yesorno").html("Non");
          swal(
            "Erreur !",
            "Une erreur est survenue, veuillez reessayer plutard.",
            "error"
          );
          console.log("responserror" + reponse);
        },
      });
    } else {
      $.ajax({
        url: "/edit/" + this.value,
        type: "PUT",
        data: {
          active: "0",
          activate: "oui",
          type: "admin",
        },
        success: function (reponse) {
          self.parent().find(".yesorno").html("Non");
        },
        error: function (reponse) {
          self.parent().find(".yesorno").html("Oui");
          swal(
            "Erreur !",
            "Une erreur est survenue, veuillez reessayer plutard.",
            "error"
          );
          console.log("responserror" + reponse);
        },
      });
    }
  });

  $(".usertype_selector").on("click", function () {
    if ($(this).attr("attr-val") == "ecole") {
      $(".eleve_selector").removeClass("active");
      $(".ecole_selector").addClass("active");
      $(".eleve_form").hide(100);
      $(".ecole_form").show(300);
    } else {
      $(".ecole_selector").removeClass("active");
      $(".eleve_selector").addClass("active");
      $(".ecole_form").hide(100);
      $(".eleve_form").show(300);
    }
  });

  $(document).on("click", ".testdeclose", function () {
    $(this).parent().remove();
  });

 

  $(".ecoleformulairesave").on("submit", function (e) {
    e.preventDefault();
    var texte_bouton = $(".submit_all_ecole").text();
    var self = $(".submit_all_ecole");
    $(".submit_all_ecole").html("En cours...");

    var $form = $(".ecoleformulairesave");
    var formdata = window.FormData ? new FormData($form[0]) : null;
    var data = formdata !== null ? formdata : $form.serialize();
    data.append("type_req", "admin");
    data.append('phone',iti30.getNumber());  
    $.ajax({
      url: "/signup",
      type: "POST",
      processData: false,
      contentType: false,
      data: data,
      success: function (data) {
        self.html(texte_bouton);
          vt.success(data.message, {
            position: "top-center",
            duration: 5000,
            closable: true,
            focusable: true,
            callback: undefined,
          });
          setTimeout(()=>{
            window.location=document.referrer
          },1000)
      },
      error: function (error) {
        swal(
          "Erreur !",
          "Une erreur est survenue, veuillez reessayer plutard !",
          "error"
        );
        self.html(texte_bouton);
        console.log(error);
      },
    });
  });

  $(".add_langue").on("click", function (e) {
    e.preventDefault();
    $(
      ".languedivcontent"
    ).append(`<div class="langue-eleve row" style="margin-bottom: 1rem;">
        <hr>
        <i class="material-icons pull-left testdeclose">cancel</i>
        <div class="col-md-6">
            <div class="form-group">
                <label for="">Langue</label>
                <input type="text" class="form-control" name="langue_eleve[]">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="">Attestation (optionnel)</label>
                <input type="file" class="form-control" name="attestation_langue_eleve[]">
            </div>
        </div>
    </div>`);
  });


  $('.location').on('submit', function (e) {
    e.preventDefault();
    var texte_bouton = $(".submit_location").text();
    var save_btn=$(".submit_location")
    save_btn.html("En cours...");
    var $form = $(this);
    var formdata = (window.FormData) ? new FormData($form[0]) : null;
    var data = (formdata !== null) ? formdata : $form.serialize();
    $.ajax({
        url: $form.attr('action'),
        type: 'POST',
        processData: false,
        contentType: false,
        data: data,
        success: function (data) {
            save_btn.html(texte_bouton);
            
            vt.success(data.message,{
                title: "Succès !",
                position: "top-center",
                duration: 5000,
                closable: true,
                focusable: true,
                callback: undefined
            });
            if($(".data_id").val()=="no" && !save_btn.attr("attr-refresh"))
              $(".value").val("")
            else{
            setTimeout(()=>{
              window.location=document.referrer
            },1000)
            
            }
        },
        error: function (error) {
            save_btn.html(texte_bouton);
            console.log(error);
            vt.error("Une erreur est survenue, veuillez reessayer plutard !",{
                title: "Erreur !",
                position: "top-center",
                duration: 5000,
                closable: true,
                focusable: true,
                callback: undefined
            });
        }
    })
});

$('.delete').on('click', function (e) {
  e.preventDefault();
  var self = $(this);
  var url = $(this).attr('href');
  swal({
      title: "Etes-vous sûr de vouloir éffectué cette action?",
      text: "Cette action est irreversible.",
      icon: "warning",
      buttons: true
    })
    .then((willDelete) => {
      if (willDelete) {
          $.ajax({
              url: url,
              type: "GET",
              success: function (reponse) {
                  vt.success("Suppression réalisée avec succès !",{
                      title: "Succès !",
                      position: "top-center",
                      duration: 5000,
                      closable: true,
                      focusable: true,
                      callback: undefined
                  });
                  window.location.href = "";
              },
              error: function (reponse) {
                  vt.error("Une erreur est survenue, veuillez reessayer plutard !",{
                      title: "Erreur !",
                      position: "top-center",
                      duration: 5000,
                      closable: true,
                      focusable: true,
                      callback: undefined
                  });
                  console.log('responserror' + reponse);
              }
          });
      } else {
      //   swal("Your imaginary file is safe!");
      }
    });

});
});
