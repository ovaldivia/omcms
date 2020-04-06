<div class="modal fade" id="bannerModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title" id="bannerHeader">Add Banner</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
                <span id="bannerMessage" style="color:red;"></span>


                <form>
                    <div class="form-group">
                        <label for="bannerName">Name</label>
                        <input type="text" class="form-control" id="bannerName" name="name" placeholder="Banner name" required>
                    </div>
                    <div class="form-group">
                        <label for="bannerType">Banner Type</label>
                        <select class="form-control" id="bannerType" name="type">
                            <option>Rectangle Banner</option>
                            <option>Long vertical banner</option>
                            <option>Long horizontal banner</option>
                            <option>Flex banner</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="bannerCode">Banner code</label>
                        <textarea class="form-control" id="bannerCode" name="content" rows="3"></textarea>

                    </div>
                    <div class="form-group" id="orderDiv">

                        <label for="bannerOrder">Order</label><input type="number" id="bannerOrder">
                    </div>
                </form>

            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">Close</button> <button type="button" class="btn btn-success" id="saveBanner">Save</button>
            </div>

        </div>
    </div>
</div>