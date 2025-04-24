  let official = {};
  let nonofficial = {};
  const chime = new Audio("sound1.wav");

function playSound() {
  chime.currentTime = 0; // rewind if user clicks fast
  chime.play();
}

  async function generate() {
    if (Object.keys(official).length === 0 || Object.keys(nonofficial).length === 0) {
      const res = await fetch('official.json');
      official = await res.json();
      const fallbackRes = await fetch('nonofficial.json');
      nonofficial = await fallbackRes.json();
    }

    const word = document.getElementById("wordInput").value.toLowerCase();
    const result = document.getElementById("result");
    result.innerHTML = "";
    playSound();

    const allPaths = [];

    function backtrack(index, path) {
      if (index === word.length) {
        allPaths.push([...path]);
        return;
      }

      let found = false;

      // Try 2-letter official match
      if (index + 1 < word.length) {
        const two = word[index] + word[index + 1];
        const sym2 = two[0].toUpperCase() + two[1].toLowerCase();
        if (official[sym2]) {
          path.push({ symbol: sym2, ...official[sym2] });
          backtrack(index + 2, path);
          path.pop();
          found = true;
        }
      }

      // Try 1-letter official match
      const one = word[index].toUpperCase();
      if (official[one]) {
        path.push({ symbol: one, ...official[one] });
        backtrack(index + 1, path);
        path.pop();
        found = true;
      }

      // Use non-official fallback (guaranteed match)
      if (!found) {
        const lower = word[index];
        const fallback = nonofficial[lower];
        path.push({
          symbol: fallback.symbol.toUpperCase(),
          number: fallback.number,
          name: fallback.name,
          fake: true
        });
        backtrack(index + 1, path);
        path.pop();
      }
    }

    backtrack(0, []);

    if (allPaths.length > 1) {
      const msg = document.createElement("p");
      msg.className = "result-heading";
      msg.textContent = "Looks like there are multiple ways to spell this!";
      result.appendChild(msg);
    }

    allPaths.forEach((path, index) => {
      if (allPaths.length > 1) {
        const optionLabel = document.createElement("p");
        optionLabel.className = "result-heading";
        optionLabel.textContent = `Option ${index + 1}`;
        result.appendChild(optionLabel);
      }

      const card = document.createElement("div");
      card.className = "card glass p-3 mb-4 fade-in";
card.style.setProperty('--delay', `${index * 0.3}s`);

const row = document.createElement("div");
row.className = "d-flex flex-wrap justify-content-center gap-2";

      path.forEach(p => {
        const box = document.createElement("div");
        box.className = "box" + (p.fake ? " fake" : "");

        const top = document.createElement("div");
        top.className = "top";
        top.textContent = p.number || "";

        const middle = document.createElement("div");
        middle.className = "middle";
        middle.textContent = p.symbol[0].toUpperCase() + p.symbol.slice(1).toLowerCase();

        const bottom = document.createElement("div");
        bottom.className = "bottom";
        bottom.textContent = p.name || "";

        box.appendChild(top);
        box.appendChild(middle);
        box.appendChild(bottom);
        row.appendChild(box);
      });

      card.appendChild(row);
result.appendChild(card);
    });
  document.getElementById("wordInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    generate();
  }
  });
    
  }
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }