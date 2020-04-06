<?php

?>

<?include_once "views/helpers/header.html.php"?>





    <div class="container contact" style="height: 600px;
    width: 100%;
    margin-top: 62px;
    background-color: white;">

        <h1>Contact Us</h1>
        <br>

        <?include_once "views/helpers/messages.html.php"?>

        <p>We want to hear from you! Our goal is to make your myASLTech membership experience seamless. Send us your questions and comments and we'll address each one.</p>

        <br>

        <label style="margin-left: 10px;"><span class="text-danger">*</span> Required fields</label>

        <div class="row">

            <form method="post" action="/contact">

            <div class="col-md-12">
                <div class="contact-form">
                    <div class="form-group">
                        <label class="control-label col-sm-2 required" for="name">Name:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="name" placeholder="Enter Name" name="name" required value="<?=$this->form->name?>">
                        </div>
                    </div>
                    <br><br><br>

                    <div class="form-group">
                        <label class="control-label col-sm-2 required" for="email">Email:</label>
                        <div class="col-sm-10">
                            <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" value="<?=$this->form->email?>" required>
                        </div>
                    </div>
                    <br><br><br>
                    <div class="form-group">
                        <label class="control-label col-sm-2 required" for="comment">Comment:</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" rows="5" id="comment" name="comment" required><?=$this->form->comment?></textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary" style="margin-top: 10px;float: right;">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        </form>




    </div>

<?include_once "views/helpers/footer.html.php"?>
