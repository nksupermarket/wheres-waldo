import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

(function init() {
  const config = {
    apiKey: 'AIzaSyDAj11m4V4uaxO8RRM-FKIe0bhSn4vS0W4',
    authDomain: 'where-s-waldo-a6172.firebaseapp.com',
    projectId: 'where-s-waldo-a6172',
  };
  initializeApp(config);

  (async function uploadAnswers() {
    const db = getFirestore();

    const answer = await getDoc(doc(db, 'answers', '0'));
    if (answer.exists()) return;

    const answers = [
      { waldo: [475, 1548], wenda: [2141, 1395], odlaw: [2446, 1504] },
      {
        odlaw: [323, 691],
        wizard: [810, 688],
        waldo: [1856, 736],
        wenda: [2320, 792],
        woof: [2042, 723],
      },
      {
        waldo: [1217, 1237],
        wenda: [885, 1027],
        odlaw: [213, 1362],
        wizard: [2345, 1153],
        woof: [1764, 1795],
      },
      {
        wizard: [209, 1448],
        odlaw: [926, 1215],
        wenda: [1471, 799],
        waldo: [2564, 1405],
        woof: [893, 1369],
      },
      {
        waldo: [842, 655],
        wenda: [757, 1381],
        wizard: [1837, 1652],
        odwald: [1799, 1230],
      },
      {
        wenda: [1799, 1303],
        odwald: [1671, 1549],
        waldo: [2111, 832],
        wizard: [2072, 1305],
        woof: [1558, 1261],
      },
      {
        waldo: [2676, 1288],
        odlaw: [1981, 1088],
        wizard: [755, 949],
        wenda: [398, 1645],
      },
    ];

    answers.forEach((answer, index) =>
      setDoc(doc(db, 'answers', `${index}`), answer)
    );
  })();
})();

async function pullAnswers(level) {
  const db = getFirestore();

  const answers = await getDoc(doc(db, 'answers', `${level}`));
  if (answers.exists()) return answers.data();
}

async function pullLeaderboard(level) {
  const db = getFirestore();

  const leaderboard = await getDoc(doc(db, 'leaderboard', 'allLevels'));
  if (leaderboard.exists()) return leaderboard.data()[level];
  return null;
}

async function updateLeaderboard(level, leaderboard) {
  const db = getFirestore();
  const allLeaderboard = await getDoc(doc(db, 'leaderboard', 'allLevels'));
  if (allLeaderboard.exists())
    return db
      .collection('leaderboard')
      .doc('allLevels')
      .update({
        [level]: leaderboard,
      })
      .then(() => 'doc updated');
  console.log({ [level]: leaderboard });
  return setDoc(doc(db, 'answers', 'allLevels'), { [level]: leaderboard }).then(
    () => console.log('doc set')
  );
}

export { pullAnswers, pullLeaderboard, updateLeaderboard };
