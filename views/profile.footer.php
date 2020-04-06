<script src="/assets/javascript/SimpleAjaxUploader.min.js"></script>
<script src="/assets/javascript/cropper.min.js"></script>
<script>

    <?include_once "views/helpers/functions.js.php"?>

    function setProfileVal (event) {

        var origin = event.data;
        $("#jSubmitImage").addClass('disabled-btn').prop('disabled',true);

        setTimeout(function(){
            console.log('saving image...');

            var obj = cropImage();

            if ( obj.path ) {
                var newImageUrl = obj.path + '?=s' + (new Date()).getTime();
            }

            console.log('log',obj);

            var type = $('#getImage').data('type');

            $('#getImage').modal('hide');
            $("#jSubmitImage").removeClass('disabled-btn').prop('disabled-btn',false);

            $('#jProfileImage').attr('src', newImageUrl);
            $('#profileImageHidden').val( obj.path);

            $('#saveMemo').show();
            setTimeout(function(){$('#saveMemo').hide();},5000);
        },100);

    }

    $(function () {

        $('#getImage').on('hide.bs.modal', function () {
            $(this).data('ratio', '');
            $(this).data('crop', '');
            $(this).data('selected_url', '');
            $(this).data('type', '');

            clearCropper();
            hideCropper();
            uploader.destroy();
        });

        $('#getImage').on('show.bs.modal', function (e) {

            var self = $(this);
            var origin = $(e.relatedTarget);
            var submitButton = $('#jSubmitImage');

            $(this).each(showDropzone);
            self.data('ratio', origin.data('ratio'));
            self.data('type', origin.data('type'));

            $('#jModalUploader').data('type', origin.data('type')).each( createUploader );
            $("input[type='file'][name='uploadfile']").closest('div').removeClass('hidden-uploader-container');
            uploader.setAbortBtn(submitButton); //submit button aborts uploads in progress, but doesn't undo completed upload.

            $("#jSubmitImage").off('click');  //!important: must unbind previous click binding
            $("#jSubmitImage").click( origin, setProfileVal );

        });

    })

</script>