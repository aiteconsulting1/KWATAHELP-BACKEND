$(document).ready(function () {
    $('.blog-activate').on('change', function (e) {
        e.preventDefault();
        console.log($(this).is(':checked'));
        var self = $(this);
        if ($(this).is(':checked')) {
            $.ajax({
                url: "/edit-blog/" + this.value,
                type: "PUT",
                data: {
                    status: '1'
                },
                success: function (reponse) {
                    self.parent().find(".yesorno").html("Publié");
                },
                error: function (reponse) {
                    self.parent().find(".yesorno").html("Non Publié");
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
                url: "/edit-blog/" + this.value,
                type: "PUT",
                data: {
                    status: '0'
                },
                success: function (reponse) {
                    self.parent().find(".yesorno").html("Non Publié");
                },
                error: function (reponse) {
                    self.parent().find(".yesorno").html("Publié");
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

    $('.delete_blog').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer un article/conseils.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/blog/delete/" + id,
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

    $('.submit_blog').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        $(this).html("En cours...");
        var $form = $('.blogsave');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('content',CKEDITOR.instances['description_blog'].getData());
        data.append('content_en',CKEDITOR.instances['description_blog_en'].getData());
        $.ajax({
            url: '/addedit-blog',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success("Article ajoutée/modifiée avec succès !",{
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
                setTimeout(function(){
                    window.location.href = "/dashboard/blog";
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
