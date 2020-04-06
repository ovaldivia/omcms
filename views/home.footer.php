
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://<?=strtolower(env("APP_URL"))?>",
  "name": "<?=strtolower(env("APP_NAME"))?>",
  "description": "<?= str_replace('"','\"', $this->mainArticles[0]->title)?>",
  "publisher": "<?=strtolower(env("APP_NAME"))?>"
 }
</script>
