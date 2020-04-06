
<div class="alert alert-success alert-dismissible jSuccessMessage" style="display:<?=($this->success)?'block':'none'?>" role="alert">
    <?=$this->success?>
</div>


<?if ($this->errors):?>
    <div class="alert alert-danger alert-dismissible jErrorMessage" role="alert">
        <?=$this->errors?>
    </div>
<?endif?>