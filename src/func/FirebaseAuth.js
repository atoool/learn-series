import auth from '@react-native-firebase/auth';

export const Signup = async (email, pass) => {
  let success = false;
  await auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(() => {
      success = true;
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        auth()
          .signInWithEmailAndPassword(email, pass)
          .then(() => {
            success = true;
          })
          .catch((e) => {});
      }

      if (error.code === 'auth/invalid-email') {
      }
    });
  return success;
};
