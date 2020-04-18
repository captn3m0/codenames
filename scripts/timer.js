/**
 * Returns all the buttons
 */
function getTimerButtons () {
  return {
    start: document.querySelector('#timer-start'),
    pause: document.querySelector('#timer-pause'),
    resume: document.querySelector('#timer-resume'),
    reset: document.querySelector('#timer-reset'),
  };
}

/**
 * Shows requested timer buttons
 * @param {Array<string>} which 
 */
function showTimerButtons (which) {
  const buttons = getTimerButtons();

  Object.keys(buttons).forEach(action => {
    buttons[action].classList.add('hidden');
  });

  which.forEach(action => {
    buttons[action].classList.remove('hidden');
  });
}

/**
 * Creates a turn timer
 */
function createTurnTimer() {
  let totalTime;
  let secondsLeft;
  let startedAt;
  let running = false;

  function _setValues () {
    totalTime = parseInt(
      document.querySelector('#timer-input input').value,
      10
    );

    secondsLeft = totalTime;
  }

  function startTimer() {
    // Do nothing if already running
    if (running) {
      return;
    }

    _setValues();

    if (isNaN(totalTime)) {
      return;
    }

    _runTimer();

    showTimerButtons(['pause', 'reset']);
  }

  function updateTime() {
    // Calculate time
    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    // Update in UI
    document.querySelector('#timer-minutes .timer-digit').innerText = minutes;
    document.querySelector('#timer-seconds .timer-digit').innerText = seconds;

    document.querySelector('#timer-minutes .timer-text').innerText = minutes === 1 ? 'minute': 'minutes';
    document.querySelector('#timer-seconds .timer-text').innerText = seconds === 1 ? 'second' : 'seconds';

    showTime();
  }

  let timerInterval;

  function _runTimer() {
    startedAt = Date.now();

    updateTime();

    timerInterval = setInterval(() => {
      // Calculate time left
      const secondsElapsed = Math.floor((Date.now() - startedAt) / 1000);

      secondsLeft = totalTime - secondsElapsed;

      updateTime();

      if (secondsLeft <= 0) {
        _stopTimer();

        // Wait for UI to update before alerting
        setTimeout(() => {
          alert('Time is up!');
        });

        showTimerButtons(['start']);

        // TODO: Play audio
      }
    }, 1000);

    running = true;
  }

  function _stopTimer() {
    clearInterval(timerInterval);
    running = false;
  }

  function pauseTimer() {
    // Abort if not running
    if (!running) {
      return;
    }

    _stopTimer();

    showTimerButtons(['resume', 'reset']);
  }

  function resumeTimer() {
    // Abort if running
    if (running) {
      return;
    }

    totalTime = secondsLeft;

    _runTimer();

    showTimerButtons(['pause', 'reset']);
  }

  function showTime() {
    document.querySelector('#timer-time').classList.remove('hidden');
  }

  function resetTimer() {
    _stopTimer();
    _setValues();
    updateTime();
    
    showTimerButtons(['start']);
  }

  return {
    start: startTimer,
    reset: resetTimer,
    pause: pauseTimer,
    resume: resumeTimer,
  };
}

const turnTimer = createTurnTimer();

/**
 * Shows the timer elements
 */
function showTimerForm() {
  document.querySelector('#playarea').classList.add('has-timer');
  document.querySelector('#timer').classList.remove('hidden');

  // Show appropriate buttons
  showTimerButtons(['start']);
}

/**
 * Hides the timer elements
 */
function hideTimerForm() {
  turnTimer.reset();

  document.querySelector('#playarea').classList.remove('has-timer');
  document.querySelector('#timer').classList.add('hidden');
  document.querySelector('#timer-time').classList.add('hidden');
}

function attachTimerListeners () {
  // Listener for the checkbox
  document.querySelector('#timerCheck').addEventListener('change', (event) => {
    const checkbox = event.currentTarget;

    if (checkbox.checked) {
      showTimerForm();
    } else {
      hideTimerForm();
    }
  });

  const buttons = getTimerButtons();

  /**
   * Add listeners for all buttons
   */

  buttons.start.addEventListener('click', (event) => {
    event.preventDefault();

    turnTimer.start();
  });

  buttons.pause.addEventListener('click', (event) => {
    event.preventDefault();

    turnTimer.pause();
  });;

  buttons.resume.addEventListener('click', (event) => {
    event.preventDefault();

    turnTimer.resume();
  });

  buttons.reset.addEventListener('click', (event) => {
    event.preventDefault();

    turnTimer.reset();
  });;
}

attachTimerListeners();