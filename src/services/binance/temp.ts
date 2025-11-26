const getNextPlate = () => Math.floor(Math.random() * 1000);

const testNextPlate = () => {
  let min = 999;
  let max = 0;

  while (min > 0 || max < 999) {
    const plate = getNextPlate();

    if (plate < min || plate > max) {
      if (plate < min) min = plate;
      if (plate > max) max = plate;
      console.log(`${min} - ${max}`)
    }
  }
}

const playGame = () => {
  const plates: number[] = [];

  while (true) {
    const nextPlate = getNextPlate();
    const pair = 1000 - nextPlate;

    const isWin = plates.includes(pair);
    plates.push(nextPlate);

    if (isWin) break;
  }

  // console.log({ plates, length: plates.length });
  return plates.length;
}

const TRIALS = 100_000_000;

const runTrials = () => {
  let averagePlatesNeeded = 0;
  let trials = 0;

  while (trials < TRIALS) {
    const plates = playGame();
    averagePlatesNeeded =
      (averagePlatesNeeded * trials + plates) / (trials + 1);
    trials += 1;

    if (trials % 100_000 === 0) {
      console.log({ averagePlatesNeeded, trials });

    }
  }
}

runTrials();