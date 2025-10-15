const envelopeWrapper = document.getElementById('envelope-wrapper');
const codeSection = document.getElementById('code-section');
const letterSection = document.getElementById('letter-section');
const codeInput = document.getElementById('code-input');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const letterContent = document.getElementById('letter-content');
const musicFab = document.getElementById('music-fab');
const musicToggle = document.getElementById('music-toggle');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const bgMusic = document.getElementById('background-music');

let isPlaying = false;

envelopeWrapper.addEventListener('click', () => {
  envelopeWrapper.style.animation = 'fadeOut 0.5s forwards';
  setTimeout(() => {
    envelopeWrapper.classList.add('hidden');
    codeSection.classList.remove('hidden');
    codeInput.focus();
  }, 500);
});

unlockBtn.addEventListener('click', validateCode);

codeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    validateCode();
  }
});

musicToggle.addEventListener('click', toggleMusic);

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  } else {
    bgMusic.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  }
  isPlaying = !isPlaying;
}

async function validateCode() {
  const code = codeInput.value;
  
  try {
    const response = await fetch('/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    const result = await response.json();
    
    if (result.valid) {
      errorMsg.textContent = '';
      codeSection.style.animation = 'fadeOut 0.5s forwards';
      
      const letterResponse = await fetch('/letter');
      const letterData = await letterResponse.json();
      
      setTimeout(() => {
        codeSection.classList.add('hidden');
        letterContent.textContent = letterData.content;
        letterSection.classList.remove('hidden');
        
        setTimeout(() => {
          musicFab.classList.remove('hidden');
          bgMusic.play().then(() => {
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
          }).catch(error => {
            console.log('Autoplay diblokir, user perlu klik tombol musik');
          });
        }, 500);
      }, 500);
    } else {
      errorMsg.textContent = 'Kode salah! Coba ingat-ingat tanggal spesial kita ❤️';
      codeInput.value = '';
      codeInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        codeInput.style.animation = '';
      }, 500);
    }
  } catch (error) {
    errorMsg.textContent = 'Terjadi kesalahan. Coba lagi ya!';
  }
}