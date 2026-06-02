(function () {
  var video = document.getElementById('heroVideo');
  var audio = document.getElementById('heroAudio');
  var playBtn = document.getElementById('heroPlay');
  var playSmallBtn = document.getElementById('heroPlaySmall');
  var muteBtn = document.getElementById('heroMute');
  var fullscreenBtn = document.getElementById('heroFullscreen');
  var timeLabel = document.getElementById('heroTime');
  var progress = document.getElementById('heroProgress');
  var veenaBtn = document.getElementById('veenaSoundToggle');
  var veenaAudio = document.getElementById('veenaAudio');

  if (!video || !audio) return;

  var audioEnabled = false;

  function stopVeenaSound() {
    if (!veenaAudio) return;
    veenaAudio.pause();
    veenaAudio.currentTime = 0;
    if (veenaBtn) {
      veenaBtn.classList.remove('is-playing');
      veenaBtn.setAttribute('aria-label', 'वीणा आवाज सुरू करा');
    }
  }

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return '0:00';
    var minutes = Math.floor(value / 60);
    var seconds = Math.floor(value % 60);
    return minutes + ':' + String(seconds).padStart(2, '0');
  }

  function syncAudioToVideo() {
    if (!audio.duration || !Number.isFinite(audio.duration)) return;
    var target = video.currentTime % audio.duration;
    if (Math.abs(audio.currentTime - target) > 0.45) {
      audio.currentTime = target;
    }
  }

  function updateControls() {
    var isPaused = video.paused;
    var playIcon = isPaused ? '▶' : '❚❚';
    var duration = Number.isFinite(video.duration) ? video.duration : 60;
    var ratio = duration ? Math.min(1, video.currentTime / duration) : 0;

    if (playBtn) {
      playBtn.textContent = playIcon;
      playBtn.setAttribute('aria-label', isPaused ? 'व्हिडिओ प्ले करा' : 'व्हिडिओ थांबवा');
    }
    if (playSmallBtn) {
      playSmallBtn.textContent = playIcon;
      playSmallBtn.setAttribute('aria-label', isPaused ? 'व्हिडिओ प्ले करा' : 'व्हिडिओ थांबवा');
    }
    if (muteBtn) {
      muteBtn.textContent = audioEnabled && !audio.muted ? '🔊' : '🔇';
      muteBtn.setAttribute('aria-label', audioEnabled && !audio.muted ? 'आवाज बंद करा' : 'आवाज सुरू करा');
    }
    if (timeLabel) {
      timeLabel.textContent = formatTime(video.currentTime) + ' / ' + formatTime(duration);
    }
    if (progress) {
      progress.style.width = (ratio * 100).toFixed(2) + '%';
    }
  }

  function playMedia(withSound) {
    var videoPlay = video.play();

    if (withSound) {
      stopVeenaSound();
      audioEnabled = true;
      video.muted = false;
      audio.muted = false;
      syncAudioToVideo();
      audio.play().catch(function () {
        audioEnabled = false;
        audio.muted = true;
      }).finally(updateControls);
    }

    if (videoPlay && typeof videoPlay.catch === 'function') {
      videoPlay.catch(function () {});
    }
    updateControls();
  }

  function pauseMedia() {
    video.pause();
    audio.pause();
    updateControls();
  }

  function togglePlay() {
    if (video.paused) {
      playMedia(true);
    } else if (!audioEnabled || audio.paused || audio.muted) {
      playMedia(true);
    } else {
      pauseMedia();
    }
  }

  function toggleMute() {
    if (!audioEnabled || audio.paused) {
      playMedia(true);
      return;
    }
    audio.muted = !audio.muted;
    video.muted = audio.muted;
    updateControls();
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (playSmallBtn) playSmallBtn.addEventListener('click', togglePlay);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);
  video.addEventListener('click', togglePlay);

  if (veenaBtn && veenaAudio) {
    veenaBtn.addEventListener('click', function () {
      if (!veenaAudio.paused) {
        stopVeenaSound();
        return;
      }

      audio.pause();
      audioEnabled = false;
      updateControls();

      veenaAudio.currentTime = 0;
      veenaAudio.play().then(function () {
        veenaBtn.classList.add('is-playing');
        veenaBtn.setAttribute('aria-label', 'वीणा आवाज बंद करा');
      }).catch(function () {
        stopVeenaSound();
      });
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
      var hero = video.closest('.landing-hero');
      if (hero && hero.requestFullscreen) {
        hero.requestFullscreen();
      }
    });
  }

  video.addEventListener('play', function () {
    if (audioEnabled && !audio.muted) {
      syncAudioToVideo();
      audio.play().catch(function () {});
    }
    updateControls();
  });
  video.addEventListener('pause', function () {
    audio.pause();
    updateControls();
  });
  video.addEventListener('timeupdate', function () {
    if (audioEnabled && !audio.paused) syncAudioToVideo();
    updateControls();
  });
  video.addEventListener('loadedmetadata', updateControls);
  audio.addEventListener('ended', syncAudioToVideo);

  updateControls();
})();
