<?php
class PlayerFutura_Widget extends WP_Widget {
    public function __construct() {
        $widget_ops = array(
            'classname' => 'player_futura',
            'description' => 'Player Futura',
        );
        parent::__construct( 'player_futura', 'Player Futura', $widget_ops );
    }

    public function widget( $args, $instance ) {
        echo $args['before_widget'];

        $player_id = $this->id;
        $player_base_url = plugins_url('', dirname(__FILE__));

        include(dirname(__FILE__) . '/../templates/player-futura-tpl.php');

        echo $args['after_widget'];
    }
}

function wp_player_futura_register () {
    register_widget('PlayerFutura_Widget');
}
add_action('widgets_init', 'wp_player_futura_register');

