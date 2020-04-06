<script src="/assets/javascript/SimpleAjaxUploader.min.js"></script>
<script src="/assets/javascript/cropper.min.js"></script>
<script src="/assets/javascript/tinymce/tinymce.min.js"></script>
<script>

    <?include_once "views/helpers/functions.js.php"?>

    var arr = [];

    <?foreach ($this->form->countryList as $code):?>
    arr["<?=$code?>"]="<?=$code?>";
    <?endforeach;?>

    $(function () {

        tinymce.init({
            selector: 'textarea#content',
            height: 500,
            theme: 'modern',
            plugins: 'print preview spellchecker fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help code',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link image media | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat spellchecker code',
            image_advtab: true,
            browser_spellcheck: true,
            spellchecker_rpc_url: 'spellchecker.php',
            templates: [
                { title: 'Test template 1', content: 'Test 1' },
                { title: 'Test template 2', content: 'Test 2' }
            ],
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ]
        });

        $(':required').one('blur keydown', function() {
            console.log('touched', this);
            $(this).addClass('touched');
        });

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
            $("#jSubmitImage").click( origin, setImageVal );

        });

        $('#addCountry').click(function () {

            var code = $('#countrySelector').val();

            $('#allCountriesLabel').html('');

            if (code){

                if (arr[code]) return;

                var html = '<div class="country-item"><span class="country-code">'+code+'</span><span class="close-country" data-code="'+code+'">x</span><input type="hidden" name="countries[]" class="jCountriesHidden" value="'+code+'"> </div>';

                $('#countryList').append(html);

                arr[code] = true;
            }else{
                //all
                $('#allCountriesLabel').html('All');
                $('#countryList').html('');

                arr = [];

            }

            $('#countrySelector').val('');
        });

        $('#chkInfluencers').click(function () {

            if (this.checked){

                $('.jInfluencers').prop('disabled', false).parent().removeClass('disabled');

                if ($('.jInfluencers:checked').length==0){
                    $('#chkInstagram').get(0).checked = true;
                }

            }else{

                $('.jInfluencers').prop('disabled', true).parent().addClass('disabled');
            }
        });

        $('.jInfluencers').click(function () {

            if ($('.jInfluencers:checked').length==0){
                alert('You must choose either Youtube or Instagram');
                this.checked = true;
            }else {

                if (this.id =='chkInstagram'){
                    $('#chkYoutube').get(0).checked = false;
                }else{
                    $('#chkInstagram').get(0).checked = false;
                }

            }
        });


        $('#btnSave').click( function() {
            var self = $(this);

            self.addClass('disabled').prop('disabled', true);
            //check whether browser fully supports all File API
            if (window.File && window.FileReader && window.FileList && window.Blob && $('#video_url').val())
            {
                //get the file size and file type from file input field
                var fsize = $('#video_url')[0].files[0].size;

                if(fsize>5242880) //do something if file size more than 1 mb (1048576)
                {
                    alert(fsize +" Video must be less than 5MB");

                    self.prop('disabled', false).removeClass('disabled');
                    return;

                }

            }

            $('#formArticle').submit();
        });


        $(document).on('click','.close-country',function(){
            var self = $(this);
            var code = self.data('code');

            if (arr[code]){
                self.parent().remove();

                arr[code] = false;

            }



            if ($('.country-item').length==0)
                $('#allCountriesLabel').html('All');
        });


        <?if (!$form->id):?>
        $('#title').change(function () {
            $('#url').val(this.value.cleanup('-'));
        });
        <?endif?>

        <?if (strpos($this->form->tags, "INFLUENCERS")!==false):?>
        $('.jInfluencers').prop('disabled', false).parent().removeClass('disabled');
        <?endif?>
    })

</script>