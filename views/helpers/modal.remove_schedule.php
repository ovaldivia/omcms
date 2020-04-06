<?$now = date("h:ia", strtotime('-5 hours'))?>
<div class="modal fade" id="removeScheduleModal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Remove Schedule</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">

                <div class="form-group">
                    <p>Server Time: <?=$now?> Pan</p>
                    <p>Scheduled: <span id="scheduledDate"></span></p>
                    <p>Do you want to remove this schedule?</p>


                </div>

                <p id="removeScheduleError" style="color:red"></p>

            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">No</button> <button type="button" class="btn btn-danger" id="removeSchedule">Remove</button>
            </div>

        </div>
    </div>
</div>