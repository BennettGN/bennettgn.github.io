  // Initialize data
  const plaintext = "bennettgodinhonelson@gmail.com"; 
  const iterations = 2; 
  const originalLength = plaintext.length;

  // Perform the base64 encoding iterations
  let encoded = plaintext;
  for (let i = 0; i < iterations; i++) {
    encoded = btoa(encoded);
  }

  // Slice the encoded string to match the original length
  const encoded_letters = encoded.split('').slice(0, originalLength);

  // Injecting letters into the obfuscated field
  const obfuscatedField = document.getElementById('obfuscatedField');
  encoded_letters.forEach((letter, i) => {
    const letterElement = document.createElement('span');
    letterElement.classList.add('letter', 'obfuscated');
    letterElement.id = String(i);
    letterElement.textContent = letter;
    obfuscatedField.appendChild(letterElement);
  });

  // Script for revealing letters
  const letters = document.querySelectorAll('.letter');
  const letter_levels = new Array(letters.length).fill(0);
  const steps = [encoded];
  
  // Generate the steps for decoding
  for (let i = 0; i < iterations; i++) {
    steps.push(atob(steps[steps.length - 1]));
  }

  // Event listener for revealing letters
  letters.forEach((letter, i) => {
    letter.addEventListener('mouseenter', () => revealAll(i));
  });

  obfuscatedField.querySelector("sup")?.addEventListener('mouseenter', () => revealAll(letters.length - 1));

  // Revealing logic
  function revealAll(startPoint) {
    let leftEnd = startPoint - 1;
    let rightEnd = startPoint + 1;
    revealLetter(startPoint);

    // Set an interval for revealing letters
    const revealInterval = setInterval(() => {
      for (let i = leftEnd; i <= rightEnd; i++) {
        if (i >= 0 && i < letters.length) {
          revealLetter(i);
        }
      }
      leftEnd--;
      rightEnd++;

      // Check if all letters are revealed
      if (letter_levels[0] === iterations && letter_levels[letters.length - 1] === iterations) {
        clearInterval(revealInterval);

        // Reveal all letters immediately
        for (let i = 0; i < letters.length; i++) {
          revealLetter(i);
        }

        setTimeout(() => {
          everythingRevealed();
        }, 200);
      }
    }, 50);
  }

  // Reveals a letter at a given index
  function revealLetter(i) {
    if (letter_levels[i] < iterations) {
      letter_levels[i]++;
      letters[i].textContent = steps[letter_levels[i]][i];
    } else {
      letters[i].textContent = steps[steps.length - 1][i];
      letters[i].classList.remove('obfuscated');
      letters[i].classList.add('revealed');
    }
  }

  // After all letters are revealed, replace with a mailto link
  function everythingRevealed() {
    obfuscatedField.innerHTML = '';
    const linkEl = document.createElement('a');
    linkEl.textContent = steps[steps.length - 1];
    linkEl.href = 'mailto:' + steps[steps.length - 1];
    obfuscatedField.classList.add('revealed');
    obfuscatedField.appendChild(linkEl);
  }