<script src="/assets/javascript/SimpleAjaxUploader.min.js"></script>
<script src="/assets/javascript/cropper.min.js"></script>
<script>

    <?include_once "views/helpers/functions.js.php"?>


    function setImageValue (event) {

        var origin = event.data;

        $("#jSubmitImage").addClass('disabled-btn').prop('disabled',true);

        setTimeout(function(){
            var obj = cropImage();
            $('#getImage').modal('hide');
            $("#jSubmitImage").prop('disabled',false);
            $('#imageHidden').val(obj.path);
            $('#frmImages').submit();
        },100);
    }

    function copyToClipboard(text) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
    }

    $(function () {

        $('#getImage').on('hide.bs.modal', function () {
            $(this).data('ratio', '');
            $(this).data('crop', '');
            $(this).data('selected_url', '');
            $(this).data('type', '');
            $(this).data('category', '');

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
            self.data('category', origin.data('category'));

            $('#jModalUploader').data('type', origin.data('type')).data('category', origin.data('category')).each( createUploader );
            $("input[type='file'][name='uploadfile']").closest('div').removeClass('hidden-uploader-container');
            uploader.setAbortBtn(submitButton); //submit button aborts uploads in progress, but doesn't undo completed upload.

            $("#jSubmitImage").off('click');  //!important: must unbind previous click binding
            $("#jSubmitImage").click( origin, setImageValue );

        });


        $('.jLargeType').click(function(){

            var type = 'thumb';

            if (this.checked){
                type = 'large';
            }

            $('.jImageThumbnail').data('type',type);
        });

        $('.jRatio').click(function(){


            var ratio = this.value || "1";

            $('.jImageThumbnail').data('ratio',ratio);


        });

        $('.jCopyUrl').click(function(){

            var text = $(this).data('url');

            copyToClipboard(text);

            $('.jSuccessMessage').html("URL copied to clipboard").show().fadeOut(3000);

        });

        $('.jCategory').change(function(){

            var value = $(this).val();

            console.log('cat',value);

            $('.jImageThumbnail').data('category',value);

            $('#imageHiddenCategory').val(value);

        });


        $('.jRemoveImage').click(function(){
            var id = $(this).data('id');
            var blnYes = confirm("Do you want to delete the image?");
            if (blnYes){
                document.location="/admin/delete_image?id=" + id + '&ref=' + encodeURIComponent(window.location.href);
            }
        });


    })

</script>