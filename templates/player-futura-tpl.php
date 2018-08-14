<?php
$player_base_url = plugins_url('templates/', dirname(__FILE__));
?>
<div class="player__container" id="<?php echo $player_id ?>">
      <img src="<?php echo $player_base_url ?>vivo.svg"  class="player__branding" />
      <div class="player__content">
        <div class="player__control">
        <img src="<?php echo $player_base_url ?>play.svg"  class="player__play"  />
        <img src="<?php echo $player_base_url ?>pause.svg" class="player__pause" />
        </div>
        <div class="player__pad"> </div>
        <div class="player__nowplaying">
          <span class="player__currentshow"> El nombre de un programa muy largo </span>
        </div>
      </div>
    </div>
  <script type="text/javascript">
    var player = new FuturaPlayer(document.querySelector('#<?php echo $player_id?>'));
  </script>

<?php