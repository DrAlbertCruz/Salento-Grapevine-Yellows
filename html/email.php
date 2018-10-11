<?php
if($_POST){
    $name = filter_var($_POST['name'],FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'],FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST['message'],FILTER_SANITIZE_STRING);
    $from = 'no-reply@odin.cs.csubak.edu';
    $headers = "From:" . $from;

    //send email
    mail($email, $name . "'s GY detection results " . date(DATE_RFC2822), $message, $headers);
    }
?>
