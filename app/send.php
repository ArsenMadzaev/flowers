<?php
// Файлы phpmailer
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$phone = $_POST['phone'];
$text = $_POST['interested'];
$secret = '6Lev1yopAAAAADT3MOvxClx7w9sZ_E_nGTgHD_68';
 
if (!empty($_POST['g-recaptcha-response'])) {
	$curl = curl_init('https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, 'secret=' . $secret . '&response=' . $_POST['g-recaptcha-response']);
        $out = curl_exec($curl);
        curl_close($curl);
        
        $out = json_decode($out);
        if ($out->success == true) {
            $success_output = true;
        } 
} else {
    $success_output = false;
}
 


if ($success_output) {
    // Формирование самого письма
    $title = "Заявка с сайта Geizer";
    $body = "
    <h2>Рассчитать стоимость</h2>
    <b>Имя:</b> $name<br>
    <b>Телефон:</b> $phone<br><br>
    <b>Сообщение:</b><br>$text
    ";

    // Настройки PHPMailer
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    try {
        $mail->isSMTP();   
        $mail->CharSet = "UTF-8";
        $mail->SMTPAuth   = true;
        //$mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {$GLOBALS['debugstatus'][] = $str;};

        // Настройки вашей почты
        $mail->Host       = 'smtp.mail.ru'; // SMTP сервера вашей почты
        $mail->Username   = 'j212@bk.ru'; // Логин на почте
        $mail->Password   = 'jiZh7H1HjgDiywVuf0bj'; // Пароль на почте
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;
        $mail->setFrom('j212@bk.ru', 'ГЕЙЗЕР'); // Адрес самой почты и имя отправителя

        // Получатель письма
        $mail->addAddress('arsen.madzaev@inbox.ru');  
        $mail->addAddress('j212@bk.ru'); // Ещё один, если нужен

    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;    

    // Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
        $status = true;
        $text = 'Сообщение отправлено';
    } 
    else {$result = "error";}

    } catch (Exception $e) {
        $result = "error";
        $status = false;
        $text = 'Ошибка отправки';
        $debugstatus = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }

    // Отображение результата
    echo json_encode(["result" => $result, "debugstatus" => $debugstatus, "status" => $status, "text" => $text]);
} else {
    $result = "error";
    $status = false;
    $text = 'Пройдите проверку на робота.';
    echo json_encode(["result" => $result, "status" => $status, "text" => $text]);
}
