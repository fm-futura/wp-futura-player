<?php
/*
Plugin Name:        FM Futura Player
Plugin URI:         https://github.com/fm-futura/wp-futura-player
GitHub Plugin URI:  https://github.com/fm-futura/wp-futura-player
Description:        Reproductor para nuestro streaming
Version:            20180811
Author:             FM Futura
Author URI:         https://fmfutura.com.ar
License:            AGPL-3.0
License URI:        https://www.gnu.org/licenses/agpl-3.0.html

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

include_once('widgets/player-futura.php');
include_once('shortcodes/player-futura.php');

function wp_player_futura_init()
{
    wp_enqueue_style('player_futura',           plugins_url('templates/player-futura.css', __FILE__));
    wp_enqueue_script('player_futura_momentjs', plugins_url('templates/moment.min.js', __FILE__));
    wp_enqueue_script('player_futura',          plugins_url('templates/player-futura.js', __FILE__), array('player_futura_momentjs'));

}
add_action('init', 'wp_player_futura_init');
