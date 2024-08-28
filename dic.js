import readline from "readline-sync";

const title = `

     █████  ███                   ███         
    ░░███  ░░░                   ░░░          
  ███████  ████   ██████         █████  █████ 
 ███░░███ ░░███  ███░░███       ░░███  ███░░  
░███ ░███  ░███ ░███ ░░░         ░███ ░░█████ 
░███ ░███  ░███ ░███  ███        ░███  ░░░░███
░░████████ █████░░██████  ██     ░███  ██████ 
 ░░░░░░░░ ░░░░░  ░░░░░░  ░░      ░███ ░░░░░░  
                             ███ ░███         
                            ░░██████          
                             ░░░░░░           

`;

// color and font-style codes
const green = "\x1b[32m";

const bold = "\x1b[1m";
const dim = "\x1b[2m";
const clear = "\x1b[0m";

// display title
// console.log(`${bold}${title}${clear}`);
console.log(title);
console.log("A dictionary for the commandline!");
console.log(`by ${green}shellheim${clear}@github.com`);

const word = readline.question("\nSearch Words: ");

const main = async (word) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status !== 404) {
        throw new Error(
          `An HTTP error occured with status code ${response.status}`,
        );
      }
      if (response.status === 404) {
        throw new Error(`Couldn't find any definitions for "${word}"`);
      }
    }

    const result = await response.json();

    // This function is invoked when there are no values for the first type of data, i.e., if there is no main 'phoenetic' key in the response and there are phoenetics in the key/array 'phoenetics' then this function will go through all such arrays one by one and pick the first non-empty option.
    const getValueFromKey = (key, subKey) => {
      for (const element of result) {
        if (element[key]) {
          for (const subItem of element[key]) {
            if (subItem[subKey] && subItem[subKey] !== "") {
              return subItem[subKey];
            }
          }
        }
      }
      //If there are absolutely NO sub items
      return "Not Found";
    };

    //TODO: If definitions < 3, only show left definitions instead of "undefined"
    const getDefinitions = () => {
      const allDefinitions = result.flatMap((entry) =>
        entry.meanings.flatMap((meaning) =>
          meaning.definitions.map((def) => def.definition),
        ),
      );
      return allDefinitions;
    };
    const displayDefinitions = () => {
      let count = 0;
      const maxIterations = 3;
      const definitions = getDefinitions();

      for (const element of definitions) {
        if (count >= maxIterations) return;
        console.log(
          `      ${bold}${definitions.indexOf(element) + 1}.${clear} ${element}\n`,
        );
        count++;
      }
    };
    const phonetic = getValueFromKey("phonetics", "text");
    const partOfSpeech = getValueFromKey("meanings", "partOfSpeech");

    const capitalizeFirstLetter = (word) => {
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    };
    console.log(`
      ${bold}${capitalizeFirstLetter(word)}${clear}
      ${dim}${phonetic}${clear}\n
      ${bold}${partOfSpeech}${clear}
      `);
    displayDefinitions();
  } catch (error) {
    console.error(error);
  }
};
main(word);
