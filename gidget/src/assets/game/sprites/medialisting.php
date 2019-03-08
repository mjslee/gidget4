<?php
function get_media_type_directory($filetype) {
    if ($filetype == 'png') {
        return '.';
    } else if ($filetype == 'mp3' || $filetype == 'wav') {
        return 'sfx';
    } else {
        return '.';
    }
}

function combine_file_names($objectName) {
    $pieces = explode('.', $objectName);
    return $pieces[0];
}

function get_media_files($filetype) {
    $dir = opendir(get_media_type_directory($filetype));
    $files = array();
    while(false != ($file = readdir($dir))) {
        $info = pathinfo($file);
        if(isset($info['extension']) and $info['extension'] == $filetype) {
             $objectName = combine_file_names($info['filename']);
             if ($objectName != 'gidget' && $objectName != 'gidgetClassic' && $objectName != 'hidden' && $objectName != 'unknown') {
                $files[] = $objectName;
            }
        }
    }

    $files = array_unique($files);
    sort($files);
    
    return $files;
}

function check_valid_inputs($get) {
    $type = 'png';
    if (isset($get['type'])) {
        if (($get['type'] == 'png') or ($get['type'] == 'mp3') or ($get['type'] == 'wav')) {
            $type = $get['type'];
        }
    }
    return $type;
}

header('Content-type: application/json');
$type = check_valid_inputs($_GET);
echo json_encode(get_media_files($type));
