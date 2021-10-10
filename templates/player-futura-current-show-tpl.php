<?php
$player_base_url = plugins_url('templates/', dirname(__FILE__));
?>

  <div data-turbolinks-permanent class="player__container single-element" id="<?php echo $player_id ?>">
      <div class="player__nowplaying single-element font-bebas">
        <div class="player__nowplaying--inner">
          <span class="player__currentshow"> </span>
        </div>
      </div>
  </div>

  <script type="text/javascript" data-turbolinks-eval="false" id="<?php echo $player_id ?>_script">
    var player = new FuturaPlayerRemote(document.querySelector('#<?php echo $player_id?>'));
  </script>

<?php
