$(document).ready(function () {
    $('.delete_domaine').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer un domaine.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/domaines/delete/" + id,
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

    $('.submit_domaine').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.domainesave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('desc',CKEDITOR.instances['description_domaine'].getData());
        data.append('desc_en',CKEDITOR.instances['description_domaine_en'].getData());
        $.ajax({
            url: '/addedit-domaine',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Domaine ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "/dashboard/domaines";
               }, 2000);
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
