$(document).ready(function () {
    $('.langue-activate').on('change', function (e) {
        e.preventDefault();
        console.log($(this).is(':checked'));
        var self = $(this);
        if ($(this).is(':checked')) {
            $.ajax({
                url: "/edit-langue-activate/" + this.value,
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
                url: "/edit-langue-activate/" + this.value,
                type: "PUT",
                data: {
                    active: '0'
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

    $('.delete_langue').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer une langue.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/langues/delete/" + id,
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

    $('.submit_langue').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.languesave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        $.ajax({
            url: '/addedit-langue',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Langue ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                window.location.href = "/dashboard/langues";
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
