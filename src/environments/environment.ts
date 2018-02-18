// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDrXp6pbULrBWtTnaVQL4LWCwX1aiFM19I',
    authDomain: 'ng-fitness-tracker-97fec.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-97fec.firebaseio.com',
    projectId: 'ng-fitness-tracker-97fec',
    storageBucket: 'ng-fitness-tracker-97fec.appspot.com',
    messagingSenderId: '988639439966'
  }
};
