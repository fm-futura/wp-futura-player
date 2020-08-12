<?php

function wp_player_futura_shortcode($atts) {
    $player_id = uniqid('player_futura-');

    ob_start();

    include(dirname(__FILE__) . '/../templates/player-futura-tpl.php');
    $rendered = ob_get_contents();

    ob_end_clean();

    return $rendered;
}


function wp_player_futura_shortcode_init() {
    add_shortcode('player-futura', 'wp_player_futura_shortcode');
}
add_action('init', 'wp_player_futura_shortcode_init');
