<?$now = date("h:ia", strtotime('-5 hours'))?>
<div class="modal fade" id="scheduleModal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Schedule Deployment</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">

                <div class="form-group">
                    <p>Server Time: <?=$now?> Pan</p>
                    <p>Deploy:</p>

                    <select id="scheduleDay">
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                    </select>

                    <select id="scheduleHour">
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>

                    <select id="scheduleMin">
                        <option value="00">00</option>
                        <option value="05">05</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                        <option value="35">35</option>
                        <option value="40">40</option>
                        <option value="45">45</option>
                        <option value="50">50</option>
                        <option value="55">55</option>
                    </select>

                    <select id="scheduleLate">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>

                <p>I certify that I've read and found no errors in this article: <input type="checkbox" class="jCheckedReviewer"></p>


                <p id="scheduleError" style="color:red"></p>

            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">Cancel</button> <button type="button" class="btn btn-success jDeployProd" id="scheduleArticle" disabled>Schedule</button>
            </div>

        </div>
    </div>
</div>
