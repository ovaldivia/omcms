<div class="modal fade" id="getImage">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Add/Change Image</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">

                <div id="imagePicker" style="position:relative; min-height:500px; padding-top:10px">

                    <!--uploader-->

                    <table id="jModalUploader" class="empty" style="height:380px; width:100%;">
                        <tr>
                            <td style="height:100%; width:100%; vertical-align:middle;">
                                <div class="jUploadDropzone" style="height: 100%;border: 0.64px dashed #54a0e7;">
                                    <button type="button" class="jUploadButton" style="height:100%; width:100%; position:relative; background: transparent;">
                                        <div class="help-message">Drag file here or click button to upload.</div>
                                        <a class="btn btn-primary text-white">Upload Image</a>
                                        <div class="jUploadMessage upload-message error"></div>
                                    </button>
                                    <span class="jUploadProgress progress active" style="display:none;">
                                          <span class="jUploadProgressBar progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></span>
                                      </span>
                                </div>
                            </td>
                        </tr>
                        <tr>

                            <td>
                                <img class="jImage" src="" alt="" style="position:relative; margin:0 auto; max-width:640px;">
                            </td>

                        </tr>
                    </table>

                </div>


                <div id="cropperContainer" style="position:relative; min-height:500px; display: none;">

                    <div class="border" style="width:642px; margin:20px auto; padding:1px; position:relative;">
                        <div id="imageCropContainer" style="width:640px; height:450px; display:table;">
                            <img id="imageToCrop" src="" onload="$(this).cropper(cropperSettings);" alt="" style="max-width:100%; max-height:600px; margin:0 auto;">
                        </div>

                        <div id="cropperLoading" style="position:absolute; top:50%; left:50%; margin-top:-9px; margin-left:-9px;">
                            <div class="spinner"><img src="/assets/image/ajax-loader.gif"></div>
                        </div>

                    </div>

                </div>




            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">Close</button> <button type="button" id="jSubmitImage" class="btn btn-success">Add</button>
            </div>

        </div>
    </div>
</div>