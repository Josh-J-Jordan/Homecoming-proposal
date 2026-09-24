  const boxes = document.querySelectorAll('#code input');

  function getCode() {
    return Array.from(boxes).map(b => b.value).join('');
  }

  boxes.forEach((box, i) => {
    // Typing: keep digits only, then jump to next box
    box.addEventListener('input', () => {
      box.value = box.value.replace(/\D/g, '');
      if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
      if (getCode().length === boxes.length) {
        console.log('Full code:', getCode());
      }
    });

    // Backspace on an empty box: go back to the previous one
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        boxes[i - 1].focus();
        boxes[i - 1].value = '';
      }
      if (e.key === 'ArrowLeft' && i > 0) boxes[i - 1].focus();
      if (e.key === 'ArrowRight' && i < boxes.length - 1) boxes[i + 1].focus();
    });

    // Pasting: spread digits across the boxes
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const digits = (e.clipboardData.getData('text') || '')
        .replace(/\D/g, '')
        .slice(0, boxes.length - i);
      [...digits].forEach((d, j) => (boxes[i + j].value = d));
      boxes[Math.min(i + digits.length, boxes.length - 1)].focus();
    });
  });

  const message = document.getElementById('message');

  document.getElementById('codeForm').addEventListener('submit', (e) => {
    e.preventDefault();
        if(getCode().length === 5) {
            if(getCode() === '12726'){
            message.innerHTML = '<p> Correct! </p> <a href="proposal-page.html"><img id="next-button" src="Images/next.png"></a>';
            message.className = 'message success';
        }else{
            message.innerHTML = '<p> Nope! try again </p>';
            message.className = 'message error';
            boxes.forEach(b => (b.value= ''));
            boxes[0].focus();
        }
    }
  });

  boxes.forEach(b => b.addEventListener('input', () => {
    message.innerHTML ='';
  }));

 