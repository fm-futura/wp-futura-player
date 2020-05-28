<?php
$player_base_url = plugins_url('templates/', dirname(__FILE__));
?>

  <div data-turbolinks-permanent class="player__container" id="<?php echo $player_id ?>">
<!--      <img src="<?php echo $player_base_url ?>vivo.svg"  class="player__branding" /> -->

      <div class="player__nowplaying">
        <span class="player__currentshow"> </span>
      </div>

      <div>
        <div class="player__branding__text">
          Escuchá
          <br />
          <span class="brand__futura">
            FUTURA
          </span>
          <br />
          en VIVO
        </div>
      </div>

      <div class="player__content">
        <div class="player__control">
          <div class="player__play" > <img src="<?php echo $player_base_url ?>play.svg" /> </div>
          <div class="player__pause"> <img src="<?php echo $player_base_url ?>pause.svg"/> </div>
        </div>
        <div class="player__pad"> </div>
      </div>
  </div>

  <script type="text/javascript" data-turbolinks-eval="false">
    var player = new FuturaPlayer(document.querySelector('#<?php echo $player_id?>'));
  </script>

<?php
