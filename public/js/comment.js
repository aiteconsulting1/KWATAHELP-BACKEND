$(document).ready(function () {
    $('.delete_comment').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var id = $(this).attr('attr-id');
        swal({
            title: "Etes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer un commentaire.",
            icon: "warning",
            buttons: true
          })
          .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/dashboard/comment/delete/" + id,
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
