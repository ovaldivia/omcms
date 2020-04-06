<?php
namespace App\Controllers;

use \App\Controllers\Controller;
use \App\Services\Articles;
use \App\Includes\Setup;
use \App\Includes\Utils;
use \DrewM\MailChimp\MailChimp;
use Socketlabs\SocketLabsClient;
use Socketlabs\Message\BasicMessage;
use Socketlabs\Message\EmailAddress;

class Main extends Controller{

    function __construct(){
        parent::__construct();
        $this->mainLayout = 'layouts/main.layout.php';
        $this->hideBookmark = false;
        $this->fixtop = false;
        $this->countryCode = Utils::getClientCountry();
        Setup::redirectNoServiceIfExcludedCountry($this->countryCode);
        $this->formatDate = 'm/d/Y';

        $this->home = '/';
    }

    public function homeAction(){

        $this->loadAllLists();

        $this->pageTitle = $this->mainArticles[0]->title;

        $this->fixtop = true;

        $this->view = "views/home.html.php";

        $this->render();
    }

    public function paginationAction(){

        $articles = new Articles();

        $tag = $_REQUEST['tag']?:'';

        $filter = $this->getListFilter($tag);

        $this->list = $articles->loadList($filter);

        include "views/list.html.php";

    }

    public function flashNewsAction(){

        $articles = new Articles();

        $id = $this->getInt('id')?:0;

        $this->form = $articles->loadFlashNew($id);

        $this->view = "views/flash.html.php";

        $this->render();

    }

    public function bookmarkAction(){

        $this->view = "views/bookmark.html.php";

        $this->hideBookmark = true;

        $this->render();
    }


    public function subscribeAction(){

        $this->view = "views/subscribirte.html.php";

        $this->hideBookmark = true;

        $this->render();
    }

    public function subscribeThanksAction(){

        $this->view = "views/subscribirte_gracias.html.php";

        $this->hideBookmark = true;

        $this->render();
    }

    public function filterHashAction(){

        $this->tag = str_replace('/hash/','', $_SERVER['REQUEST_URI']); //no slashes

        $articles = new Articles();

        $filter = $this->getListFilter($this->tag);

        $filter['limit'] = 26;

        $this->list = $articles->loadList($filter);

        $this->view = "views/tag.html.php";

        $this->render();
    }
    public function filterTagAction(){
        $this->tag = basename($_SERVER['REQUEST_URI'])?:'';
        $this->tag = strtoupper($this->tag);
        $this->tag = str_replace('-',' ', $this->tag);

        $articles = new Articles();

	    $filter = $this->getListFilter($this->tag);

        $filter['limit'] = 26;

        $this->articles = $articles->loadList($filter);

        $this->view = "views/tag.html.php";

        $this->render();

    }

    public function influencersAction(){

        $articles = new Articles();

        $filter = $this->getListFilter('instagram');

        $filter['limit'] = 3;

        $this->instagram = $articles->loadList($filter);


        $filter = $this->getListFilter('youtube');

        $filter['limit'] = 3;

        $this->youtube = $articles->loadList($filter);

        $this->view = "views/influencers.html.php";

        $this->render();
    }

    public function tosAction(){

        $this->view = "views/tos.html.php";

        $this->render();
    }

    public function privacyAction(){

        $this->view = "views/privacy.html.php";

        $this->render();
    }


    public function aboutAction(){

        $this->view = "views/about.html.php";

        $this->render();
    }


     public function contactAction(){


         $this->form = new \stdClass();

         Setup::startSession();

         $this->loadMessages();

         if (!empty($_SESSION['__errorform__'])){

             $this->form = unserialize($_SESSION['__errorform__']);

             unset($_SESSION['__errorform__']);
         }

         $this->mainLayout = 'layouts/main.layout.php';

         $this->view = "views/contact.html.php";

         $this->render();
     }

     private function getContactInfo(){

        return (object)[
            'name'=>trim($_REQUEST['name']),
            'email'=>trim($_REQUEST['email']),
            'comment'=>trim($_REQUEST['comment']),
        ];
     }

