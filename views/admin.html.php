<div class="main">

    <?include_once "views/helpers/messages.html.php"?>

    <div class="row mt-4">

        <div class="col-lg-6">

            <div class="input-group">
                <input type="text" class="form-control" placeholder="Articles, Banners" id="searchText" value="<?=$this->searchText?>">
                <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" id="searchButton">Search</button>
                </span>
            </div>

            <div class="form-check">
                <table>
                    <tr>
                        <td style="width: 120px;"><input type="checkbox" class="form-check-input jFilterStatus" id="filterDeployedProd" value="<?=\App\Services\Articles::DEPLOYED_PROD_STATUS?>" <?=(in_array(\App\Services\Articles::DEPLOYED_PROD_STATUS, $this->filterStatuses)?'checked':'')?>>
                            <label class="form-check-label small" for="filterDeployedProd">Deployed Prod</label></td>
                        <td style="width: 115px;"><input type="checkbox" class="form-check-input jFilterStatus" id="filterDeployedDev" value="<?=\App\Services\Articles::DEPLOYED_DEV_STATUS?>" <?=(in_array(\App\Services\Articles::DEPLOYED_DEV_STATUS, $this->filterStatuses)?'checked':'')?>>
                            <label class="form-check-label small" for="filterDeployedDev">Deployed Dev</label></td>
                        <td style="width: 70px;"><input type="checkbox"  class="form-check-input jFilterStatus" id="filterSaved" value="<?=\App\Services\Articles::SAVED_STATUS?>" <?=(in_array(\App\Services\Articles::SAVED_STATUS, $this->filterStatuses)?'checked':'')?>>
                            <label class="form-check-label small" for="filterSaved">Saved</label>
                        </td>
                        <td style="width: 80px;"><input type="checkbox"  class="form-check-input jFilterStatus" id="filterSaved" value="<?=\App\Services\Articles::ARCHIVED_STATUS?>" <?=(in_array(\App\Services\Articles::ARCHIVED_STATUS, $this->filterStatuses)?'checked':'')?>>
                            <label class="form-check-label small" for="filterSaved">Archived</label>
                        </td>
                        <td style="width: 30px;"><input type="checkbox"  class="form-check-input jFilterStatus" id="filterDeleted" value="<?=\App\Services\Articles::DELETED_STATUS?>" <?=(in_array(\App\Services\Articles::DELETED_STATUS, $this->filterStatuses)?'checked':'')?>>
                            <label class="form-check-label small" for="filterDeleted">Deleted</label></td>
                    </tr>
                </table>
            </div>

            <div class="input-group">
		        <a href="<?=env("APP_URL")?>" target="_blank">Prod</a>&nbsp;
                <a href="http://dev.myasltech.blog/" target="_blank">Dev</a>&nbsp;
            </div>

        </div>

        <div class="col-lg-6">
            <a class="btn btn-primary" style="color:white;" href="/admin/edit"><span class="glyphicon glyphicon-plus">+</span>Add Article</a>
            <a class="btn btn-primary" style="color:white;" href="/admin/imagelib">Image Lib</a>
            <button class="btn btn-primary" type="button" data-toggle="modal" data-target="#bannerModal"><span class="glyphicon glyphicon-plus">+</span>Add Banner</button>
        </div>

    </div><!-- /.row -->


    <div class="mt-4 row text-center text-lg-left">

        <?foreach ($this->form->list as $article):?>

        <div class="col-lg-3 col-md-4 col-xs-6 notinews-thumb" style=" background-image: url(<?=$article->thumb_image?:'/assets/image/blank.png'?>); ">
            <?if ($article->status == \App\Services\Articles::SAVED_STATUS)$status = "Saved"; elseif($article->status ==\App\Services\Articles::DEPLOYED_DEV_STATUS) $status= "Deployed-Dev"; elseif($article->status ==\App\Services\Articles::DEPLOYED_PROD_STATUS) $status= "Deployed-Prod"; elseif($article->status ==\App\Services\Articles::ARCHIVED_STATUS) $status= "Archived"; elseif($article->status ==\App\Services\Articles::DELETED_STATUS) $status= "Deleted";?>
            <div class="item-status-<?= strtolower($status)?>">&#x2605; <?=$status?></div>
            <div class="country-labels"><?= str_replace(',',', ', $article->countries)?></div>
            <?if ($article->scheduled):?>
            <div class="item-scheduled"><a href="#" data-toggle="modal" data-target="#removeScheduleModal" data-id="<?=$article->id?>" data-scheduled="<?=date("Y-m-d h:iA", ($article->scheduled - 60*60*5) );?>">&#128336;</a></div>
            <?endif?>

            <?if ($article->permanent):?>
                <div class="item-permanent"><a href="#">&#929;</a></div>
            <?endif?>
            <div class="content">
                <?$tags = ($article->tags?explode(',',$article->tags):array())?>
                <div class="categories"><?foreach ($tags as $tag):?><span class="category"><?=$tag?></span>&nbsp;<?endforeach;?></div>
                <h2><a href="<?if ($this->isAdmin || $article->status<=\App\Services\Articles::DEPLOYED_DEV_STATUS):?>/admin/edit?id=<?=$article->id?><?else:?>#<?endif?>"><?=$article->title?></a></h2>
                <?if ($this->isAdmin):?>
                <div><?if ($article->order!=$article->max_order):?><a href="#" class="jPrevious" data-id="<?=$article->id?>" data-banner="<?=$article->banner?'true':'false'?>">&#8249; Previous</a>&nbsp;<?endif?><?if ($article->order!=$article->min_order):?><a href="#" class="jNext" data-id="<?=$article->id?>" data-banner="<?=$article->banner?'true':'false'?>">Next &#8250;</a><?endif?></div>
                <?endif?>
                <div class="btn-group">
                    <button type="button" class="btn btn-primary">Action</button>
                    <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <div class="dropdown-menu">
                        <?if (($this->isAdmin || $article->status<=\App\Services\Articles::DEPLOYED_DEV_STATUS) && !$article->banner):?>
                        <a class="dropdown-item" href="/admin/edit?id=<?=$article->id?>">Edit</a>
                        <?elseif ($this->isAdmin && $article->banner):?>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#bannerModal" data-id="<?=$article->id?>">Edit</a>
                        <?endif?>

                        <?if (($article->status==\App\Services\Articles::SAVED_STATUS || $article->status==\App\Services\Articles::DEPLOYED_DEV_STATUS) && $this->isAdmin):?>
                            <a class="dropdown-item" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::DEPLOYED_PROD_STATUS?>" data-id="<?=$article->id?>" data-toggle="modal" data-target="#reviewerModal">Deploy Production</a>
                            <a class="dropdown-item"  href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::DEPLOYED_PROD_STATUS?>" data-toggle="modal" data-target="#scheduleModal" data-id="<?=$article->id?>">Schedule Deployment</a>
                        <?endif?>

                        <?if(($article->status==\App\Services\Articles::SAVED_STATUS && $this->isAdmin)  || ($article->status==\App\Services\Articles::SAVED_STATUS && !$this->isAdmin)):?>
                            <a class="dropdown-item " href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::DEPLOYED_DEV_STATUS?>" data-id="<?=$article->id?>" data-toggle="modal" data-target="#reviewerModal">Deploy Dev</a>
                        <?endif?>

                        <?if($article->status ==\App\Services\Articles::DEPLOYED_DEV_STATUS && !$this->isAdmin):?>
                            <a class="dropdown-item jDeploy" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::SAVED_STATUS?>" data-id="<?=$article->id?>">Undeploy</a>
                        <?elseif($article->status>=\App\Services\Articles::DEPLOYED_DEV_STATUS && $this->isAdmin):?>
                            <a class="dropdown-item jDeploy" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::SAVED_STATUS?>" data-id="<?=$article->id?>">Undeploy</a>
                        <?endif?>
                        <?if (!$article->banner):?>
                        <a class="dropdown-item" target="_blank" href="/<?=$article->url?>">Preview</a>
                        <?endif?>
                        <div class="dropdown-divider"></div>

                        <?if ($this->isAdmin && $article->status == \App\Services\Articles::ARCHIVED_STATUS):?>
                            <a class="dropdown-item jRestore" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::SAVED_STATUS?>" data-id="<?=$article->id?>">Restore Archived</a>
                        <?elseif ($this->isAdmin):?>
                            <a class="dropdown-item jDeploy" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::ARCHIVED_STATUS?>" data-id="<?=$article->id?>">Archived</a>
                        <?endif?>

                        <?if ($this->isAdmin && $article->permanent == 0):?>
                            <a class="dropdown-item jPermanent" href="#" data-id="<?=$article->id?>">Make Permanent</a>
                        <?elseif ($this->isAdmin):?>
                            <a class="dropdown-item jRemovePermanent" href="#" data-id="<?=$article->id?>">Remove Permanent</a>
                        <?endif?>

                        <?if ($this->isAdmin && $article->status == \App\Services\Articles::DELETED_STATUS):?>
                            <a class="dropdown-item jRestore" href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::SAVED_STATUS?>" data-id="<?=$article->id?>">Restore</a>
                        <?elseif ($this->isAdmin):?>
                            <a class="dropdown-item"  href="#" data-banner="<?=$article->banner?'true':'false'?>" data-status="<?=\App\Services\Articles::DELETED_STATUS?>" data-toggle="modal" data-target="#deleteModal" data-id="<?=$article->id?>">Delete</a>
                        <?endif?>
                    </div>
                </div>
            </div>
        </div>

        <?endforeach;?>



    </div>
    <?if ($this->offset!=0):?>
    <a href="#" data-offset="<?=$this->offset?>" class="jPreviousPage"><< Previous Page</a> |
    <?endif?>

    <?if (count($this->form->list)!==0):?>
    <a href="#" data-offset="<?=$this->offset?>" class="jNextPage">Next Page >></a>
    <?endif?>

</div>



<!-- modals -->
<?include_once "views/helpers/modal.delete.php"?>
<?include_once "views/helpers/modal.remove_schedule.php"?>
<?include_once "views/helpers/modal.schedule.php"?>
<?include_once "views/helpers/modal.banner.php"?>
<?include_once "views/helpers/modal.reviewer.php"?>
