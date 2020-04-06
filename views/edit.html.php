

<div class="container">
    <?include_once "views/helpers/messages.html.php"?>

    <form id="formArticle" method="POST" enctype="multipart/form-data" action="/admin/edit" class="mt-4 mb-4">

        <?if ($this->form->id):?>
        <div class="form-group">
            <label for="id">ID# <?=$this->form->id?></label>
        </div>
        <?endif?>

        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" name="title" class="form-control" id="title" placeholder="Title" value="<?=htmlspecialchars($this->form->title)?>" required minlength="10" maxlength="69">
        </div>

        <div class="form-group">
            <label for="url">URL</label>
            <input type="text" name="url" class="form-control" id="url" placeholder="Article url" value="<?=$this->form->url?>" required minlength="10" maxlength="70">
        </div>

        <div class="form-group">
            <label for="date">Date</label>

            <input type="date" name="date" class="form-control" id="date" style="width: 200px;" placeholder="date" value="<?=($this->form->date?strftime("%Y-%m-%d",strtotime($this->form->date)):'')?>" required >
        </div>

        <div class="form-group">
            <label for="meta_keywords">Keywords</label>
            <input type="text" class="form-control" id="meta_keywords" name="meta_keywords" value="<?=htmlspecialchars($this->form->meta_keywords)?>" placeholder="Keywords" required minlength="10" maxlength="200">
        </div>

        <div class="form-group">
            <label for="meta_description">Description</label>
            <input type="text" class="form-control" id="meta_description" name="meta_description" value="<?=htmlspecialchars($this->form->meta_description)?>" placeholder="Description" required minlength="10" maxlength="200">
        </div>


        <div class="form-group">
            <label>Tags</label>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="tags[]" value="ASSISTIVE TECHNOLOGY TOOLS" <?if (strpos($this->form->tags, "ASSISTIVE TECHNOLOGY TOOLS")!==false) echo 'checked';?>>
                    ASSISTIVE TECHNOLOGY TOOLS
                </label>
            </div>
            <div class="form-check disabled">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="tags[]" value="DEAF EDUCATION"  <?if (strpos($this->form->tags, "DEAF EDUCATION")!==false) echo 'checked';?>>
                    DEAF EDUCATION
                </label>
            </div>
            <div class="form-check disabled">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="tags[]" value="TEACHER OF THE DEAF"  <?if (strpos($this->form->tags, "TEACHER OF THE DEAF")!==false) echo 'checked';?>>
                    TEACHER OF THE DEAF
                </label>
            </div>
<div class="form-check disabled">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="tags[]" value="AMERICAN SIGN LANGUAGE"  <?if (strpos($this->form->tags, "AMERICAN SIGN LANGUAGE")!==false) echo 'checked';?>>
                    AMERICAN SIGN LANGUAGE
                </label>
	    </div>


