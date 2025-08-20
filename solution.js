
//O(N)
function findMissingLinear(arr) {
  let start = 1;
  let missing = [];
  for (let i = 0; i < arr.length; i++) {
    while (arr[i] !== start) {
      missing.push(start);
      start++;
      if (missing.length === 2) return missing;
    }
    start++;
  }
  while (missing.length < 2) {
    missing.push(start++);
  }
  return missing;
}


//O(logN)
function findMissingBinary(arr) {
  let missing1 = -1;
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    let diff = arr[mid] - (mid + 1);

    if (diff === 0) {
      low = mid + 1;
    } else {
      missing1 = mid + 1;
      high = mid - 1;
    }
  }

  if (missing1 === -1) {
    missing1 = arr.length + 1;
  }

  let missing2 = -1;
  low = 0;
  high = arr.length - 1;

  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    const expectedValue = arr[mid] < missing1 ? mid + 1 : mid + 2;
    let diff = arr[mid] - expectedValue;

    if (diff === 0) {
      low = mid + 1;
    } else {
      missing2 = expectedValue;
      high = mid - 1;
    }
  }

  if (missing2 === -1) {
    missing2 = arr.length + 2;
  }

  return [Math.min(missing1, missing2), Math.max(missing1, missing2)];
}



/**
 * Запускает набор тестов на корректность.
 */
function runCorrectnessTests() {
  const testCases = [
    { name: "Пропуск в начале", arr: [3, 4, 5, 6, 7], expected: [1, 2] },
    { name: "Пропуск в середине", arr: [1, 2, 5, 6, 7], expected: [3, 4] },
    { name: "Пропуск в конце", arr: [1, 2, 3, 4, 5], expected: [6, 7] },
    { name: "Смешанный пропуск", arr: [1, 2, 4, 6], expected: [3, 5] },
    {
      name: "Два пропущенных в начале",
      arr: [4, 5, 6, 7, 8],
      expected: [1, 2],
    },
    { name: "Два пропущенных в конце", arr: [1, 2, 3, 4, 5], expected: [6, 7] },
    {
      name: "Пропуски в начале и в конце",
      arr: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      expected: [1, 11],
    },
    {
      name: "Большие пропуски в начале",
      arr: [10, 11, 12, 13, 14, 15],
      expected: [1, 2],
    },
    {
      name: "Большие пропуски в середине",
      arr: [1, 2, 3, 4, 5, 10, 11, 12],
      expected: [6, 7],
    },
    {
      name: "Большие пропуски в конце",
      arr: [1, 2, 3, 4, 5, 6, 7, 8],
      expected: [9, 10],
    },
  ];

  console.log("--- Запуск тестов на корректность ---");
  testCases.forEach((test, index) => {
    const resultLinear = findMissingLinear(test.arr);
    const resultBinary = findMissingBinary(test.arr);

    const isLinearCorrect =
      JSON.stringify(resultLinear) === JSON.stringify(test.expected);
    const isBinaryCorrect =
      JSON.stringify(resultBinary) === JSON.stringify(test.expected);

    console.log(`\nТест ${index + 1}: ${test.name}`);
    console.log(`Ожидаемый результат: [${test.expected.join(", ")}]`);
    console.log(
      `Линейный поиск (findMissingLinear): Найдены [${resultLinear.join(
        ", "
      )}], Результат: ${isLinearCorrect ? "✅ Успех" : "❌ Ошибка"}`
    );
    console.log(
      `Бинарный поиск (findMissingNumbers): Найдены [${resultBinary.join(
        ", "
      )}], Результат: ${isBinaryCorrect ? "✅ Успех" : "❌ Ошибка"}`
    );
  });
}

runCorrectnessTests();

/**
 * Генерирует массив для тестирования.
 * @param {number} size - Общее количество элементов в последовательности.
 * @returns {{arr: number[], missing: number[]}} - Объект с тестовым массивом и пропущенными числами.
 */
function generateTestArray(size) {
  const allNumbers = Array.from({ length: size }, (_, i) => i + 1);

  let num1 = Math.floor(Math.random() * size) + 1;
  let num2;
  do {
    num2 = Math.floor(Math.random() * size) + 1;
  } while (num2 === num1);

  const missingNumbers = [Math.min(num1, num2), Math.max(num1, num2)];
  const arr = allNumbers.filter((n) => n !== num1 && n !== num2);

  return { arr, missing: missingNumbers };
}

/**
 * Выполняет тест и выводит результаты.
 * @param {string} testName - Имя теста.
 * @param {number} size - Размер массива.
 */
function runTest(testName, size) {
  console.log(`\n--- Тест: ${testName} (Размер: ${size} элементов) ---`);
  const { arr, missing } = generateTestArray(size);

  console.log(`Истинные пропущенные числа: [${missing.join(", ")}]`);

  // Тест для линейного поиска
  let startTime = performance.now();
  const resultLinear = findMissingLinear(arr);
  let endTime = performance.now();
  const timeLinear = (endTime - startTime).toFixed(2);
  const successLinear =
    resultLinear[0] === missing[0] && resultLinear[1] === missing[1];
  console.log(
    `Линейный поиск (findMissingLinear): Найдены [${resultLinear.join(
      ", "
    )}], Результат: ${
      successLinear ? "✅ Успех" : "❌ Ошибка"
    }, Время: ${timeLinear} мс`
  );

  // Тест для бинарного поиска
  startTime = performance.now();
  const resultBinary = findMissingBinary(arr);
  endTime = performance.now();
  const timeBinary = (endTime - startTime).toFixed(2);
  const successBinary =
    resultBinary[0] === missing[0] && resultBinary[1] === missing[1];
  console.log(
    `Бинарный поиск (findMissingNumbers): Найдены [${resultBinary.join(
      ", "
    )}], Результат: ${
      successBinary ? "✅ Успех" : "❌ Ошибка"
    }, Время: ${timeBinary} мс`
  );
}

runTest("Малый массив", 1000);
runTest("Средний массив", 100000);
runTest("Большой массив", 1000000);
