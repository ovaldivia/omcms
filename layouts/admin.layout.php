<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?=env("APP_NAME")?></title>

    <!-- Bootstrap core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/cropper.css" rel="stylesheet">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700%7CMontserrat:700%7CDroid+Sans:400&subset=latin" rel="stylesheet">

    <link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />

    <style>
        html, body {
            height: 100%;
        }

        /*logo*/
        a.notinews-logo{
            font-family: "Montserrat", Arial;
            font-size: 30px;
            font-weight: 700;
            color: #ffffff;
            line-height: 30px;
            letter-spacing: -1.5px;
        }

        a.notinews-logo:hover{
            text-decoration: none;
        }


        .bg-black{
            background: #000;
        }

        .logo-point{
            color: #ce1126;
        }

        /* main */
        .main{
            margin: 0px 20px;
            font-family: "Hind", Arial;
            font-size: 18px;
            min-height: 100%;
            height:auto !important; /* cross-browser */
            height: 100%; /* cross-browser */
        }

        .blur{
            -webkit-filter: blur(5px);
            -moz-filter: blur(5px);
            -o-filter: blur(5px);
            -ms-filter: blur(5px);
            filter: blur(5px);
        }

        .main a{
            color: cornflowerblue;

        }

        .mobile-display{
            display: none;
        }
        .desktop-display{
            display: block;
        }

        .small-display{
            display: none;
        }
        .medium-display{
            display: block;
        }


        .main{
            margin: 0px 20px;
            font-family: "Hind", Arial;
            font-size: 18px;
        }

        .main a{
            color: cornflowerblue;

        }

        /* statuses */

        .item-status-deployed-prod{
             color: green;
             width: 200px;
             padding: 2px;
             background: white;
             border: 1px solid darkslategray;
             text-align: center;
         }

        .item-status-deployed-dev{
            color: lightgreen;
            width: 200px;
            padding: 2px;
            background: white;
            border: 1px solid darkslategray;
            text-align: center;
        }

        .item-scheduled{
            position: absolute;
            right: 0px;
            top: 0px;
            font-size: 30px;
        }

        .item-permanent{
            position: absolute;
            right: 40px;
            top: 0px;
            font-size: 30px;
        }

        .item-status-deleted{
            color: #ce1126;
            width: 105px;
            padding: 2px;
            background: white;
            border: 1px solid darkslategray;
            text-align: center;
        }

        .item-status-saved{
            width: 95px;
            color: goldenrod;
            padding: 2px;
            background: white;
            border: 1px solid darkslategray;
            text-align: center;
        }

        .item-status-archived{
            width: 150px;
            color: darkgrey;
            padding: 2px;
            background: white;
            border: 1px solid darkslategray;
            text-align: center;
        }

        .country-item{
            width: 80px;
            background: #28a745;
            border: 1px solid #ccc;
            margin: 5px 0 5px 0;
        }

        .country-code{
            padding-left: 5px;
            color: white;
        }

        .close-country{
            border-left: 1px solid #ccc;
            color: #ccc;
            cursor: pointer;
            width: 20px;
            text-align: center;
            float: right;
        }

        .country-labels{

            color: yellow;
        }

        .form-check-label.disabled{
            color: #cccccc;
        }

        /** thumbs */
        .notinews-thumb{
            font-family: "Montserrat", Arial;
            font-size: 18px;
            width: 300px;
            min-width: 300px;
            max-width: 300px;
            height: 350px;
            min-height: 350px;
            max-height: 350px;
            border-radius: 4px;
            margin: 10px auto;
            background-repeat: no-repeat;
            background-position: center;
        }


        .category{
            font-family: "Droid Sans", Arial;
            font-size: 14px;
            background: #ce1126;
            color: #ffffff;
            padding: 2px;
            font-weight:400;
            letter-spacing: 0.025em;
            line-height: 12px;
            text-transform: uppercase;
        }

        .disabled-btn{
            background-color: grey!important;
            color: white;
        }

        /* upload message */

        .upload-message{
            font-size: 12px;

        }

        :required {
            background-color: white;
        }

        .touched:required:valid {
            background-color: white;
        }

        .touched:required:invalid {
            background-color: pink;
        }

        .error{
            color: red;
        }
        .border-img{
            radius: 4px;
            border: 4px double #cccccc;
            margin: 5px 5px 5px 0px;
            background: #fff;
        }


        /**carousel*/
        .carousel-item {
            height: 65vh;
            min-height: 300px;
            background: no-repeat center center scroll;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }

        .entry-content{
            text-align: justify;
        }
        .alignleft{
            float: left;
        }

        h3{
            font-size: 18px;
            margin: 5px 0 5px 0;
        }

        .notinews-ultimas-side ul{
            list-style-type: none;
            padding-left:0;
        }

        .notinews-ultimas-side .news-thumb{
            width: 180px;
        }

        .notinews-ultimas-side .news-link{
            color: cornflowerblue;
        }


        @media only screen and (max-width: 550px) {
            .mobile-display{
                display: block;
            }
            .desktop-display{
                display: none;
            }
        }

        @media only screen and (max-width: 990px) {
            .small-display{
                display: block;
            }
            .medium-display{
                display: none;
            }
        }


    </style>

    <? $this->renderHeader()?>

</head>

<body>

<!-- Navigation -->
<nav class="navbar navbar-expand-lg navbar-dark bg-black py-3">

    <a class="notinews-logo" href="/admin/list"><?=env("APP_NAME")?></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
            <?if (basename($_SERVER['REQUEST_URI'])!='omcmsadmin'):?>
                <li class="nav-item active">
                    <a href="/admin/list" style="color: white; margin-right: 20px;line-height: 50px;">Main</a>
                </li>
                <li class="nav-item ">
                    <a href="/admin/flash_news" style="color: white; margin-right: 20px;line-height: 50px;">Flash</a>
                </li>
                <li class="nav-item ">
                    <a href="/admin/logs" style="color: white; margin-right: 20px;line-height: 50px;">Logs</a>
                </li>
                <li class="nav-item ">
                    <a href="/admin/reports" style="color: white; margin-right: 20px;line-height: 50px;">Reports</a>
                </li>
                <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="<?=$_SESSION['profile_image']?:"/assets/image/no-photo-large.png"?>" class="avatar" style="width: 35px; border-radius: 25px;">

                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                        <a class="dropdown-item" href="/admin/profile">Profile</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/admin/logout">Logout</a>
                    </div>
                </li>
            <?endif?>
        </ul>
    </div>



</nav>


<? $this->renderView()?>


<!-- Footer -->
<footer class="pt-2 pb-1 bg-black">
    <p class="ml-3 left text-muted small" style="line-height: 30px">Copyright © 2019 <?=env("APP_NAME")?></p>
</footer>

<!-- Bootstrap core JavaScript -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.bundle.min.js"></script>

<? $this->renderFooter()?>


</body>

</html>
