import auth from '@react-native-firebase/auth';

export const Signup = async (email, pass) => {
  let success = false;
  await auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(() => {
      console.warn('User account created & signed in!');
      success = true;
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.warn('That email address is already in use!');
        auth()
          .signInWithEmailAndPassword(email, pass)
          .then(() => {
            console.warn('Signed in');
            success = true;
          })
          .catch(e => {
            console.warn(e);
          });
      }

      if (error.code === 'auth/invalid-email') {
        console.warn('That email address is invalid!');
      }
    });
  return success;
};
