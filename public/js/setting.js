$(document).ready(function () {
    $('.save_setting').on('click', function (e) {
        e.preventDefault();
        var texte_bouton = $(this).text();
        var self = $(this);
        var unit = self.attr('attr-unit');
        var unit_en = self.attr('attr-unit1');
        $(this).html("En cours...");
        var $form = $(this).parent().find('.form_setting');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        data.append('fr_value', CKEDITOR.instances[unit].getData());
        data.append('en_value', CKEDITOR.instances[unit_en].getData());
        $.ajax({
            url: '/dashboard/setting',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                self.html(texte_bouton);
                vt.success(data.message, {
                    title: "Succès !",
                    position: "top-center",
                    duration: 5000,
                    closable: true,
                    focusable: true,
                    callback: undefined
                });
            },
            error: function (error) {
                self.html(texte_bouton);
                console.log(error);
                vt.error("Une erreur est survenue, veuillez reessayer plutard !", {
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
    $('.change_type').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var type = self.attr('type');
        $("#setting_type").val(type)
        $("#title").html(self.text())

        $.ajax({
            url: '/api/setting?type=' + type,
            type: 'GET',
            success: function (data) {
                let setting = data.data
                if (setting) {
                    $("#setting_id").val(setting._id)
                    CKEDITOR.instances["desc_bloc2"].setData(setting.fr_value)
                    CKEDITOR.instances["desc_bloc2_en"].setData(setting.en_value)
                } else {
                    $("#setting_id").val("")
                    CKEDITOR.instances["desc_bloc2"].setData("")
                    CKEDITOR.instances["desc_bloc2_en"].setData("")
                }
            },
            error: function (error) {
                self.html(texte_bouton);
                console.log(error);

            }
        })
    })
})