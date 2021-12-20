$(document).ready(function () {
    $('.pack-activate').on('change', function (e) {
        e.preventDefault();
        console.log($(this).is(':checked'));
        var self = $(this);
        if ($(this).is(':checked')) {
            $.ajax({
                url: "/edit-pack-activate/" + this.value,
                type: "PUT",
                data: {
                    active: '1',
                },
                success: function (reponse) {
                    self.parent().find(".yesorno").html("Oui");
                },
                error: function (reponse) {
                    self.parent().find(".yesorno").html("Non");
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
            $.ajax({
                url: "/edit-pack-activate/" + this.value,
                type: "PUT",
                data: {
                    active: '0',
                    activate: 'oui',
                    type: 'admin'
                },
                success: function (reponse) {
                    self.parent().find(".yesorno").html("Non");
                },
                error: function (reponse) {
                    self.parent().find(".yesorno").html("Oui");
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
        }

    });
    
    $('.typepack').on('change', function (e) {
        e.preventDefault();
        if ($(this).children("option:selected").val() == "Ecole") {
            $('.essai_switch').hide(100);
            $('.ecole_switch').show(300);
        } else {
            $('.essai_switch').show(300);
            $('.ecole_switch').hide(100);
        }
    })
    
    $('.add_option').on('click', function (e) {
        e.preventDefault();
        $('.description-list').append(`<div class="row" style="margin: 0px 0rem;display: flex;justify-content: center;align-items: center;">
            <div class="col-md-5">
                <div class="form-group">
                    <label for="">Option *</label>
                    <input type="text" class="form-control" placeholder="Entrer une option" name="description[]">
                </div>
            </div>
            <div class="col-md-5">
                <div class="form-group">
                    <label for="">Option (en anglais) *</label>
                    <input type="text" class="form-control" placeholder="Entrer une option" name="description_en[]">
                </div>
            </div>
            <div class="col-md-2">
                <i class="fa fa-trash delete-option" style="color: red;cursor: pointer;"></i>
            </div>
        </div>`);
    })
    
    $(document).on('click', '.delete-option', function (e) {
        e.preventDefault();
        $(this).parent().parent().remove();
    })

    $('.submit_pack').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.packsave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('option_ecole',$('.option2').val()+"|"+$('.option3').val()+"|"+$('.option4').val()+"|"+$('.option5').val());
        data.append('option_etudiant',$('.option1').val());
        data.append('place',$('#place').find(":selected").val());
        data.append('aide_logement',$(".aide_logement").is(':checked') ? 'on' : 'off');
        data.append('aide_postvisa',$(".aide_postvisa").is(':checked') ? 'on' : 'off');
        $.ajax({
            url: '/addedit-pack',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Pack ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                window.location.href = "/dashboard/pack";
            },
            error: function (error) {
                self.html(texte_bouton);
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
    })
});
