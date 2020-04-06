<meta name="description" content="<?=$this->form->meta_description?>">
    <meta name="keywords" content="<?=$this->form->meta_keywords?>">
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>



<link rel="stylesheet" type="text/css" href="/assets/css/home.css">
<link rel="stylesheet" type="text/css" href="/assets/css/fontAwesomeAll.min.css">
<link rel="stylesheet" type="text/css" href="/assets/css/fontAwesomeBrands.min.css">
<link rel="stylesheet" type="text/css" href="/assets/css/news.css">



<link rel="stylesheet" href="//idrt.com/assets/css/style.css" type="text/css" />
<link rel="stylesheet" href="//idrt.com/assets/css/myasltech.css" type="text/css" />
<link rel="stylesheet" href="//idrt.com/assets/css/coin-slider-styles.css" type="text/css" />


<script type="application/ld+json">
{
	"@context": "http://schema.org",
	"@type": "NewsArticle",
	"mainEntityOfPage": {
		"@type": "WebPage",
		"@id": "http://<?=strtolower(env("APP_URL"))?>/<?=$this->form->url?>"
	},
	"author": {
		"@type": "Person",
		"name": "<?=strtolower(env("APP_NAME"))?> Staff"
	},
	"publisher": {
		"@type": "Organization",
		"name": "<?=strtolower(env("APP_NAME"))?>",
		"logo": {
			"@type": "ImageObject",
			"url": "https://s3.amazonaws.com/<?=strtolower(env("AWS_OMCMS_BUCKET"))?>/thumb/logo_nn.png",
			"width": "360px",
			"height": "120px"
		}
	},
	"image": {
		"@type": "ImageObject",
		"url": "<?=$this->form->thumb_image?>"
	},
	"headline": "<?=$this->form->title?>",
	"identifier": "<?=md5($this->form->url)?>",
	"description": "<?=$this->form->meta_description?>",
	"datePublished": "<?= date('Y-m-d',strtotime($this->form->add_date))?>",
	"dateModified": "<?=date('Y-m-d', strtotime($this->form->last_updated))?>",
	"url": "https://<?=strtolower(env("APP_NAME"))?>.com/<?=$this->form->url?>",
	<?
    $json = '[]';
    $splitted = explode(",", $this->form->meta_keywords);
    if (count($splitted)){

        $trimArray=array_map('trim',$splitted);
        $json = json_encode($trimArray);
    }

    ?>
	"keywords": <?=$json?>,
	"isAccessibleForFree": "True"
}
</script>