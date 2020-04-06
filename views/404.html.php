<?php

?>
<style>
    .error-template {padding: 40px 15px;text-align: center; width: 100%;}
    .error-actions {margin-top:15px;margin-bottom:15px;}
    .error-actions .btn { margin-right:10px; }
</style>

<div class="container" style="height: 600px; margin-top: 62px;">
    <div class="row">
        <div class="error-template">

            <h2>Page not found!</h2>
            <div class="error-details">
                The url could not be found on this site<br>

            </div>
            <div class="error-actions">
                <a href="/" class="btn text-white" style="background: #ce1126;">
                    <i class="icon-home icon-white"></i>Home Page </a>
            </div>
        </div>
    </div>
</div>
<? exit();?>
