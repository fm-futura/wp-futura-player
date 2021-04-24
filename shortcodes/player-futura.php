<?php

function wp_player_futura_shortcode($atts) {
    static $player_idx = 0;

    $player_id = 'player_futura-' . $player_idx;
    $player_idx++;

    ob_start();

    include(dirname(__FILE__) . '/../templates/player-futura-tpl.php');
    $rendered = ob_get_contents();

    ob_end_clean();

    return $rendered;
}

function wp_player_futura_play_button_shortcode($atts) {
    static $player_idx = 0;

    $player_id = 'player_futura_play_button-' . $player_idx;
    $player_idx++;

    ob_start();

    include(dirname(__FILE__) . '/../templates/player-futura-play-pause-button-tpl.php');
    $rendered = ob_get_contents();

    ob_end_clean();

    return $rendered;
}

function wp_player_futura_current_show_shortcode($atts) {
    static $player_idx = 0;

    $player_id = 'player_futura_current_show-' . $player_idx;
    $player_idx++;

    ob_start();

    include(dirname(__FILE__) . '/../templates/player-futura-current-show-tpl.php');
    $rendered = ob_get_contents();

    ob_end_clean();

    return $rendered;
}

function wp_player_futura_shortcode_init() {
    add_shortcode('player-futura', 'wp_player_futura_shortcode');
    add_shortcode('player-futura-play-button', 'wp_player_futura_play_button_shortcode');
    add_shortcode('player-futura-current-show', 'wp_player_futura_current_show_shortcode');
}
add_action('init', 'wp_player_futura_shortcode_init');
