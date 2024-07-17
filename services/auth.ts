import auth from '@react-native-firebase/auth';

export const signUp = async (email: string, password: string) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error(error);
  }
};
