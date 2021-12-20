$(document).ready(function () {
    $('.changestatus').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        // vt.info("En cours...",{
        //     position: "top-center",
        //     duration: 5000,
        // });
        $.ajax({
            url: "/changestatus-candidatures/" + self.attr("attr-id"),
            type: "PUT",
            data: {
                statut: self.attr("attr-value")
            },
            success: function (reponse) {
                vt.success(reponse.message,{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                $('.to_email').val(reponse.to);
                $('.sujet_email').val(reponse.subject);
                CKEDITOR.instances['contenu_email'].setData(reponse.data)
                $('#modalrelecturemail').modal('show');
                $('#modalrelecturemail').addClass('show');
            //     setTimeout(function(){
            //         window.location.href = "/dashboard/candidatures";
            //    }, 2000);
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

    });
    
    $('.print_candidature').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        // vt.info("Chargement des données...",{
        //     position: "top-center",
        //     duration: 1000,
        // });
        $.ajax({
            url: "/dashboard/candidatures/print/" + id,
            type: "GET",
            success: function (reponse) {
                // vt.success("Impression réalisée avec succès !",{
                //     title: "Succès !",
                //     position: "top-center",
                //     duration: 5000,
                //     closable: true,
                //     focusable: true,
                //     callback: undefined
                // });
                // window.location.href = reponse.data;
                $('#modalprint .modal-body').html(reponse);
                $('#modalprint').modal('show');
                $('#modalprint').addClass('show');
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

    });
    
    $('.imprimermodal').on('click', function (e) {
        e.preventDefault();
        $('#modalprint .modal-body').printThis({
            debug: false,
            importStyle: false,
            removeInline: false,
        });
    });

    $('.submit_candidature').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var tip = $(this).attr("attr-type");
        var $form = $('.candidaturesave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('comment',CKEDITOR.instances['comment_candidature'].getData());
        data.append('description',CKEDITOR.instances['description_candidature'].getData());
        $.ajax({
            url: tip == "save" ? '/addedit-candidatures' : '/edit-cand',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                console.log(data.type);
                self.html(texte_bouton);
                vt.success("Candidature ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "/dashboard/candidatures";
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

    $('.send_verified_email').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.add_pj_send_email');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('body',CKEDITOR.instances['contenu_email'].getData());
        $.ajax({
            url: '/sendmail-cand',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                console.log(data.type);
                self.html(texte_bouton);
                vt.success("Réponse envoyée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "/dashboard/candidatures";
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

    $('.submit_reponse').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.reponsesave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('content_ok',CKEDITOR.instances['content_ok'].getData());
        data.append('content_no',CKEDITOR.instances['content_no'].getData());
        data.append('content_interview',CKEDITOR.instances['content_interview'].getData());
        $.ajax({
            url: "/addedit-reponsemail",
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                console.log(data.type);
                self.html(texte_bouton);
                vt.success("Réponse mail ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "/dashboard/reponsemail";
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
