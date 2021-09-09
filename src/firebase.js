import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const config = {
  apiKey: 'AIzaSyDAj11m4V4uaxO8RRM-FKIe0bhSn4vS0W4',
  authDomain: 'where-s-waldo-a6172.firebaseapp.com',
  databaseURL: 'https://where-s-waldo-a6172-default-rtdb.firebaseio.com/',
  storageBucket: 'where-s-waldo-a6172.appspot.com',
};
const app = initializeApp(config);

const database = getDatabase();

function setLocations(level, locations) {
  set(ref(database, 'levels/' + level), locations);
}

setLocations(0, {
  waldo: [475, 1548],
  wenda: [2141, 1395],
  odlaw: [2446, 1504],
});

setLocations(1, {
  odlaw: [323, 691],
  wizard: [810, 688],
  waldo: [1856, 736],
  wenda: [2320, 792],
  woof: [2042, 723],
});

setLocations(2, {
  waldo: [1217, 1237],
  wenda: [885, 1027],
  odlaw: [213, 1362],
  wizard: [2345, 1153],
  woof: [1764, 1795],
});

setLocations(3, {
  wizard: [209, 1448],
  odlaw: [926, 1215],
  wenda: [1471, 799],
  waldo: [2564, 1405],
  woof: [893, 1369],
});
