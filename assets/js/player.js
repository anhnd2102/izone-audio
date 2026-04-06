/**
 * IZONE Audio Exam Player
 * Requires CONFIG object defined before this script runs:
 *
 * const CONFIG = {
 *   testId:        'test-1',
 *   testName:      'Term Test 1',
 *   audioUrl:      'https://...',
 *   soundcheckUrl: 'https://...',
 * };
 */

(function () {
  'use strict';

  // ── Time Window (edit if needed) ──────────────────────────
  const TIME_START = { h: 18, m: 45 };
  const TIME_END   = { h: 19, m: 5  };
  // ──────────────────────────────────────────────────────────

  const SOUNDCHECK_DURATION = 30; // seconds

  let mainObjectUrl      = null;
  let soundcheckObjectUrl = null;
  let isLoaded           = false;
  let soundcheckDone     = false;
  let isPlaying          = false;
  let timerInterval      = null;

  // ── DOM refs ─────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);

  // ── Build UI ──────────────────────────────────────────────
  function buildUI() {
    document.title = `IZONE – ${CONFIG.testName}`;

    document.body.innerHTML = `
      <div class="card">

        <div class="card-header">
          <div class="brand-row">
            <img class="brand-logo-img" src="assets/img/logo.png" alt="IZONE" onerror="this.style.display='none'">
            <span class="brand-name">IZONE</span>
          </div>
          <div class="brand-tagline">IELTS CHIẾN LƯỢC</div>
          <div class="test-title-row">
            <span class="test-icon">🎧</span>
            <span class="test-name">${CONFIG.testName}</span>
          </div>
        </div>

        <div class="card-body">

          <!-- Already played -->
          <div class="already-played" id="alreadyPlayed">
            <div class="icon">🔒</div>
            <div class="title">Bạn đã nghe bài này rồi</div>
            <div class="sub">Mỗi bài thi chỉ được phát một lần.<br>Liên hệ giáo viên nếu có sự cố.</div>
          </div>

          <!-- Load progress -->
          <div class="load-section" id="loadSection">
            <div class="load-label" id="loadLabel">Đang tải audio...</div>
            <div class="progress-track">
              <div class="progress-fill" id="loadFill"></div>
            </div>
            <div class="load-text" id="loadText">0%</div>
          </div>

          <!-- Time notice -->
          <div class="time-notice waiting" id="timeNotice">
            <span class="icon">🔒</span>
            <span class="text" id="timeText">Đang kiểm tra giờ...</span>
            <span class="countdown" id="countdown"></span>
          </div>

          <!-- Buttons -->
          <button class="btn btn-soundcheck" id="btnSoundcheck" disabled>
            🔊 Thử âm lượng trước khi thi
          </button>
          <button class="btn btn-play" id="btnPlay" disabled>
            ▶&nbsp; Phát audio bài thi
          </button>

          <!-- Playing state -->
          <div class="playing-state" id="playingState">
            <div class="playing-badge">
              <div class="dot"></div>
              Đang phát bài thi
            </div>
            <div style="width:100%">
              <div class="playing-progress-track">
                <div class="playing-progress-fill" id="playFill"></div>
              </div>
            </div>
            <div class="playing-time" id="playTime">0:00 / 0:00</div>
            <div class="playing-warning">⚠ Không tắt hoặc làm mới trang — không thể tạm dừng</div>
          </div>

          <!-- Ended state -->
          <div class="ended-state" id="endedState">
            <div class="ended-icon">✅</div>
            <div class="ended-title">Bài nghe đã kết thúc</div>
            <div class="ended-sub">Vui lòng hoàn thành và nộp bài làm.</div>
          </div>

        </div>

        <div class="card-footer">IZONE &nbsp;·&nbsp; IELTS CHIẾN LƯỢC</div>
      </div>

      <!-- Sound Check Modal -->
      <div class="modal-overlay" id="scModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3>🎵 Kiểm tra âm lượng</h3>
          </div>
          <div class="modal-body">
            <p class="modal-desc">
              Nghe đoạn nhạc và điều chỉnh âm lượng cho vừa tai,<br>
              sau đó nhấn <strong style="color:#fff">Xác nhận</strong>.
            </p>
            <div class="waveform" id="waveform">
              <div class="bar"></div><div class="bar"></div><div class="bar"></div>
              <div class="bar"></div><div class="bar"></div><div class="bar"></div>
              <div class="bar"></div><div class="bar"></div><div class="bar"></div>
              <div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
            <div class="modal-status" id="scStatus">Đang phát 30 giây đầu...</div>
            <div class="modal-actions">
              <button class="btn btn-outline btn-sm" id="btnReplay">🔄 Nghe lại</button>
              <button class="btn btn-confirm btn-sm" id="btnConfirm">✅ Xác nhận đã vừa tai</button>
            </div>
          </div>
        </div>
      </div>

      <audio id="audioSoundcheck"></audio>
      <audio id="audioMain"></audio>
    `;
  }

  // ── Load audio as Blob ────────────────────────────────────
  function loadBlob(url, onProgress, onDone, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onprogress = function (e) {
      if (e.lengthComputable) onProgress(e.loaded, e.total);
    };

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        onDone(URL.createObjectURL(this.response));
      } else {
        onError(this.status);
      }
    };

    xhr.onerror = function () { onError('network'); };
    xhr.send();
  }

  // ── Time helpers ──────────────────────────────────────────
  function getMins(t) { return t.h * 60 + t.m; }

  function isInWindow() {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= getMins(TIME_START) && cur < getMins(TIME_END);
  }

  function getSecondsUntilStart() {
    const now = new Date();
    const cur = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const start = getMins(TIME_START) * 60;
    return start > cur ? start - cur : null;
  }

  function formatCountdown(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  // ── Time notice update ────────────────────────────────────
  function updateTimeNotice() {
    if (isPlaying) return; // don't touch UI while playing

    const notice  = $('timeNotice');
    const text    = $('timeText');
    const cd      = $('countdown');
    const btnPlay = $('btnPlay');

    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const startM = getMins(TIME_START);
    const endM   = getMins(TIME_END);

    if (cur < startM) {
      // Before window
      notice.className = 'time-notice waiting';
      text.textContent = `Bài thi mở lúc ${TIME_START.h}:${String(TIME_START.m).padStart(2,'0')}`;
      const secsLeft = getSecondsUntilStart();
      cd.textContent = secsLeft !== null ? formatCountdown(secsLeft) : '';
      if (isLoaded && !hasPlayed()) btnPlay.disabled = true;

    } else if (cur >= startM && cur < endM) {
      // In window
      notice.className = 'time-notice open';
      text.textContent = `✅ Đã đến giờ thi — bài đóng lúc ${TIME_END.h}:${String(TIME_END.m).padStart(2,'0')}`;
      cd.textContent = '';
      if (isLoaded && !hasPlayed()) btnPlay.disabled = false;

    } else {
      // After window
      notice.className = 'time-notice closed';
      text.textContent = 'Đã hết giờ thi';
      cd.textContent = '';
      if (isLoaded) btnPlay.disabled = true;
    }
  }

  // ── localStorage helpers ──────────────────────────────────
  function storageKey() { return `izone_played_${CONFIG.testId}`; }
  function hasPlayed()  { return localStorage.getItem(storageKey()) === '1'; }
  function markPlayed() { localStorage.setItem(storageKey(), '1'); }

  // ── Sound check ───────────────────────────────────────────
  function openSoundcheck() {
    const modal    = $('scModal');
    const audioSC  = $('audioSoundcheck');
    const waveform = $('waveform');
    const status   = $('scStatus');

    modal.classList.add('open');
    playSoundcheck();

    function playSoundcheck() {
      audioSC.src = soundcheckObjectUrl;
      audioSC.currentTime = 0;
      audioSC.play();
      waveform.classList.remove('paused');
      status.textContent = 'Đang phát 30 giây đầu...';
      status.className = 'modal-status';
    }

    audioSC.ontimeupdate = function () {
      if (audioSC.currentTime >= SOUNDCHECK_DURATION) {
        audioSC.pause();
        waveform.classList.add('paused');
        status.textContent = '⏹ Đã dừng. Nghe lại hoặc xác nhận.';
        status.className = 'modal-status done';
      }
    };

    $('btnReplay').onclick = playSoundcheck;

    $('btnConfirm').onclick = function () {
      audioSC.pause();
      audioSC.src = '';
      waveform.classList.add('paused');
      modal.classList.remove('open');
      soundcheckDone = true;
    };
  }

  // ── Main audio player ─────────────────────────────────────
  function startMainAudio() {
    const audioMain  = $('audioMain');
    const btnSC      = $('btnSoundcheck');
    const btnPlay    = $('btnPlay');
    const timeNotice = $('timeNotice');
    const loadSec    = $('loadSection');
    const playState  = $('playingState');
    const playFill   = $('playFill');
    const playTime   = $('playTime');

    // Stop soundcheck just in case
    $('audioSoundcheck').pause();
    $('scModal').classList.remove('open');

    // Hide controls
    btnSC.style.display      = 'none';
    btnPlay.style.display    = 'none';
    timeNotice.style.display = 'none';
    loadSec.style.display    = 'none';

    // Show playing UI
    playState.style.display = 'flex';
    isPlaying = true;
    markPlayed();

    // Set up audio
    audioMain.src = mainObjectUrl;
    audioMain.currentTime = 0;
    audioMain.play();

    // Anti-pause
    audioMain.addEventListener('pause', function () {
      if (!audioMain.ended) audioMain.play();
    });

    // Anti-seek
    let lastTime = 0;
    audioMain.addEventListener('timeupdate', function () {
      const cur = audioMain.currentTime;
      const dur = audioMain.duration || 0;

      // If seeked more than 1s forward or any backward
      if (Math.abs(cur - lastTime) > 1.5 && !audioMain.paused) {
        audioMain.currentTime = lastTime;
        return;
      }
      lastTime = cur;

      // Update progress
      if (dur > 0) {
        playFill.style.width = (cur / dur * 100) + '%';
        playTime.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      }
    });

    audioMain.addEventListener('ended', function () {
      isPlaying = false;
      playState.style.display = 'none';
      $('endedState').style.display = 'flex';
    });
  }

  // ── Main init ─────────────────────────────────────────────
  function init() {
    buildUI();

    // Already played?
    if (hasPlayed()) {
      $('alreadyPlayed').style.display = 'flex';
      $('loadSection').style.display   = 'none';
      $('timeNotice').style.display    = 'none';
      $('btnSoundcheck').style.display = 'none';
      $('btnPlay').style.display       = 'none';
      return;
    }

    // Start timer loop
    updateTimeNotice();
    timerInterval = setInterval(updateTimeNotice, 1000);

    // Wire up buttons
    $('btnSoundcheck').onclick = openSoundcheck;
    $('btnPlay').onclick = startMainAudio;

    // Load soundcheck blob (small file, quick)
    loadBlob(
      CONFIG.soundcheckUrl,
      function () {}, // no progress UI for soundcheck
      function (url) { soundcheckObjectUrl = url; },
      function ()    { /* silent fail — soundcheck optional */ }
    );

    // Load main audio blob
    loadBlob(
      CONFIG.audioUrl,
      function (loaded, total) {
        const pct = Math.round(loaded / total * 100);
        $('loadFill').style.width   = pct + '%';
        $('loadText').textContent   = `${pct}% (${(loaded/1048576).toFixed(1)} MB / ${(total/1048576).toFixed(1)} MB)`;
        $('loadLabel').textContent  = '⏳ Đang tải audio...';
      },
      function (url) {
        mainObjectUrl = url;
        isLoaded = true;

        $('loadFill').style.width      = '100%';
        $('loadFill').classList.add('done');
        $('loadText').textContent      = '100%';
        $('loadLabel').textContent     = '✅ Tải xong — Sẵn sàng!';
        $('btnSoundcheck').disabled    = false;

        updateTimeNotice(); // re-check now that audio is ready
      },
      function (err) {
        $('loadLabel').textContent = '❌ Không tải được audio. Kiểm tra kết nối và thử lại.';
        $('loadLabel').style.color = '#c62828';
      }
    );
  }

  // ── Boot ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
