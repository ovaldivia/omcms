<div class="main">
    <div class="row">
        <div class="col-md-offset-5 col-md-3" style="margin: 20px auto;">
            <form method="post" action="">
                <div class="form-login">
                    <h4>Login</h4>
                    <?if ($_REQUEST['e']):?>
                    <div class="alert alert-danger" role="alert">
                        Invalid username or password
                    </div>
                    <?endif;?>

                    <input type="text" id="username" name="username" value="<?=$_REQUEST['u']?>" class="form-control input-sm chat-input" placeholder="username" required/>
                    </br>
                    <input type="password" id="password" name="password" class="form-control input-sm chat-input" placeholder="password" minlength="6" maxlength="20" required />
                    </br>
                    <div class="wrapper">
                    <span class="group-btn">
                        <button type="submit" class="btn btn-primary btn-md">Submit <i class="fa fa-sign-in"></i></button>
                    </span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- /.container -->