    private function validateContact($form){

        $errors = array();

        if (strlen($form->name)==0){
            $errors[] = "Name cannot be blank";
        }

        if (strlen($form->comment)==0){
            $errors[] = "Comment cannot be blank";
        }


        if(!filter_var($form->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email";
        }

        return $errors;
    }

     public function contactPostAction(){

       Setup::startSession();

       $form = $this->getContactInfo();

       $errors = $this->validateContact($form);

       if (count($errors)==0){

           $client = new SocketLabsClient(env('SOCKETS_LAB_SERVER_ID'), env('SOCKETS_LAB_SERVER_KEY'));

           $message = new BasicMessage();

           $message->subject = "New MyASLTech Blog comment from ". $form->name;

           $form->comment = nl2br($form->comment);

           $message->htmlBody = "<html>You have a new comment from {$form->name}<br><br><b>Email: </b>{$form->email}<br><br><b>Comment: </b><br>$form->comment</html>";
           $message->plainTextBody = htmlspecialchars(trim(strip_tags($message->htmlBody)));

           $message->from = new EmailAddress("no-reply@idrt.com","IDRT Support");

           $message->addToAddress("corinne@idrt.com");
           $message->addToAddress("cara@idrt.com");

           $message->addToAddress("oscar@idrt.com");

           $response = $client->send($message);

           $_SESSION['success'] = "Your comment was sent!";


       }else{
           $result['errors'] = $this->formatHtml($errors);

           $_SESSION['__errorform__'] = serialize($form);

           $_SESSION['errors'] = $this->formatHtml($errors);

       }

       $this->redirect("/contact");

       exit();
     }

    public function signupAction(){

        $this->form = new \stdClass();

        Setup::startSession();

        $this->loadMessages();

        if (!empty($_SESSION['__errorform__'])){

            $this->form = unserialize($_SESSION['__errorform__']);

            unset($_SESSION['__errorform__']);
        }

        $this->mainLayout = 'layouts/main.layout.php';

        $this->view = "views/signup.html.php";


        $this->render();
    }


    private function getSignupData(){

        return ((object) [
            'fname' => trim(ucfirst($_REQUEST['fname'])),
            'lname' => trim(ucfirst($_REQUEST['lname'])),
            'email' => trim(strtolower($_REQUEST['email'])),
            'role' => $_REQUEST['role'] ? trim(ucfirst($_REQUEST['role'])):'',
            'affiliation' => $_REQUEST['affiliation'] ? trim($_REQUEST['affiliation']):'',
            'phone' => $_REQUEST['phone'] ? trim($_REQUEST['phone']):'',
        ]);
    }

    private function validateSignup($form){

        Setup::startSession();

        $errors = array();

        if (strlen($form->lname)==0){
            $errors[] = "Last name cannot be blank";
        }

        if (strlen($form->fname)==0){
            $errors[] = "First name cannot be blank";
        }


        if(!filter_var($form->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email";
        }

        return $errors;
    }




    public function signupRegisterAction(){

        Setup::startSession();

        $form = $this->getSignupData();

        $errors = $this->validateSignup($form);

        if (count($errors)==0){

            $MailChimp = new MailChimp(env("MAILCHIMP_API_KEY"));

            $list_id = env("MAILCHIMP_LIST");

            $fields = array(
                'FNAME'=>$form->fname, 'LNAME'=>$form->lname
            );

            if ($form->phone)
                $fields['PHONE'] = $form->phone;

            if ($form->role)
                $fields['ROLE'] = $form->role;

            if ($form->affiliation)
                $fields['AFFILIATE'] = $form->affiliation;


            $result = $MailChimp->post("lists/$list_id/members", [
                'email_address' => $form->email,
                'status'        => 'pending',
                'merge_fields' => $fields
            ]);


            if ($MailChimp->success()) {

                $subscriber_hash = $MailChimp->subscriberHash($form->email);

                $MailChimp->post("lists/$list_id/members/$subscriber_hash/tags", [
                    'tags' => array(
                        array('name'=>'MyASLTech', 'status'=>'active')
                    )
                ]);

                if ($MailChimp->success()){
                    $this->view = "views/check_confirmation.html.php";

                    $this->render();

                    exit();
                }

            }

            $errors[] = $MailChimp->getLastError();

        }

        $_SESSION['__errorform__'] = serialize($form);

        $_SESSION['errors'] = $this->formatHtml($errors);

        $this->redirect('/signup');

    }


    public function signupVerificationAction(){

        echo "here";exit();

        //get user id

        //change mailchimp status

        //show confirmed page

        //download PDF

    }



    public function hashAction(){

        $this->view = "views/hash.html.php";

        $this->render();
    }

    public function confirmAction(){

        $this->view = "views/confirmation.html.php";

        $this->render();
    }

    public function getHashAction(){

        Setup::jsonHeaders();

        $result = array('success'=>false, 'errors'=>'');

        $text = $_REQUEST['text'];

        if ($text){

            $result['hash'] = sha1($text);

            $result['success'] = true;

        }else{
            $result['errors'] = 'Missing text param.';
        }

        echo json_encode($result);

        exit();
    }

    public function newsAction(){

        $code = Utils::getClientCountry();

        Setup::redirectNoServiceIfExcludedCountry($code);

        $this->fixtop = false;

        $this->mainLayout = 'layouts/main.layout.php';

        $article = new Articles();

        $url = str_replace('/','', $_SERVER['REQUEST_URI']); //no slashes

        $this->form = $article->loadByUrl($url);

        $resp = 200;
        if ($this->form===false){
            $this->view = "views/404.html.php";
            $resp = 404;
        }else{
            $this->loadListForNews();
            $this->pageTitle = $this->form->title;
            $article->addArticleCounter($this->form->id);
            $this->view = "views/news.html.php";
        }
        $this->render($resp);
    }

    private function getArticlesByTag($tag, $articlesObj, $exclude, $limit = 3){

        $filter = $this->getListFilter($tag, $exclude);
        $filter['limit'] = $limit;
        return $articlesObj->loadList($filter);

    }

    private function getListFilter($tag='', $exclude=[]){

        $filter = array();

        if ($this->isProduction){
            $filter['where'] = 'status = ' . Articles::DEPLOYED_PROD_STATUS;
        }else{
            $filter['where'] = 'status in ( '. Articles::DEPLOYED_DEV_STATUS . ','.Articles::DEPLOYED_PROD_STATUS.' )';
        }

        $filter['where'] .= ' AND (countries="" OR countries like "%'.strtoupper($this->countryCode?:'XX').'%")';

        if ($tag){
            $filter['where'] .= ' AND tags like "%'.$tag.'%"';
        }

        if (count($exclude)){
            $str = '';
            $prefix = '';

            foreach ($exclude as $article){

                $str.= $prefix . '"' . $article->id . '"';

                $prefix = ',';
            }

            $filter['where'] .= ' AND id not in ( '. $str .' )';
        }

        $filter['fields'] = '*';
        $filter['order'] = ' ORDER BY `order` DESC';

        $filter['limit'] = $_REQUEST['limit']??'11';

        $filter['offset'] = $_REQUEST['offset']??'0';

        return $filter;
    }

    private function loadAllLists(){

        $articles = new Articles();

        $filter = $this->getListFilter();

        $list = $articles->loadList($filter);

        $filter2 = $filter;

        $filter3 = $filter;

        $this->articles = $list;

        $this->flashNews = $articles->loadFlashNews();

        $this->ultimos = array_slice($list,0,3);

        $this->popular = $this->ocean;

        $filter2['order'] = ' ORDER BY `counter` DESC';

        $filter2['limit'] = 3;

        $this->masvistos = $articles->loadList($filter2);

        $filter3['where'] .= ' AND video_url <> ""';

        $this->popularVideos = $articles->loadList($filter3);

    }
    
    private function loadListForNews(){

        $articles = new Articles();

        $filter = $this->getListFilter();

        $list = $articles->loadList($filter);

        $filter2 = $filter;

        $filter3 = $filter;

        $this->ultimos = array_slice($list,0,6);


        $filter2['order'] = ' ORDER BY `counter` DESC';

        $filter2['limit'] = 3;

        $this->masvistos = $articles->loadList($filter2);

        $filter3['where'] .= ' AND video_url <> ""';

        $this->popularVideos = $articles->loadList($filter3);
    }

}
