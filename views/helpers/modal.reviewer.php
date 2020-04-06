<div class="modal fade" id="reviewerModal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Important!</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">

                <div class="form-group">
                    <p>I certify that I've read this article and found no errors: <input type="checkbox" id="reviewerChecked" class="jCheckedReviewer"></p>

                </div>

                <p id="scheduleError" style="color:red"></p>

            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">Cancel</button> <button type="button" class="btn btn-success jDeployProd" id="deployArticle" disabled>Deploy</button>
            </div>

        </div>
    </div>
</div>
