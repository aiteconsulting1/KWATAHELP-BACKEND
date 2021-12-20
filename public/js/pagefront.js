$(document).ready(function () {
    ///--------- Avis Client -------///
    $('.delete_avis').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer un avis.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/avis/delete/" + id,
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

    $('.save_avis').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        var unit_en = self.attr('attr-unit1');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.avissave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('message_avis', CKEDITOR.instances[unit].getData());
        data.append('message_avis_en', CKEDITOR.instances[unit_en].getData());
        $.ajax({
            url: '/addedit-homepage',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Avis client ajouté/modifié avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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

    ///--------- Partenaires -------///
    $('.delete_partner').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer une image de partenaire.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/partner/delete/" + id,
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

    $('.save_partner').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.partnersave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        // data.append('message_avis', CKEDITOR.instances[unit].getData());
        $.ajax({
            url: '/addedit-partnerpage',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Image de partenaire ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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

    ///--------- Slides -------///
    $('.delete_slide').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer un slide.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/slide/delete/" + id,
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

    $('.save_slide').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.slidesave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        // data.append('message_avis', CKEDITOR.instances[unit].getData());
        $.ajax({
            url: '/addedit-slide',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Slide ajouté/modifié avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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

    ///--------- Autres sections -------///
    
    $('.save_autresection').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.autresectionsave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        if ($('input[name="id_autresection"]').val() == "no") {
            data.append('desc_bloc2', CKEDITOR.instances["desc_bloc2"].getData());
            data.append('desc_bloc3', CKEDITOR.instances["desc_bloc3"].getData());
            data.append('desc_bloc4', CKEDITOR.instances["desc_bloc4"].getData());
            data.append('desc_bloc4_card1', CKEDITOR.instances["desc_bloc4_card1"].getData());
            data.append('desc_bloc4_card2', CKEDITOR.instances["desc_bloc4_card2"].getData());
            data.append('desc_bloc4_card3', CKEDITOR.instances["desc_bloc4_card3"].getData());

            data.append('desc_bloc2_en', CKEDITOR.instances["desc_bloc2_en"].getData());
            data.append('desc_bloc3', CKEDITOR.instances["desc_bloc3_en"].getData());
            data.append('desc_bloc4_en', CKEDITOR.instances["desc_bloc4_en"].getData());
            data.append('desc_bloc4_card1_en', CKEDITOR.instances["desc_bloc4_card1_en"].getData());
            data.append('desc_bloc4_card2_en', CKEDITOR.instances["desc_bloc4_card2_en"].getData());
            data.append('desc_bloc4_card3_en', CKEDITOR.instances["desc_bloc4_card3_en"].getData());
        } else {
            data.append('desc_bloc2', CKEDITOR.instances["desc_bloc2_edit"].getData());
            data.append('desc_bloc3', CKEDITOR.instances["desc_bloc3_edit"].getData());
            data.append('desc_bloc4', CKEDITOR.instances["desc_bloc4_edit"].getData());
            data.append('desc_bloc4_card1', CKEDITOR.instances["desc_bloc4_card1_edit"].getData());
            data.append('desc_bloc4_card2', CKEDITOR.instances["desc_bloc4_card2_edit"].getData());
            data.append('desc_bloc4_card3', CKEDITOR.instances["desc_bloc4_card3_edit"].getData());

            data.append('desc_bloc2_en', CKEDITOR.instances["desc_bloc2_edit_en"].getData());
            data.append('desc_bloc3_en', CKEDITOR.instances["desc_bloc3_edit_en"].getData());
            data.append('desc_bloc4_en', CKEDITOR.instances["desc_bloc4_edit_en"].getData());
            data.append('desc_bloc4_card1_en', CKEDITOR.instances["desc_bloc4_card1_edit_en"].getData());
            data.append('desc_bloc4_card2_en', CKEDITOR.instances["desc_bloc4_card2_edit_en"].getData());
            data.append('desc_bloc4_card3_en', CKEDITOR.instances["desc_bloc4_card3_edit_en"].getData());
        }
        $.ajax({
            url: '/addedit-autresection',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success(data.message,{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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

    ///--------- Nos offres -------///
    
    $('.save_offre').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.offresave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        if ($('input[name="id_offre"]').val() == "no") {
            data.append('desc_offre_bloc', CKEDITOR.instances["desc_offre_bloc"].getData());
            data.append('desc_bloc_ccm', CKEDITOR.instances["desc_bloc_ccm"].getData());
            data.append('desc_bloc_ccm_card1', CKEDITOR.instances["desc_bloc_ccm_card1"].getData());
            data.append('desc_bloc_ccm_card2', CKEDITOR.instances["desc_bloc_ccm_card2"].getData());
            data.append('desc_bloc_ccm_card3', CKEDITOR.instances["desc_bloc_ccm_card3"].getData());

            data.append('desc_offre_bloc_en', CKEDITOR.instances["desc_offre_bloc_en"].getData());
            data.append('desc_bloc_ccm_en', CKEDITOR.instances["desc_bloc_ccm_en"].getData());
            data.append('desc_bloc_ccm_card1_en', CKEDITOR.instances["desc_bloc_ccm_card1_en"].getData());
            data.append('desc_bloc_ccm_card2_en', CKEDITOR.instances["desc_bloc_ccm_card2_en"].getData());
            data.append('desc_bloc_ccm_card3_en', CKEDITOR.instances["desc_bloc_ccm_card3_en"].getData());
        } else {
            data.append('desc_offre_bloc', CKEDITOR.instances["desc_offre_bloc_edit"].getData());
            data.append('desc_bloc_ccm', CKEDITOR.instances["desc_bloc_ccm_edit"].getData());
            data.append('desc_bloc_ccm_card1', CKEDITOR.instances["desc_bloc_ccm_card1_edit"].getData());
            data.append('desc_bloc_ccm_card2', CKEDITOR.instances["desc_bloc_ccm_card2_edit"].getData());
            data.append('desc_bloc_ccm_card3', CKEDITOR.instances["desc_bloc_ccm_card3_edit"].getData());

            data.append('desc_offre_bloc_en', CKEDITOR.instances["desc_offre_bloc_edit_en"].getData());
            data.append('desc_bloc_ccm_en', CKEDITOR.instances["desc_bloc_ccm_edit_en"].getData());
            data.append('desc_bloc_ccm_card1_en', CKEDITOR.instances["desc_bloc_ccm_card1_edit_en"].getData());
            data.append('desc_bloc_ccm_card2_en', CKEDITOR.instances["desc_bloc_ccm_card2_edit_en"].getData());
            data.append('desc_bloc_ccm_card3_en', CKEDITOR.instances["desc_bloc_ccm_card3_edit_en"].getData());
        }
        $.ajax({
            url: '/addedit-offre',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success(data.message,{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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

    ///--------- Nos conseils & Orientations -------///
    
    $('.save_orientation').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        $(this).html("En cours...");
        var $form = $(this).parent().parent().find('.orientationsave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        if ($('input[name="id_orientation"]').val() == "no") {
            data.append('desc_bloc1', CKEDITOR.instances["desc_bloc1"].getData());
            data.append('desc_bloc2', CKEDITOR.instances["desc_bloc2"].getData());
            data.append('desc_bloc3', CKEDITOR.instances["desc_bloc3"].getData());
            data.append('desc_bloc4', CKEDITOR.instances["desc_bloc4"].getData());
            data.append('desc_bloc5', CKEDITOR.instances["desc_bloc5"].getData());
            data.append('desc_bloc6', CKEDITOR.instances["desc_bloc6"].getData());
            data.append('desc_bloc7', CKEDITOR.instances["desc_bloc7"].getData());
            data.append('desc_bloc8', CKEDITOR.instances["desc_bloc8"].getData());
            data.append('desc_bloc9', CKEDITOR.instances["desc_bloc9"].getData());

            data.append('desc_bloc1_en', CKEDITOR.instances["desc_bloc1_en"].getData());
            data.append('desc_bloc2_en', CKEDITOR.instances["desc_bloc2_en"].getData());
            data.append('desc_bloc3_en', CKEDITOR.instances["desc_bloc3_en"].getData());
            data.append('desc_bloc4_en', CKEDITOR.instances["desc_bloc4_en"].getData());
            data.append('desc_bloc5_en', CKEDITOR.instances["desc_bloc5_en"].getData());
            data.append('desc_bloc6_en', CKEDITOR.instances["desc_bloc6_en"].getData());
            data.append('desc_bloc7_en', CKEDITOR.instances["desc_bloc7_en"].getData());
            data.append('desc_bloc8_en', CKEDITOR.instances["desc_bloc8_en"].getData());
            data.append('desc_bloc9_en', CKEDITOR.instances["desc_bloc9_en"].getData());
        } else {
            data.append('desc_bloc1', CKEDITOR.instances["desc_bloc1_edit"].getData());
            data.append('desc_bloc2', CKEDITOR.instances["desc_bloc2_edit"].getData());
            data.append('desc_bloc3', CKEDITOR.instances["desc_bloc3_edit"].getData());
            data.append('desc_bloc4', CKEDITOR.instances["desc_bloc4_edit"].getData());
            data.append('desc_bloc5', CKEDITOR.instances["desc_bloc5_edit"].getData());
            data.append('desc_bloc6', CKEDITOR.instances["desc_bloc6_edit"].getData());
            data.append('desc_bloc7', CKEDITOR.instances["desc_bloc7_edit"].getData());
            data.append('desc_bloc8', CKEDITOR.instances["desc_bloc8_edit"].getData());
            data.append('desc_bloc9', CKEDITOR.instances["desc_bloc9_edit"].getData());

            data.append('desc_bloc1_en', CKEDITOR.instances["desc_bloc1_edit_en"].getData());
            data.append('desc_bloc2_en', CKEDITOR.instances["desc_bloc2_edit_en"].getData());
            data.append('desc_bloc3_en', CKEDITOR.instances["desc_bloc3_edit_en"].getData());
            data.append('desc_bloc4_en', CKEDITOR.instances["desc_bloc4_edit_en"].getData());
            data.append('desc_bloc5_en', CKEDITOR.instances["desc_bloc5_edit_en"].getData());
            data.append('desc_bloc6_en', CKEDITOR.instances["desc_bloc6_edit_en"].getData());
            data.append('desc_bloc7_en', CKEDITOR.instances["desc_bloc7_edit_en"].getData());
            data.append('desc_bloc8_en', CKEDITOR.instances["desc_bloc8_edit_en"].getData());
            data.append('desc_bloc9_en', CKEDITOR.instances["desc_bloc9_edit_en"].getData());
        }
        $.ajax({
            url: '/addedit-orientation',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success(data.message,{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "";
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
