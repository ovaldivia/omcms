<div class="main">
    <?include_once "views/helpers/messages.html.php"?>
    <br>


    <h2>Profile</h2>
    
    <div style="position: relative;">
        <img id="jProfileImage" src="<?=$this->form->profile_image?:"/assets/image/no-photo-large.png"?>" style="border-radius: 100px; width: 200px; height: 200px; position: relative">
        <div style="position: absolute; top: 85px; left:70px;"><a href="#" id="jChangePhoto" data-toggle="modal" data-target="#getImage" data-type="profile" data-ratio="1">Change</a></div>
    </div>
    <div id="saveMemo" class="alert-success alert-dismissible" style="padding: 5px; margin: 5px 0px; width: 300px; display: none">Press "Update" to save photo</div>


    <form id="formProfile" method="POST" action="/admin/profile" class="mt-4 mb-4">

        <input type="hidden" id="profileImageHidden" name="profile_image" value="<?=$this->form->profile_image?:"/assets/image/no-photo-large.png"?>">

        <div class="form-group">
            <label for="first_name">First Name</label>
            <input type="text" name="first_name" class="form-control" id="first_name" placeholder="First Name" value="<?=$this->form->first_name?>" required>
        </div>

        <div class="form-group">
            <label for="last_name">Last Name</label>
            <input type="text" name="last_name" class="form-control" id="last_name" placeholder="Last Name" value="<?=$this->form->last_name?>" required>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="text" name="email" class="form-control" id="email" placeholder="Email" value="<?=$this->form->email?>" required>
        </div>

        <div>
            <button type="submit" class="btn btn-success" id="btnSave">Update</button>
        </div>
    </form>


    <h2>Change password</h2>


    <form id="formPassword" method="POST" action="/admin/change_password" class="mt-4 mb-4">


        <div class="form-group">

            <input type="password" name="current_password" class="form-control" id="current_password" placeholder="Current Password" required>
        </div>

        <div class="form-group">

            <input type="password" name="new_password" class="form-control" pattern="^\S{6,}$" onchange="this.setCustomValidity(this.validity.patternMismatch ? 'Must have at least 6 characters' : ''); if(this.checkValidity()) form.confirm_password.pattern = this.value;" id="new_password" placeholder="New Password" required>
        </div>

        <div class="form-group">

            <input type="password" name="confirm_password" class="form-control" pattern="^\S{6,}$" id="confirm_password" onchange="this.setCustomValidity(this.validity.patternMismatch ? 'Please enter the same Password as above' : '');" placeholder="Confirm Password" required>
        </div>

        <div>
            <button type="submit" class="btn btn-success">Change Password</button>
        </div>
    </form>

</div>
<!-- modals -->
<?include_once "views/helpers/getimage.html.php"?>