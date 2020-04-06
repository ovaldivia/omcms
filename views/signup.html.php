<?php

?>

<?include_once "views/helpers/header.html.php"?>


<div class="container contact" style="height: 700px;
    width: 100%;
    margin-top: 62px;
    background-color: white;">

    <h1>Sign Up</h1>
    <br>
    <?include_once "views/helpers/messages.html.php"?>
    <p>
        myASLTech is an assistive technology tool designed to make your job easier! Like any tool you'll need to understand how to use it to get the most from the interconnected databases.


    </p>

    <p>
        Join our online community and be the first to know when:

    </p>

    <ol>
        <li>Free resources are available for download</li>
        <li>Additional features are added to the ever growing database</li>
        <li>New training videos are uploaded</li>
        <li>Opportunities to share your testimonal</li>
        <li>Notifications when new blog posts are published</li>
        <li>And More!</li>
    </ol>

    </ul>

    <br>

    <label style="margin-left: 10px;"><span class="text-danger">*</span> Required fields</label>

    <form action="/signup" method="POST">
        <div class="container" style="width: 800px;">
            <div class="row" style="margin-top:20px; ">
                <div class="form-group">
                    <label class="control-label col-sm-2 col-md-2 required" for="name">Name:</label>
                    <div class="col-sm-4 col-md-5">
                        <input type="text" class="form-control" id="fname" placeholder="First Name" name="fname" required value="<?=$this->form->fname?>">
                    </div>
                    <div class="col-sm-4 col-md-5">
                        <input type="text" class="form-control" id="lname" placeholder="Last Name" name="lname" required value="<?=$this->form->lname?>">
                    </div>
                </div>
            </div>

            <div class="row" style="margin-top:20px; ">
                <div class="form-group">
                    <label class="control-label col-sm-2 col-md-2" for="role" >Role:</label>
                    <div class="col-sm-8 col-md-10">
                        <input type="text" class="form-control" id="role" placeholder="Enter role" name="role" value="<?=$this->form->role?>">
                    </div>
                </div>

            </div>

            <div class="row" style="margin-top:20px; ">
                <div class="form-group">
                    <label class="control-label col-sm-2 col-md-2" for="affiliation" >Affiliation:</label>
                    <div class="col-sm-8 col-md-10">
                        <input type="text" class="form-control" id="affiliation" placeholder="Enter affiliation" name="affiliation" value="<?=$this->form->affiliation?>">
                    </div>
                </div>

            </div>

            <div class="row" style="margin-top:20px; ">
                <div class="form-group">
                    <label class="control-label col-sm-2 col-md-2 required" for="email">Email:</label>
                    <div class="col-sm-8 col-md-10">
                        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" required value="<?=$this->form->email?>">
                    </div>
                </div>
            </div>



            <div class="row" style="margin-top:20px; ">

                <div class="form-group">
                    <label class="control-label col-sm-2 col-md-2" for="phone">Phone:</label>
                    <div class="col-sm-8 col-md-10">
                        <input type="tel" class="form-control" id="phone" placeholder="Enter phone" name="phone" value="<?=$this->form->phone?>">
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-8 col-md-10">
                        <button type="submit" class="btn btn-primary" style="margin-top: 20px;float: right;">Signup</button>
                    </div>
                </div>


            </div>




        </div>

    </form>





</div>
<?include_once "views/helpers/footer.html.php"?>