<div class="form-check disabled">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="tags[]" value="ASL SUPPORTED RESOURCES"  <?if (strpos($this->form->tags, "ASL SUPPORTED RESOURCES")!==false) echo 'checked';?>>
                    ASL SUPPORTED RESOURCES
                </label>

        </div>


        <div class="form-group">
            <label for="order">Order</label>
            <input type="number" id="order" class="form-control" id="order" style="width: 90px;" step="100" name="order" value="<?=$this->form->order?:100?>" placeholder="Order" required minlength="100" maxlength="200">
        </div>

        <div class="form-group">
            <label for="">Author:</label>
            <span style="font-weight: bold"><?=ucfirst($this->form->author)?></span>

        </div>
        <div class="form-group">
            <label for="">Reviewer:</label>
            <span style="font-weight: bold"><?=ucfirst($this->form->reviewer)?></span>

        </div>

        <div class="form-group">
            <label for="">Countries: <span id="allCountriesLabel" style="font-weight: bold"><?=(count($this->form->countryList)?'':'All')?></span></label>

            <div id="countryList">
                <?foreach ($this->form->countryList as $code):?>
                    <div class="country-item"><span class="country-code"><?=$code?></span><span class="close-country" data-code="<?=$code?>">x</span><input type="hidden" name="countries[]" class="jCountriesHidden" value="<?=$code?>"> </div>
                <?endforeach;?>
            </div>

            <div>
                <select id="countrySelector" style="width: 150px;">
                    <option value="">All</option>
                    <option value="AR">Argentina</option>
                    <option value="CO">Colombia</option>
                    <option value="MX">Mexico</option>
                    <option value="VE">Venezuela</option>



                    <option value="AF">Afghanistan</option>
                    <option value="AX">Åland Islands</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguilla</option>
                    <option value="AQ">Antarctica</option>
                    <option value="AG">Antigua and Barbuda</option>

                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia, Plurinational State of</option>
                    <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">British Indian Ocean Territory</option>
                    <option value="BN">Brunei Darussalam</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos (Keeling) Islands</option>

                    <option value="KM">Comoros</option>
                    <option value="CG">Congo</option>
                    <option value="CD">Congo, the Democratic Republic of the</option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CW">Curaçao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands (Malvinas)</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Territories</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HM">Heard Island and McDonald Islands</option>
                    <option value="VA">Holy See (Vatican City State)</option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran, Islamic Republic of</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IM">Isle of Man</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KP">Korea, Democratic People's Republic of</option>
                    <option value="KR">Korea, Republic of</option>
                    <option value="KW">Kuwait</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Lao People's Democratic Republic</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>

                    <option value="FM">Micronesia, Federated States of</option>
                    <option value="MD">Moldova, Republic of</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PS">Palestinian Territory, Occupied</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RE">Réunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russian Federation</option>
                    <option value="RW">Rwanda</option>
                    <option value="BL">Saint Barthélemy</option>
                    <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="MF">Saint Martin (French part)</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SX">Sint Maarten (Dutch part)</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                    <option value="SS">South Sudan</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syrian Arab Republic</option>
                    <option value="TW">Taiwan, Province of China</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania, United Republic of</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="UM">United States Minor Outlying Islands</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>

                    <option value="VN">Viet Nam</option>
                    <option value="VG">Virgin Islands, British</option>
                    <option value="VI">Virgin Islands, U.S.</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                </select>

                <button type="button" class="btn btn-primary" id="addCountry">Add</button>

            </div>

        </div>

        <table>
            <tr>
                <td>
                    <div style="width: 172px; height: 200px; overflow: hidden;" class="border-img">
                        <img id="thumbImage" src="<?=($this->form->thumb_image?$this->form->thumb_image:'')?>" alt="">
                    </div>
                </td>
                <td>
                    <div style="width: 600px; height: 200px; overflow: hidden;" class="border-img">
                        <img id="largeImage" src="<?=($this->form->large_image?$this->form->large_image:'')?>" alt="">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <button class="btn btn-primary jImageThumbnail " style="width: 160px; font-size: 12px;" type="button" data-toggle="modal" data-target="#getImage" data-type="thumb" data-ratio="0.85"><span class="glyphicon glyphicon-plus">+</span>
                        <?=($this->form->thumb_image?'Edit':'Add')?> Thumbnail image</button>
                </td>
                <td>
                    <button class="btn btn-primary jImageThumbnail" style="width: 160px; font-size: 12px;" type="button" data-toggle="modal" data-target="#getImage" data-type="large" data-ratio="2.5"><span class="glyphicon glyphicon-plus">+</span>
                        <?=($this->form->large_image?'Edit':'Add')?> Large image</button>

                    <a href="/admin/imagelib" class="btn btn-primary" style="width: 160px; font-size: 12px;" target="_blank">Image Lib</a>
                </td>
            </tr>
        </table>

        <div class="form-group">
            <label for="url">Video</label>
            <input type="file" name="video_url" class="form-control" id="video_url" accept="video/mp4">
        </div>

        <?if ($this->form->video_url):?>
        <div class="form-group">
            <video width="320" height="240" controls>
                <source src="<?=$this->form->video_url?>" type="video/mp4">
            </video>
        </div>
        <?endif;?>


        <div class="form-group">
            <label for="content">Content</label>
            <textarea class="form-control" id="content" name="content" rows="20"><?=$this->form->content?></textarea>
        </div>
        <div>
            <button type="button" class="btn btn-success" id="btnSave">Save</button> <a href="/<?=$this->form->url?>" target="_new" class="btn">Preview</a>
        </div>
        <input type="hidden" name="status" value="<?=$this->form->status?:'1'?>">
        <input type="hidden" name="uid" value="<?=$this->form->uid?:$this->uid?>">
        <input type="hidden" name="id" value="<?=$this->id?:''?>">


        <input type="hidden" id="thumbImageHidden" name="thumb_image" value="<?=($this->form->thumb_image?$this->form->thumb_image:'')?>">
        <input type="hidden" id="largeImageHidden" name="large_image" value="<?=($this->form->large_image?$this->form->large_image:'')?>">

    </form>
</div>

<!-- modals -->
<?include_once "views/helpers/getimage.html.php"?>




