<?php
/**
 * @package OptIn_forma
 * @version 0.9
 */
/*
Plugin Name: OptIn Forma
Plugin URI: 
Description: Sort of opt-in form used for obtaining a visitor's e-mail address in exchange for certain data sent by e-mail immediately. This software does not yet use opt-in forms issued by commercial e-mail marketing providers.
Author: 
Version: 0.9
Author URI: 
*/

add_action('init','dmof_use_scripts');
add_action('wp_ajax_nopriv_dmof_optinform_handle_ajax_request','dmof_validate_and_process_email' );
add_action('wp_ajax_nopriv_dmof_refresh_captcha','dmof_generate_captcha_numbers' );


function dmof_use_scripts()
{
 
    
    
    wp_register_style( 'jquery-ui-style', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/themes/blitzer/jquery-ui.css',array());
    wp_enqueue_style('jquery-ui-style');
    wp_enqueue_script('dmof_script', '/wp-content/plugins/dmOptinForm/js/dmof_scripts.js', array('jquery','jquery-ui-core','jquery-ui-dialog'),'1.10.2',true);
    
    wp_register_style( 'dmof-style', '/wp-content/plugins/dmOptinForm/css/styles.css');
    wp_enqueue_style('dmof-style');
    
    wp_localize_script('dmof_script', 'dmof_script_vars', array('pluginDir' => plugins_url()));

    

}



function dmof_validate_and_process_email()
{
    session_start();
    $errorMessages = array();

    $userEmail = $_POST['user_email'];

    if(!empty($userEmail))
    {
        if(!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) 
        {
            $errorMessages['email'] = "E-mail address not valid."; 
        }
    }
    else
    {
        $errorMessages['email'] = "E-mail field blank."; 
    }

    $userCaptcha = $_POST['captcha_entry'];

    if(!empty($userCaptcha))
    {
        if($userCaptcha != $_SESSION['num3']) 
        {
            
            $errorMessages['captcha'] = "Wrong captcha result."; 
        }
    }
    else
    {
       $errorMessages['captcha'] = "Captcha field blank.";
    }
    
    if(empty($errorMessages)){

        
        dmof_mail_sending($userEmail);

        session_destroy();
    }   

    $response = json_encode($errorMessages);
    print $response;

    die();
}


function dmof_generate_captcha_numbers()
{
    session_start();

    $_SESSION['num1'] = rand(0,10);
    $_SESSION['num2'] = rand(0,10);
    $_SESSION['num3'] = $_SESSION['num1'] + $_SESSION['num2'];

    
    $numbers = json_encode(array($_SESSION['num1'],$_SESSION['num2'],$_SESSION['num3']));

    echo $numbers;
    die();

}


function dmof_mail_sending($recipient)
{
    if(!$recipient)
        throw new Exception("No recipient e-mail address provided.");

    $subject = "Access data for our product";

    $message = "(Plain text message body containing the data you promised. You can use \n for newline.)";
    


    $headers[] = 'From: Your website support <support_or_whatever@your.web.site.url>';
    
    
    wp_mail( $recipient, $subject, $message, $headers); 
    
}



