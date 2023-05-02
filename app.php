<?php

list(, $func, $arg) = $argv;

try{
    $pdo = new PDO('mysql:host=localhost;dbname=cosmo', "root", "");
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    echo "Impossible d'accéder à la base de données : ".$e->getMessage();
    die();
}

$crypt = (function($toHash){
    return strrev(md5(strrev(sha1($toHash))));
});

$login = (function($json) use ($pdo, $crypt){
    $combi = array_combine(['key', 'pass'], (array)json_decode($json));
    $chechkIfUserExists = $pdo->prepare('SELECT id_user FROM users WHERE (keyname = :key OR email = :key) AND password = :pass');
    $chechkIfUserExists->execute([":key" => $combi['key'], ":pass" => $crypt($combi['pass'])]);
    $result = $chechkIfUserExists->fetchAll();

    return json_encode([
        !empty($result),
        ((!empty($result)) ? $result[0]['id_user'] : null)
    ]);
});

$register = (function($json) use ($pdo, $crypt){
    $combi = array_combine(['key', 'email', 'pass', 'pass_c'], (array)json_decode($json));
    $combi['pass'] = $crypt($combi['pass']);
    $combi['pass_c'] = $crypt($combi['pass_c']);

    if ($combi['pass'] == $combi['pass_c']) {
        $chechkIfUserExists = $pdo->prepare('SELECT id_user FROM users WHERE keyname = :key OR email = :key');
        $chechkIfUserExists->execute([":key" => $combi['key']]);
        $result = $chechkIfUserExists->fetchAll();

        if (empty($result)) {
            try{
                $registerUser = $pdo->prepare('INSERT INTO `users`(`id_user`, `keyname`, `email`, `password`) VALUES (NULL,?,?,?)');
                $registerUser->execute([$combi['key'], $combi['email'], $combi['pass']]);
            } catch(Exception $e) {
                return json_encode([ false, "Erreur, réessayez dans quelques instants" ]);
            }
            return json_encode([ true, "Inscription reussie" ]);
        }else{
            return json_encode([ false, "Votre compte semble déjà exister" ]);
        }
    }else{
        return json_encode([ false, "Les mots de passes ne correspondent pas" ]);
    }
});


echo $$func($arg);

?>