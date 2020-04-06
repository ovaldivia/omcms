

<div class="container-fluid">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">

                <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Categories</span>
                    <a class="d-flex align-items-center text-muted" href="#">
                        <span data-feather="plus-circle"></span>
                    </a>
                </h6>

                <ul class="nav flex-column mb-2">
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/imagelib?cat=&p=1">
                            <span data-feather="file-text"  class="<?=($this->categoryHeader=='All'?"text-primary":"text-info")?>">All</span>

                        </a>
                    </li>

                    <?foreach ($this->form->categories as $obj):?>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/imagelib?cat=<?=strtolower($obj->category)?>&p=1">
                            <span data-feather="file-text"  class="<?=($this->categoryHeader==ucfirst($obj->category)?"text-primary":"text-info")?>"><?=$obj->category?></span>

                        </a>
                    </li>
                    <?endforeach;?>
                </ul>


                <fieldset class="active border p-2">
                    New

                    <div style="text-align: left; margin: 10px 0px 0px 10px;">
                        <label>Ratio</label>
                        <div><input type="radio" name="ratio" class="jRatio" checked value="2"> 2:1 <input type="radio" class="jRatio" name="ratio" value="1"> 1:1  <input type="radio" name="ratio" class="jRatio" value="0.5"> 1:2</div>
                    </div>

                    <div style="text-align: left; margin: 10px 0px 0px 10px;">
                        <label>Ratio</label>
                        <div><input type="checkbox"  class="jLargeType" value="large"> Large Image</div>
                    </div>

                    <div style="text-align: left; margin: 10px 0px 0px 10px;">
                        <select class="jCategory">
                            <?foreach ($this->form->categories as $obj):?>
                            <option value="<?=$obj->category?>"><?=$obj->category?></option>
                            <?endforeach;?>
                        </select>
                    </div>

                    <div style="text-align: left; margin: 10px 0px 0px 10px;">
                        <button class="btn btn-primary jImageThumbnail " style="width: 120px; font-size: 12px;" type="button" data-toggle="modal" data-target="#getImage" data-type="thumb" data-ratio="2" data-category="<?=(count($this->form->categories)?$this->form->categories[0]->category:'')?>">

                            <span class="glyphicon glyphicon-plus">+</span>
                            Add image</button>

                    </div>


                </fieldset>





            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4" style="position: relative;">


            <?include_once "views/helpers/messages.html.php"?>


            <h2><?=$this->categoryHeader?></h2>
            <?if ($this->totalRecords):?>
            <div class="row text-center text-lg-left" style="border-right: 20px; float: left; position: relative;">


                <?foreach ($this->form->images as $image):?>
                    <div class="card" style="width: 18rem;margin:0 10px 10px 0;  ">
                        <button type="button" class="jRemoveImage close btn" data-id="<?=$image->id?>" aria-label="Close" style="position: absolute; top:0px; right:0px; background: white; padding: 5px;">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <img class="card-img-top" src="<?=$image->url?>" alt="Card image">
                        <div class="card-body">
                            <p class="card-text"><?=$image->keywords?></p>
                            <a href="#" class="jCopyUrl btn btn-primary" data-url="<?=$image->url?>">Copy URL</a> <a href="#" class="JEditImage btn btn-secondary">Edit</a>
                        </div>
                    </div>
                <?endforeach;?>
            </div>
            <?else:?>
                No records
            <?endif;?>
            &nbsp;
            <?include "views/helpers/pagination.html.php"?>

        </main>
    </div>
</div>


<div class="main" style="height: 500px;">

    <?include_once "views/helpers/messages.html.php"?>


    <form id="frmImages" method="post">
        <input type="hidden" id="imageHidden" name="url">
        <input type="hidden" id="imageHiddenCategory" name="category" value="<?=(count($this->form->categories)?$this->form->categories[0]->category:'')?>">
    </form>

    <?include_once "views/helpers/getimage.html.php"?>
</div>
