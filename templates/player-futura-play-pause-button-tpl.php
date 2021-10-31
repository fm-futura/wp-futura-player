<?php
$player_base_url = plugins_url('templates/', dirname(__FILE__));
?>

  <div data-turbolinks="true" data-turbolinks-permanent class="player__container single-element" id="<?php echo $player_id ?>">
      <div class="player__content single-element">
        <div class="player__control single-element">
          <div class="player__play" > <img src="<?php echo $player_base_url ?>play.svg" /> </div>
          <div class="player__pause"> <img src="<?php echo $player_base_url ?>pause.svg"/> </div>
        </div>
      </div>
  </div>

  <script type="text/javascript" data-turbolinks-eval="false" id="<?php echo $player_id ?>_script">
    var player = new FuturaPlayerRemote(document.querySelector('#<?php echo $player_id?>'));
  </script>

<?php
