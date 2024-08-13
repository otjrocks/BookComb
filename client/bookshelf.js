function getRootCssStyles(rootRule = ":root") {
    // Get all CSS rules for the document using Array methods
    const cssRulesArray = [...document.styleSheets]
        .map(styleSheet => {
            try {
                return [...styleSheet.cssRules]
                    .map(rule => rule)
            } catch (e) {
                // console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
            }
        })

    var cssVars = [];
    // Get custom styles from root css rule 
    Object.values(cssRulesArray).forEach(arrayElement => {
        Object.values(arrayElement).forEach(ruleElement => {
            if (ruleElement.selectorText === rootRule) {
                Object.values(ruleElement.style).forEach(style => {
                    if (style.startsWith('--spine-') && cssVars.indexOf(style) == -1) {
                        cssVars.push(style);
                    }
                })
            }
        })
    })

    return cssVars;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  let spines = Object.values(document.getElementsByClassName("spine"));
  let covers = Object.values(document.getElementsByClassName("cover"));
  let tops = Object.values(document.getElementsByClassName("top"));
  
  let availablePatterns = getRootCssStyles();
  
  let availableColors = [
    "maroon",
    "darkgreen",
    "darkolivegreen",
    "brown",
    "saddlebrown",
    "sienna",
    "midnightblue",
  ];
  
  // assign a random height, pattern and colour to each book
  spines.map(function (s, i) {
    let randomHeight = getRandomInt(220, 290);
    s.style.height = `${randomHeight}px`;
    s.style.top = `${280 - randomHeight}px`;
  
    let randomPattern = randomChoice(availablePatterns);
    s.style.backgroundImage = `var(${randomPattern})`;
  
    let randomColor = randomChoice(availableColors);
    s.style.backgroundColor = randomColor;
  
    covers[i].style.height = `${randomHeight}px`;
    covers[i].style.top = `${280 - randomHeight}px`;
  
    tops[i].style.top = `${280 - randomHeight}px`;
  });