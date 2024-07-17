import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';

export interface Todo {
  title: string;
  description: string;
  done: boolean;
  id: string;
}

const List = ({ navigation }: any) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        console.log('UPDATED');

        const todos: Todo[] = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
        });

        setTodos(todos);
      },
    });

    return () => subscriber();
  }, []);

  const addTodo = async () => {
    const doc = await addDoc(collection(FIRESTORE_DB, 'todos'), { title: todoTitle, description: todoDescription, done: false });
    setTodoTitle('');
    setTodoDescription('');
  };

  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    };

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    const editItem = () => {
      setSelectedTodo(item);
      setTodoTitle(item.title);
      setTodoDescription(item.description);
      setModalVisible(true);
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
          {!item.done && <Entypo name="circle" size={32} color="black" />}
          <Text style={styles.todoText}>{item.title}</Text>
        </TouchableOpacity>
        <Ionicons name="create-outline" size={24} color="blue" onPress={editItem} />
        <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
      </View>
    );
  };

  const saveEditTodo = async () => {
    if (selectedTodo) {
      const ref = doc(FIRESTORE_DB, `todos/${selectedTodo.id}`);
      await updateDoc(ref, { title: todoTitle, description: todoDescription });
      setSelectedTodo(null);
      setTodoTitle('');
      setTodoDescription('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add task title"
          onChangeText={(text: string) => setTodoTitle(text)}
          value={todoTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Add task description"
          onChangeText={(text: string) => setTodoDescription(text)}
          value={todoDescription}
        />
        <Button onPress={addTodo} title="Add Task" disabled={todoTitle === '' || todoDescription === ''} />
      </View>

      <View>
        {todos.length > 0 && (
          <FlatList
            data={todos}
            renderItem={renderTodo}
            keyExtractor={(todo: Todo) => todo.id}
          />
        )}
      </View>

      {selectedTodo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Edit task title"
                onChangeText={(text: string) => setTodoTitle(text)}
                value={todoTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Edit task description"
                onChangeText={(text: string) => setTodoDescription(text)}
                value={todoDescription}
              />
              <Button onPress={saveEditTodo} title="Save Changes" />
              <Button
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSelectedTodo(null);
                }}
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    marginVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4,
  },
  todo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default List;



