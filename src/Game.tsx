import React from "react";
import { Result } from "@/components/Result";
import { GuessInput } from "components/GuessInput";
import { Hint } from "components/Hint";
import { WORDS } from "@/constants";
import "styles/game.css";

const word = WORDS[Math.floor(Math.random() * WORDS.length)];

export function Game() {
  const [hint, setHint] = React.useState<string>(word.hint);
  const [prefix, setPrefix] = React.useState<string>("");
  const [suffix, setSuffix] = React.useState<string>("");
  const [guesses, setGuesses] = React.useState<string[]>([]);
  const [gameStatus, setGameStatus] = React.useState<string>("playing");

  const handleLosers = (pre: string, init_hint: string, post: string) => {
    if (pre + init_hint + post === word.answer) {
      setGameStatus("won");
    }
  }

  const handleHintLeft = () => {
    let solutionLength = word.prefix.length;
    let currentLength = prefix.length;
    let nextPrefix = word.prefix.substr(solutionLength - (currentLength + 1), solutionLength);
    setPrefix(nextPrefix);
    handleLosers(nextPrefix, hint, suffix);
  };

  const handleHintRight = () => {
    let currentLength = suffix.length;
    let nextSuffix = word.suffix.substr(0, currentLength+1);
    setSuffix(nextSuffix);  
    handleLosers(prefix, hint, nextSuffix);
  };

  const handleGuess = (guess: string) => {
    const newGuesses: string[] = [...guesses, guess];
    setGuesses(newGuesses);
    let currentHint = prefix + hint + suffix;
    if (newGuesses.length <= 6 && guess.includes(currentHint) && guess.length > currentHint.length) {
      setGameStatus("won");
    } else if (newGuesses.length >= 6 && !newGuesses.includes(word.answer)) {
      setGameStatus("lost");
    }
  };

  const getHintWord = () => {
    if (gameStatus === "won") {
      return guesses[guesses.length - 1];
    } else {
      return prefix + hint + suffix;
    }
  };

  return (
    <div className="game-wrapper">
      <div className="rules">
        <h3>Guess a word that contains the letters below.</h3>
        <h3>Use the arrow buttons for MORE HINT.</h3>
        <br />
        <h3>Resist <span className="temptation">temptation</span>.</h3>
      </div>
      {gameStatus == "playing" && <Hint word={getHintWord()} leftEnabled={prefix !== word.prefix} rightEnabled={suffix !== word.suffix} handleHintLeft={handleHintLeft} handleHintRight={handleHintRight} />}
      
      {gameStatus !== "playing" && <h2>{getHintWord()}</h2>}
      

      {gameStatus == "playing" && (
        <GuessInput
          handleGuess={handleGuess}
          hint={prefix + hint + suffix}
          status={gameStatus}
        />
      )}

      {gameStatus === "won" && (
        <Result variant="happy">
          <>
            <p>Congratulations!</p>
            <p>
              You put the {prefix + hint + suffix} in {guesses[guesses.length - 1]}.
            </p>
          </>
        </Result>
      )}
      {gameStatus === "lost" && (
        <Result variant="sad">
          <>
            <p>Oh no!</p>
            <p>The correct answer was {word.answer}.</p>
          </>
        </Result>
      )}
    </div>
  );
}
